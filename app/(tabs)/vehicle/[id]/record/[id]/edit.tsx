import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { View, Text, ScrollView, KeyboardAvoidingView, Pressable } from '@app/components/elements';
import { ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useAddRowCallback, useCell, useDelRowCallback, useRow, useSetRowCallback, useStore, useTable } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { StackNavigationProp } from '@react-navigation/stack';
import { displayTime, provideLocalTime } from '@app/helpers/localTime';

export default function Edit(props: Readonly<{ route: { params: { car_id: string; id: string; }} }>): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');

  const carRecords = useTable(tables.maintenance_records);
  const row = useRow(tables.maintenance_records, props.route.params.id);
  const typesObj = {} as Record<string, Record<string, string>>;

  for (const key of Object.keys(carRecords)) {
    const carRecord = carRecords[key] as Record<string, string>;
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

  const isNewRecord = props.route.params.id === undefined;
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
      if (Object.hasOwn(row, 'date')) {
        const row_date = row[key] as string;
        state[key] = provideLocalTime(row_date);
      } else {
        state[key] = new Date();
      }
    } else if (typeof row[key] === 'number') {
      state[key] = row[key].toString();
    } else {
      state[key] = row[key] || '';
    }

    return state;
  }, {}) as Record<string, string>);

  useEffect(() => {
    if (!isNewRecord) {
      navigation.setOptions({ title: 'Edit Record' });
    }
  }, [props.route.params.id]);

  const store = useStore();
  const saveFunction = () => {
    const formatNumber = (input) => {
      return Number(input.replace(/\D/, ''));
    };
    const newRow = {
      type: undefined,
      date: undefined,
      interval: formatNumber(formState.interval),
      interval_unit: formState.interval_unit,
      cost: formatNumber(formState.cost),
      odometer: formatNumber(formState.odometer),
      notes: formState.notes,
      car_id: props.route.params.car_id,
    };
    if (formState.new_entry) {
      newRow.type = formState.type_custom;
    } else if (typeof formState.type === 'object') {
      const type_dropdown = formState.type as { value: string };
      newRow.type = type_dropdown.value;
    } else {
      newRow.type = formState.type;
    }
    newRow.date = displayTime(provideLocalTime(formState.date));
    return newRow;
  };

  const addRecord = useAddRowCallback(tables.maintenance_records, saveFunction, [formState], store, () => goBack(), []);
  const updateRecord = useSetRowCallback(tables.maintenance_records, props.route.params.id, saveFunction, [formState], store, () => goBack(), []);

  const goBack = (callback?: () => void) => {
    Keyboard.dismiss();
    navigation.goBack();
    if (callback !== undefined) {
      callback();
    }
  };

  const remove = useDelRowCallback(tables.maintenance_records, props.route.params.id, store, () => goBack(), []);
  const confirmDelete = () => {
    return Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            remove();
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };
  return (
    <KeyboardAvoidingView style={ pageStyles.container }>
      <ScrollView>
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
          <Pressable
            key='save'
            onPress={isNewRecord ? addRecord : updateRecord}
            style={[
              pageStyles.pressable,
            ]}>
            <Text style={pageStyles.text}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formField: {
    marginBottom: 20,
    padding: 10,
  },
  deleteButton: {
    marginHorizontal: 10,
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
    fontSize: 20,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
});
