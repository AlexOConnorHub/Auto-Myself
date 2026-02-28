import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { View, Text, Pressable } from '@app/components/elements';
import { useAddRowCallback, useCell, useRow, useSetRowCallback, useSliceRowIds, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { getDateString, provideDateObj, formatNumberForSave } from '@app/helpers/numbers';
import { router, useLocalSearchParams } from 'expo-router';
import CallbackButton from '@app/components/elements/callbackButton';
import { MergeableStore, Store } from 'tinybase';
import { deleteRecord } from '@app/helpers/delete';
import ImagePicker from '@app/components/elements/imagePicker';

export default function RecordForm(): React.ReactElement {
  const { vehicle_id, record_id } = useLocalSearchParams<{ vehicle_id: string; record_id: string }>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
  const store = useStore() as MergeableStore;

  const record = useRow(tables.maintenance_records, record_id);

  const fileIds = useSliceRowIds('byRecord', record_id);
  const [newFileIds, setNewFileIds] = useState([] as Record<string, string>[]);
  const recordRows = useSliceRowIds('byVehicle', vehicle_id);

  const filesMapped = record_id ? fileIds.map((id) => ({ fileId: id, local_path: store.getCell(tables.files, id, 'local_path'), related_table: store.getCell(tables.files, id, 'related_table') }))
    .filter((file_data) => file_data.related_table === tables.maintenance_records) : newFileIds;

  const typesObj = {} as Record<string, Record<string, string>>;
  for (const vehicleRecordId of recordRows) {
    const vehicleRecord = store.getRow(tables.maintenance_records, vehicleRecordId) as Record<string, string>;
    if (!Object.hasOwn(typesObj, vehicleRecord.type)) {
      typesObj[vehicleRecord.type] ||= {};
      typesObj[vehicleRecord.type].date = vehicleRecord.date;
      typesObj[vehicleRecord.type].interval = vehicleRecord.interval;
      typesObj[vehicleRecord.type].interval_unit = vehicleRecord.interval_unit;
    }
  }

  const typesArray = Object.keys(typesObj).concat([
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
  ].filter((item) => !Object.keys(typesObj).includes(item)))
    .sort((a, b) => a.localeCompare(b))
    .map((item) => ({ value: item, label: item }));

  const handleFileChange = (result: Record<string, string>[]) => {
    for (const file of result) {
      if (record_id) {
        store.setRow(tables.files, file.fileId, {
          local_path: file.local_path,
          related_table: tables.maintenance_records,
          related_id: record_id,
        });
      } else {
        setNewFileIds(result);
      }
    }
  };

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
      input: 'custom',
      element: <ImagePicker onChange={handleFileChange} data={filesMapped} />,
    },
    notes: {
      label: 'Notes',
      textAreaOptions: {
        multiline: true,
        numberOfLines: 4,
      },
    },
  };
  const [formState, setFormState] = useState(Object.keys(formMetaData).reduce((state, key) => {
    if (key === 'date') {
      if (Object.hasOwn(record, 'date')) {
        state[key] = provideDateObj(record[key] as string);
      } else {
        state[key] = provideDateObj('');
      }
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
      interval: formatNumberForSave(`${formState.interval}`, 0),
      interval_unit: formState.interval_unit as unknown as string,
      cost: formatNumberForSave(`${formState.cost}`, 2),
      odometer: formatNumberForSave(`${formState.odometer}`, 0),
      notes: formState.notes as unknown as string,
      vehicle_id: vehicle_id,
    };
    if (formState.new_entry) {
      newRow.type = formState.type_custom;
    } else if (typeof formState.type === 'object') {
      const type_dropdown = formState.type as { value: string };
      newRow.type = type_dropdown.value;
    } else {
      newRow.type = formState.type;
    }

    if (formState.date as unknown as Date | string instanceof Date) {
      newRow.date = getDateString((formState.date as unknown) as Date);
    } else {
      newRow.date = formState.date;
    }
    return newRow;
  };

  const saveFiles = (newId: string | Store) => {
    if (isNewRecord) {
      for (const file of filesMapped) {
        store.setRow(tables.files, file.fileId, {
          local_path: file.local_path,
          related_table: tables.maintenance_records,
          related_id: newId as string,
        });
      }
    }
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
            goBack();
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
