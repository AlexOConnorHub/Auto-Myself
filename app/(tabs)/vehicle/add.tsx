import React, { useEffect, useState } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { Pressable, View, Text, ScrollView, KeyboardAvoidingView } from '@app/components/elements';
import { useNetInfo } from '@react-native-community/netinfo';
import { useAddRowCallback, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { makes, models } from '@app/helpers/nhtsa';
import { router } from 'expo-router';

export default function Edit(): React.ReactElement {
  const netInfo = useNetInfo();
  const [makeArray, setMakeArray] = useState([]);
  const [modelArray, setModelArray] = useState([]);
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
      autoFocus: false,
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
    license_plate: {
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
  const [formState, setFormState] = useState(() => Object.keys(formMetaData).reduce((state, key) => {
    if (key === 'manual_entry') {
      state[key] = false;
    } else {
      state[key] = '';
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
    const newRow = {
      nickname: formState.nickname,
      year: formState.year,
      make: formState.make.toUpperCase(),
      make_id: formState.make_id,
      model: formState.model.toUpperCase(),
      model_id: formState.model_id,
      vin: formState.vin,
      license_plate: formState.license_plate,
      notes: formState.notes,
      // annualUsage: formState.annualUsage,
    };

    if (typeof formState.make_id === 'object') {
      const make_obj = formState.make_id as { value: string };
      newRow.make_id = make_obj.value;
    }
    if (typeof formState.model_id === 'object') {
      const model_obj = formState.model_id as { value: string };
      newRow.model_id = model_obj.value;
    };

    return newRow;
  };

  const addRecord = useAddRowCallback(tables.cars, saveFunction, [formState], store, () => goBack(), []);

  const goBack = (callback?: () => void) => {
    Keyboard.dismiss();
    router.back();
    if (callback !== undefined) {
      callback();
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Form formState={ formState } formMetaData={ formMetaData } onFormStateChange={ (key: string, value: string) => {
          setFormState(prev => ({ ...prev, [key]: value }));
        } } />
        <View style={ pageStyles.view }>
          <Pressable
            key='save'
            onPress={ addRecord }
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
