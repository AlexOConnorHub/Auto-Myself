import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Keyboard, Alert } from 'react-native';
import { View, Ionicons } from '@app/components/elements';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRow, useSetRowCallback, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import Form from '@app/components/form';
import { makes, models, vinDecode } from '@app/helpers/nhtsa';
import { router, useLocalSearchParams } from 'expo-router';
import VinScanner from '@app/components/elements/vinScanner';
import { deleteVehicle, getId } from '@app/helpers/tinybase';
import { MergeableStore } from 'tinybase';
import { OptionButtons } from '../elements/optionButtons';
import FormElement from '../elements/formElement';

export default function VehicleForm(): React.ReactElement {
  const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();
  const store = useStore() as MergeableStore;

  const random_id = getId(store.getRowIds(tables.vehicles));

  const netInfo = useNetInfo();
  const [makeArray, setMakeArray] = useState([]);
  const [modelArray, setModelArray] = useState([]);
  const [scanVin, setScanVin] = useState(false);
  const isNewVehicle = vehicle_id === undefined;
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
  const row = useRow(tables.vehicles, vehicle_id) as Record<string, (string | number)>;
  const [formState, setFormState] = useState(() => Object.keys(formMetaData).reduce((state, key) => {
    if (key === 'manual_entry') {
      state[key] = (
        (`${row.make}`.length > 0 && row.make_id === null) ||
        (`${row.model}`.length > 0 && row.model_id === null)
      );
    } else if (['make_id', 'model_id'].includes(key)) {
      state[key] = { value: row[key], label: row[key.substring(0, key.length - 3)] };
    } else {
      state[key] = row[key] || '';
    }
    return state;
  }, {} as {
    nickname: string,
    year: string,
    make: string,
    make_id: { value: number, label: string },
    model: string,
    model_id: { value: number, label: string },
    color: string,
    vin: string,
    license_plate: string,
    notes: string,
    manual_entry: boolean,
  }));

  useMemo(() => {
    const doAsync = async () => {
      const theMakes = await makes();
      setMakeArray(theMakes.Results.map((item) => ({
        value: item.Make_ID,
        label: item.Make_Name,
      })));
    };
    doAsync();
  }, []);

  useMemo(() => {
    const doAsync = async () => {
      const make_obj = formState.make_id as unknown as { label: string, value: number };

      setModelArray((await models({ make_id: make_obj.value, modelyear: Number.parseInt(`${formState.year}`) })).Results.map((item) => ({
        value: item.Model_ID,
        label: item.Model_Name,
      })));
    };
    doAsync();
  }, [formState.make_id.value, (formState.year.toString().length === 4 ? formState.year : null)]);

  useEffect(() => {
    const makeObj = formState.make_id as unknown as Record<string, string>;
    if (makeObj.value === 'new_item') {
      setFormState(prev => ({ ...prev, make: makeObj.search, manual_entry: true }));
    } else {
      setFormState(prev => ({ ...prev, make: makeObj.label }));
    }
  }, [formState.make_id.value]);

  useEffect(() => {
    const modelObj = formState.model_id as unknown as Record<string, string>;
    if (modelObj.value === 'new_item') {
      setFormState(prev => ({ ...prev, model: modelObj.search, manual_entry: true }));
    } else {
      setFormState(prev => ({ ...prev, model: modelObj.label }));
    }
  }, [formState.model_id.value]);

  const saveFunction = () => {
    const newRow = {
      nickname: formState.nickname,
      year: formState.year,
      color: formState.color,
      make: null,
      make_id: null,
      model: null,
      model_id: null,
      vin: formState.vin,
      license_plate: formState.license_plate,
      notes: formState.notes,
    };

    if (formState.manual_entry) {
      newRow.make = formState.make;
      newRow.model = formState.model;
    } else {
      newRow.make = formState.make_id.label;
      newRow.make_id = formState.make_id.value;
      newRow.model = formState.model_id.label;
      newRow.model_id = formState.model_id.value;
    }

    return newRow;
  };

  const goBack = () => {
    Keyboard.dismiss();
    router.back();
  };

  const updateRecord = useSetRowCallback(tables.vehicles, isNewVehicle ? random_id : vehicle_id, saveFunction, [formState], store, goBack, []);

  const confirmDelete = () => {
    return Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteVehicle(store, vehicle_id);
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
  if (!isNewVehicle) {
    finalOptions.unshift({ label: 'Delete', key: 'delete' });
  }

  return (
    <View style={ pageStyles.container }>
      {
        scanVin ?
          <>
            <VinScanner callback={ (vin: string) => {
              setFormState(prev => ({ ...prev, vin }));
              setScanVin(false);
              vinDecode(vin).then((data) => {
                if (data.Count > 0) {
                  const result = data.Results[0];
                  const newData = {
                    make_id: { value: Number.parseInt(result.MakeID), label: result.Make },
                    make: result.Make,
                    model_id: { value: Number.parseInt(result.ModelID), label: result.Model },
                    model: result.Model,
                    year: result.ModelYear,
                  };
                  setFormState(prev => ({
                    ...prev,
                    ...newData,
                  }));
                }
              });
            } } />
            <OptionButtons
              options={[
                { label: 'Cancel', key: 'cancel' },
              ]}
              onSelect={ (newValue: string, callback: () => void) => {
                callback();
                setScanVin(false);
              } }
              highlightAll={true}
            />
          </>
          :
          <FormElement>
            <OptionButtons
              options={[
                { label: 'Scan VIN', key: 'scan_vin', icon: <Ionicons name="camera" size={20} /> },
              ]}
              onSelect={ (newValue: string, callback: () => void) => {
                callback();
                setScanVin(true);
              } }
              highlightAll={true}
            />
          </FormElement>
      }
      <Form formState={ formState } formMetaData={ formMetaData } onFormStateChange={ setFormState } />
      <FormElement>
        <OptionButtons
          options={finalOptions}
          onSelect={(key, callback) => {
            if (key === 'delete') {
              confirmDelete();
            } else if (key === 'save') {
              updateRecord();
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
