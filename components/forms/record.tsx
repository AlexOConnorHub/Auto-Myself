import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { View } from '@app/components/elements';
import { useCell, useRow, useSetRowCallback, useSliceRowIds, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { getDateString, provideDateObj, formatNumberForSave } from '@app/helpers/numbers';
import { router, useLocalSearchParams } from 'expo-router';
import { MergeableStore } from 'tinybase';
import { deleteRecord, getId } from '@app/helpers/tinybase';
import ImagePicker from '@app/components/elements/imagePicker';
import { OptionButtons } from '../elements/optionButtons';
import FormElement from '../elements/formElement';

export default function RecordForm(): React.ReactElement {
  const { vehicle_id, record_id } = useLocalSearchParams<{ vehicle_id: string; record_id: string }>();
  const store = useStore() as MergeableStore;

  const random_id = getId(store.getRowIds(tables.maintenance_records));
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
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
    type_id: {
      label: 'Maintenance Type',
      input: 'dropdown',
      dropdownData: typesArray,
      condition: {
        formStateKey: 'new_entry',
        value: false,
      },
    },
    type: {
      label: 'Maintenance Type',
      input: 'text',
      condition: {
        formStateKey: 'new_entry',
        value: true,
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
    } else if (key === 'type_id') {
      state[key] = { value: record[key.substring(0, key.length - 3)], label: record[key.substring(0, key.length - 3)] };
    } else if (typeof record[key] === 'number') {
      state[key] = record[key].toString();
    } else {
      state[key] = record[key] || '';
    }

    return state;
  }, {}) as {
    type_id: { value: string; label: string, search: string };
    type: string;
    new_entry: boolean;
    interval: string;
    interval_unit: string;
    cost: string;
    odometer: string;
    date: Date | string;
    notes: string;
  });

  useEffect(() => {
    if (formState.type_id.value === 'new_item') {
      setFormState(prev => ({ ...prev, type: formState.type_id.search, new_entry: true }));
    } else {
      setFormState((prev) => {
        const netState = { ...prev, type: formState.type_id.label };
        if (typesObj[formState.type_id.value]) {
          if (!prev.interval || prev.interval.length === 0) {
            netState.interval = `${typesObj[formState.type_id.value].interval}`;
          }
          if (!prev.interval_unit || prev.interval_unit.length === 0) {
            netState.interval_unit = `${typesObj[formState.type_id.value].interval_unit}`;
          }
        }
        return netState;
      });
    }
  }, [formState.type_id.value]);

  const saveFunction = () => {
    const newRow = {
      type: formState.type,
      date: undefined,
      interval: formatNumberForSave(`${formState.interval}`, 0),
      interval_unit: formState.interval_unit as unknown as string,
      cost: formatNumberForSave(`${formState.cost}`, 2),
      odometer: formatNumberForSave(`${formState.odometer}`, 0),
      notes: formState.notes as unknown as string,
      vehicle_id: vehicle_id,
    };

    if (formState.date as unknown as Date | string instanceof Date) {
      newRow.date = getDateString((formState.date as unknown) as Date);
    } else {
      newRow.date = formState.date;
    }
    return newRow;
  };

  const saveFiles = () => {
    if (isNewRecord) {
      for (const file of filesMapped) {
        store.setRow(tables.files, file.fileId, {
          local_path: file.local_path,
          related_table: tables.maintenance_records,
          related_id: random_id,
        });
      }
    }
  };

  const updateRecord = useSetRowCallback(tables.maintenance_records, isNewRecord ? random_id : record_id, saveFunction, [formState], store, saveFiles, [formState]);

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
  const finalOptions = [
    { label: 'Save', key: 'save' },
  ];
  if (!isNewRecord) {
    finalOptions.unshift({ label: 'Delete', key: 'delete' });
  }
  return (
    <View style={ pageStyles.container }>
      <Form formState={ formState } formMetaData={ formMetaData } onFormStateChange={ setFormState } />
      <FormElement>
        <OptionButtons
          options={finalOptions}
          onSelect={(key, callback) => {
            if (key === 'delete') {
              confirmDelete();
            } else if (key === 'save') {
              updateRecord();
              goBack();
            }
            callback();
          }}
          highlightAll={true}
        />
      </FormElement>
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
