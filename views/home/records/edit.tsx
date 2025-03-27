import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { View, Text, ScrollView, KeyboardAvoidingView, Pressable } from '../../../components/elements';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { useAddRowCallback, useCell, useDelRowCallback, useRow, useSetRowCallback, useStore, useTable } from 'tinybase/ui-react';
import { tables } from '../../../database/schema';
import Form from '../../../components/form';
import { StackNavigationProp } from '@react-navigation/stack';
import { convertIntervalForStorage } from '../../../helpers/functions';

export default function Edit(props: Readonly<{ route: { params: { car_id: string; id: string; }} }>): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');

  const row = useRow(tables.maintenance_records, props.route.params.id);
  const types = useTable(tables.maintenance_types);
  const typesArray = Object.keys(types).map((key) => {
    return { value: key, label: types[key].name as string };
  });
  typesArray.sort((a, b) => a.label.localeCompare(b.label));
  typesArray.unshift({ value: 'new', label: 'New Maintenance Type' });

  const isNewRecord = props.route.params.id === undefined;
  const formStateGenerator = {
    maintenance_type_id: {
      label: 'Maintenance Type',
      input: 'dropdown',
      dropdownData: typesArray,
    },
    new_maintenance_type: {
      label: 'New Maintenance Type',
      condition: { formStateKey: 'maintenance_type_id', value: 'new' },
    },
    interval: {
      label: 'Maintenance Interval',
      keyboardType: 'numeric',
      condition: { formStateKey: 'maintenance_type_id', value: null, invert: true },
    },
    interval_unit: {
      label: 'Interval Unit',
      condition: { formStateKey: 'maintenance_type_id', value: null, invert: true },
      input: 'optionButtons',
      optionButtonOptions: [
        { key: 'dist', label: distanceUnit as string },
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
    notes: {
      label: 'Notes',
      textAreaOptions: {
        multiline: true,
        numberOfLines: 4,
      },
    },
  };

  const [formState, setFormState] = useState(() => Object.keys(formStateGenerator).reduce((state, key) => {
    state[key] = row[key] || '';
    return state;
  }, {}) as Record<string, string>);

  useEffect(() => {
    if (!isNewRecord) {
      navigation.setOptions({ title: 'Edit Record' });
    }
  }, [props.route.params.id]);

  const store = useStore();
  const saveFunction = () => {
    let maintenance_type_id = formState.maintenance_type_id;
    if (formState.maintenance_type_id === 'new') {
      const newType = {
        name: formState.new_maintenance_type,
      };
      maintenance_type_id = store.addRow(tables.maintenance_types, newType);
    }
    const newRow = Object.keys(formStateGenerator).filter((key) => !([
      'maintenance_type_id',
      'new_maintenance_type',
      'interval',
      'intervalUnit',
    ].includes(key)),
    ).reduce((state, key) => {
      state[key] = formState[key];
      return state;
    }, {} as { odometer: string, maintenance_type_id: string, car_id: string });
    newRow.maintenance_type_id = maintenance_type_id;
    newRow.car_id = props.route.params.car_id;
    newRow.odometer = convertIntervalForStorage(newRow.odometer, 'dist', distanceUnit as 'Miles' | 'Kilometers');
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
        <Form formState={ formState } formMetaData={ formStateGenerator } onFormStateChange={ (key, value) => setFormState(prev => ({ ...prev, [key]: value })) } />
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
