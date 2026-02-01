import React, { useEffect, useState } from 'react';
import { StyleSheet, Keyboard, Alert } from 'react-native';
import { Pressable, View, Text, Ionicons } from '@app/components/elements';
import { useNetInfo } from '@react-native-community/netinfo';
import { useAddRowCallback, useDelRowCallback, useRow, useSetRowCallback, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { makes, models, vinDecode } from '@app/helpers/nhtsa';
import { router, useLocalSearchParams } from 'expo-router';
import CallbackButton from '../callbackButton';
import VinScanner from '../vinScanner';

export default function VehicleForm(): React.ReactElement {
  const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();
  const netInfo = useNetInfo();
  const [makeArray, setMakeArray] = useState([]);
  const [modelArray, setModelArray] = useState([]);
  const [scanVin, setScanVin] = useState(false);
  const isNewCar = vehicle_id === undefined;
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
    color: {
      label: 'Color',
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
  };
  const row = useRow(tables.cars, vehicle_id) as Record<string, (string | number)>;
  const [formState, setFormState] = useState(() => Object.keys(formMetaData).reduce((state, key) => {
    if (key === 'manual_entry') {
      state[key] = (
        (`${row.make}`.length > 0 && row.make_id?.toString().length === 0) ||
        (`${row.model}`.length > 0 && row.model_id?.toString().length === 0)
      );
    } else {
      state[key] = row[key] || '';
    }
    return state;
  }, {}) as Record<string, (string | number)>);

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

      setModelArray((await models({ make_id: id_for_uri, modelyear: Number.parseInt(`${formState.year}`) })).Results.map((item) => ({
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
      make: `${formState.make}`.toUpperCase(),
      make_id: formState.make_id,
      model: `${formState.model}`.toUpperCase(),
      model_id: formState.model_id,
      color: formState.color,
      vin: formState.vin,
      license_plate: formState.license_plate,
      notes: formState.notes,
    };

    if (typeof formState.make_id === 'object') {
      const make_obj = formState.make_id as { value: number };
      newRow.make_id = make_obj.value;
    }
    if (typeof formState.model_id === 'object') {
      const model_obj = formState.model_id as { value: number };
      newRow.model_id = model_obj.value;
    };

    return newRow;
  };

  const addRecord = useAddRowCallback(tables.cars, saveFunction, [formState], store, () => goBack(), []);
  const updateRecord = useSetRowCallback(tables.cars, vehicle_id, saveFunction, [formState], store, () => goBack(), []);

  const goBack = () => {
    Keyboard.dismiss();
    router.back();
  };
  const remove = useDelRowCallback(tables.cars, vehicle_id, store, () => goBack(), []);
  const confirmDelete = () => {
    return Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
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
    <View style={ pageStyles.container }>
      {
        scanVin ?
          <>
            <VinScanner callback={ (vin: string) => {
              setFormState(prev => ({ ...prev, vin }));
              vinDecode(vin).then((data) => {
                console.log(data);
                if (data.Count > 0) {
                  const result = data.Results[0];
                  const newData = {
                    make_id: Number.parseInt(result.MakeID),
                    make: result.Make,
                    model_id: Number.parseInt(result.ModelID),
                    model: result.Model,
                    year: result.ModelYear,
                  };
                  setFormState(prev => ({
                    ...newData,
                    ...prev,
                  }));
                }
              });
            } } />
            <Pressable style={pageStyles.pressable} onPress={() => {
              setScanVin(false);
            }}>
              <Text>Cancel</Text>
            </Pressable>
          </>
          :
          <Pressable style={pageStyles.pressable} onPress={() => setScanVin(true)}>
            <Ionicons name="camera" size={30} />
            <Text style={pageStyles.text}>Scan VIN</Text>
          </Pressable>
      }
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
                pageStyles.flex,
              ]}>
              <Text style={pageStyles.text}>Delete</Text>
            </Pressable>
        }
        <CallbackButton
          pressable={{ style: [pageStyles.pressable, pageStyles.flex] }}
          text={{ style: pageStyles.text }}
          title="Save"
          onPress={(callback) => {
            if (isNewCar) {
              addRecord();
            } else {
              updateRecord();
            }
            callback();
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
  flex: {
    flex: 1,
  },
  pressable: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    margin: 5,
  },
});
