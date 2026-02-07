import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { View, Text, Pressable } from '@app/components/elements';
import { useAddRowCallback, useCell, useRow, useSetRowCallback, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { getDateString, provideDateObj, formatNumberForSave } from '@app/helpers/numbers';
import { router, useLocalSearchParams } from 'expo-router';
import CallbackButton from '@app/components/elements/callbackButton';
import { Directory, File, Paths } from 'expo-file-system';
import { createQueries, Store } from 'tinybase';
import { deleteRecord } from '@app/helpers/delete';

export default function RecordForm(): React.ReactElement {
  const { vehicle_id, record_id } = useLocalSearchParams<{ vehicle_id: string; record_id: string }>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
  const store = useStore();

  const record = useRow(tables.maintenance_records, record_id);

  const queries = createQueries(store);

  useEffect(() => {
    queries.setQueryDefinition('record_files', tables.files, ({ select, where }) => {
      select('related_id');
      where('related_table', tables.maintenance_records);
      where('related_id', record_id);
    });
    queries.setQueryDefinition('record_types', tables.maintenance_records, ({ select, where }) => {
      select('type');
      select('date');
      select('interval');
      select('interval_unit');
      where('car_id', vehicle_id);
    });
    return () => {
      queries.delQueryDefinition('record_files');
      queries.delQueryDefinition('record_types');
      queries.destroy();
    };
  }, [record_id, vehicle_id, store, queries]);

  const fileIds = Object.keys(queries.getResultTable('record_files'));
  const recordRows = queries.getResultTable('record_types');

  const typesObj = {} as Record<string, Record<string, string>>;
  for (const carRecord of Object.values(recordRows) as Record<string, string>[]) {
    if (!Object.hasOwn(typesObj, carRecord.type) || carRecord.date > typesObj[carRecord.type].date) {
      typesObj[carRecord.type] ||= {};
      typesObj[carRecord.type].date = carRecord.date;
      typesObj[carRecord.type].interval = carRecord.interval;
      typesObj[carRecord.type].interval_unit = carRecord.interval_unit;
    }
  }

  const typesArray = Object.keys(typesObj).map((key) => {
    return { ...typesObj[key], label: key, value: key };
  }).concat([
    'Oil change',
    'Coolant flush',
    'Cabin air filter',
    'Engine air filter',
    'Tire rotation',
    'Brake pads',
    'Brake rotors',
    'Brake pads & rotors',
    'Brake fluid',
    'Transmission fluid',
    'Spark plugs',
    'Transfer case fluid',
    'Serpentine belt',
    'Timing belt',
    'Power steering fluid',
    'Differential fluid',
    'Change tires',
    'Wheel alignment',
    'Battery',
    'Fuel filter',
    'Fuel injector',
    'Fuel pump',
  ].filter((item) => !Object.keys(typesObj).includes(item))
    .map((item) => ({ value: item, label: item })));
  typesArray.sort((a, b) => a.label.localeCompare(b.label));

  const isNewRecord = record_id === undefined;
  const formMetaData = {
    type_custom: {
      label: 'Maintenance Type',
      input: 'text',
      condition: {
        formStateKey: 'new_entry',
        value: true,
      },
    },
    type: {
      label: 'Maintenance Type',
      input: 'dropdown',
      dropdownData: typesArray,
      condition: {
        formStateKey: 'new_entry',
        value: false,
      },
    },
    new_entry: {
      input: 'toggle',
      toggleLabel: 'Not in List',
    },
    interval: {
      label: 'Maintenance Interval',
      keyboardType: 'numeric',
    },
    interval_unit: {
      label: 'Interval Unit',
      input: 'optionButtons',
      optionButtonOptions: [
        { key: 'dist', label: distanceUnit },
        { key: 'weeks', label: 'Weeks' },
        { key: 'months', label: 'Months' },
        { key: 'years', label: 'Years' },
      ],
    },
    cost: {
      label: 'Cost',
      keyboardType: 'numeric',
    },
    odometer: {
      label: `Odometer (${distanceUnit})`,
      keyboardType: 'numeric',
    },
    date: {
      label: 'Date',
      input: 'date',
    },
    photos: {
      label: 'Photos',
      input: 'photoPicker',
    },
    notes: {
      label: 'Notes',
      textAreaOptions: {
        multiline: true,
        numberOfLines: 4,
      },
    },
  };
  const [formState, setFormState] = useState(() => Object.keys(formMetaData).reduce((state, key) => {
    if (key === 'date') {
      if (Object.hasOwn(record, 'date')) {
        const row_date = record[key] as string;
        state[key] = provideDateObj(row_date);
      } else {
        state[key] = provideDateObj('');
      }
    } else if (key === 'photos') {
      state[key] = fileIds.map((id) => `${Paths.document.uri}/${vehicle_id}/${record_id}/${id}.jpg`);
    } else if (typeof record[key] === 'number') {
      state[key] = record[key].toString();
    } else {
      state[key] = record[key] || '';
    }

    return state;
  }, {}) as Record<string, string>);

  const saveFunction = () => {
    const newRow = {
      type: undefined,
      date: undefined,
      interval: formatNumberForSave(formState.interval, 0),
      interval_unit: formState.interval_unit,
      cost: formatNumberForSave(formState.cost, 2),
      odometer: formatNumberForSave(formState.odometer, 0),
      notes: formState.notes,
      car_id: vehicle_id,
    };
    if (formState.new_entry) {
      newRow.type = formState.type_custom;
    } else if (typeof formState.type === 'object') {
      const type_dropdown = formState.type as { value: string };
      newRow.type = type_dropdown.value;
    } else {
      newRow.type = formState.type;
    }

    if (formState.date as Date | string instanceof Date) {
      newRow.date = getDateString((formState.date as unknown) as Date);
    } else {
      newRow.date = formState.date;
    }
    return newRow;
  };

  const saveFiles = (newId: string | Store) => {
    const rowId = (isNewRecord ? newId : record_id) as string;

    const files = formState.photos;
    if (files.length !== 0) {
      let dir = new Directory(Paths.document, `${vehicle_id}`);
      if (!dir.exists) {
        dir.create();
      }
      dir = new Directory(Paths.document, `${vehicle_id}/${rowId}`);
      if (!dir.exists) {
        dir.create();
      }

      for (const filePath of files) {
        const newId = store.addRow(tables.files, {
          related_table: tables.maintenance_records,
          related_id: rowId,
        });

        const currentFile = new File(filePath);
        const finalFile = new File(dir, `${newId}.jpg`);
        currentFile.copy(finalFile);

        currentFile.delete();
      }
    }

    goBack();
  };

  const addRecord = useAddRowCallback(tables.maintenance_records, saveFunction, [formState], store, saveFiles, [formState]);
  const updateRecord = useSetRowCallback(tables.maintenance_records, record_id, saveFunction, [formState], store, saveFiles, [formState]);

  const goBack = () => {
    Keyboard.dismiss();
    router.back();
  };

  const confirmDelete = () => {
    return Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteRecord(store, record_id);
            goBack();
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };
  return (
    <View style={ pageStyles.container }>
      <Form formState={ formState } formMetaData={ formMetaData } onFormStateChange={ (key, value) => setFormState(prev => ({ ...prev, [key]: value })) } />
      <View style={ pageStyles.view }>
        {
          !isNewRecord &&
            <Pressable
              key='delete'
              onPress={ confirmDelete.bind(this) }
              style={[
                pageStyles.pressable,
              ]}>
              <Text style={pageStyles.text}>Delete</Text>
            </Pressable>
        }
        <CallbackButton
          pressable={{ style: pageStyles.pressable }}
          text={{ style: pageStyles.text }}
          title="Save"
          onPress={(callback) => {
            callback();
            if (isNewRecord) {
              addRecord();
            } else {
              updateRecord();
            }
          }}
        />
      </View>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
  },
  view: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressable: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  text: {
    textAlign: 'center',
  },
});
