import React, { useEffect, useState } from 'react';
import { StyleSheet, Keyboard, Alert } from 'react-native';
import { Pressable, View, Text, ScrollView, KeyboardAvoidingView } from '../../../components/elements';
import { useNetInfo } from '@react-native-community/netinfo';
import { convertIntervalForStorage } from '../../../helpers/functions';
import { useAddRowCallback, useCell, useDelRowCallback, useRow, useSetRowCallback, useStore } from 'tinybase/ui-react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { tables } from '../../../database/schema';
import Form from '../../../components/form';
import { makes, models } from '../../../helpers/nhtsa';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Edit(props: { route: { params: { id: string }}}): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const distanceUnit = useCell(tables.settings, 'local', 'distanceUnit');
  const netInfo = useNetInfo();
  const [makeArray, setMakeArray] = useState([]);
  const [modelArray, setModelArray] = useState([]);
  const isNewCar = props.route.params.id === undefined;
  const formMetaData = {
    nickname: {
      label: 'Nickname',
    },
    year: {
      label: 'Year',
      keyboardType: 'numeric',
    },
    make: {
      label: 'Make',
      input: 'text',
      condition: {
        formStateKey: 'manual_entry',
        value: true,
        constant_or: !netInfo.isConnected,
      },
    },
    make_id: {
      label: 'Make',
      input: 'dropdown',
      dropdownData: makeArray,
      disable: {
        disable: netInfo.isConnected && makeArray.length === 0,
        label: 'Loading makes...',
      },
      condition: {
        formStateKey: 'manual_entry',
        value: false,
        constant_and: netInfo.isConnected,
      },
    },
    model: {
      label: 'Model',
      input: 'text',
      condition: {
        formStateKey: 'manual_entry',
        value: true,
        constant_or: !netInfo.isConnected,
      },
    },
    model_id: {
      label: 'Model',
      input: 'dropdown',
      dropdownData: modelArray,
      disable: {
        disable: netInfo.isConnected && modelArray.length === 0,
        label: 'Loading models...',
      },
      condition: {
        formStateKey: 'manual_entry',
        value: false,
        constant_and: netInfo.isConnected,
      },
    },
    manual_entry: {
      label: undefined,
      input: 'toggle',
      toggleLabel: 'Enter Manually',
      disable: {
        label: 'No internet connection',
        disable: !netInfo.isConnected,
      },
    },
    vin: {
      label: 'VIN',
    },
    lpn: {
      label: 'License Plate',
    },
    notes: {
      label: 'Notes',
      textAreaOptions: {
        multiline: true,
        numberOfLines: 4,
      },
    },
    // annualUsage: {
    //   label: `Estimated Annual Usage (${distanceUnit})`,
    //   keyboardType: 'numeric',
    // },
  };

  const row = useRow(tables.cars, props.route.params.id) as Record<string, string>;
  const [formState, setFormState] = useState(() => Object.keys(formMetaData).reduce((state, key) => {
    if (key === 'manual_entry') {
      state[key] = (
        (row.make?.length > 0 && row.make_id?.toString().length === 0) ||
        (row.model?.length > 0 && row.model_id?.toString().length === 0)
      );
    } else {
      state[key] = row[key] || '';
    }
    return state;
  }, {}) as Record<string, string>);

  useEffect(() => {
    const doAsync = async () => {
      const theMakes = await makes();
      setMakeArray(theMakes.Results.map((item) => ({
        value: item.Make_ID,
        label: item.Make_Name,
      })));
    };
    doAsync();
  }, []);

  useEffect(() => {
    if (!isNewCar) {
      navigation.setOptions({ title: (row.nickname || 'Edit Car') as string });
    }
  }, [row.nickname]);

  useEffect(() => {
    if (typeof formState.make_id === 'object') {
      const make_obj = formState.make_id as { label: string };
      setFormState(prev => ({ ...prev, make: make_obj.label }));
    }
  }, [formState.make_id]);

  useEffect(() => {
    if (typeof formState.model_id === 'object') {
      const model_obj = formState.model_id as { label: string };
      setFormState(prev => ({ ...prev, model: model_obj.label }));
    }
  }, [formState.model_id]);

  useEffect(() => {
    const doAsync = async () => {
      let id_for_uri;
      if (typeof formState.make_id === 'object') {
        const make_obj = formState.make_id as { label: string, value: number };
        id_for_uri = make_obj.value;
      } else {
        id_for_uri = formState.make_id;
      }

      setModelArray((await models({ make_id: id_for_uri, modelyear: parseInt(formState.year) })).Results.map((item) => ({
        value: item.Model_ID,
        label: item.Model_Name,
      })));
    };
    doAsync();
  }, [formState.make_id, (formState.year.toString().length === 4 ? formState.year : null)]);

  const store = useStore();
  const saveFunction = () => {
    const newRow = Object.keys(formMetaData).filter((key) => [
      'nickname',
      'year',
      'make',
      'make_id',
      'model',
      'model_id',
      'vin',
      'lpn',
      // 'annualUsage',
    ].includes(key)).reduce((state, key) => {
      state[key] = formState[key];
      return state;
    }, {} as Record<string, string>);

    newRow.make = newRow.make.toUpperCase();
    newRow.model = newRow.model.toUpperCase();
    if (typeof newRow.make_id === 'object') {
      const make_obj = newRow.make_id as { value: string };
      newRow.make_id = make_obj.value;
    }
    if (typeof newRow.model_id === 'object') {
      const model_obj = newRow.model_id as { value: string };
      newRow.model_id = model_obj.value;
    }

    newRow.annualUsage = convertIntervalForStorage(newRow.annualUsage, 'dist', distanceUnit as 'Miles' | 'Kilometers');
    return newRow;
  };
  const save = isNewCar ?
    useAddRowCallback(tables.cars, saveFunction, [formState], store, () => goBack(), []) :
    useSetRowCallback(tables.cars, props.route.params.id, saveFunction, [formState], store, () => goBack(), []);
  const goBack = (callback?: () => void) => {
    Keyboard.dismiss();
    navigation.navigate('Index');
    if (callback !== undefined) {
      callback();
    }
  };
  const remove = useDelRowCallback(tables.cars, props.route.params.id, store, () => goBack(), []);
  const confirmDelete = () => {
    return Alert.alert(
      'Delete Car',
      'Are you sure you want to delete this car?',
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
    <KeyboardAvoidingView>
      <ScrollView>
        <Form formState={ formState } formMetaData={ formMetaData } onFormStateChange={ (key: string, value: string) => {
          setFormState(prev => ({ ...prev, [key]: value }));
        } } />
        <View style={ pageStyles.view }>
          {
            !isNewCar &&
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
            onPress={ save.bind(this) }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
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
  padding: {
    marginVertical: 10,
    padding: 10,
  },
});
