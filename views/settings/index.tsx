import React from 'react';
import { View, Pressable, Text } from '../../components/elements';
import { OptionButtons } from '../../components/optionButtons';
import FormElement from '../../components/formElement';
import { useCell, useSetCellCallback, useStore } from 'tinybase/ui-react';
import { tables } from '../../database/schema';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabParamList, HomeStackParamList } from '../../App';
import { showFeedbackWidget } from '@sentry/react-native';
import { StyleSheet } from 'react-native';
import { getDocumentAsync } from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { createMergeableStore, MergeableStore } from 'tinybase/mergeable-store';

type AppStackNavigationProps = NativeStackNavigationProp<TabParamList & HomeStackParamList>;

const milesToKilos = (miles) => {
  return Math.floor(miles * 1.60934);
};

const kilosToMiles = (kilos) => {
  return Math.floor(kilos / 1.60934);
};

export default function Settings(): React.JSX.Element {
  const navigation = useNavigation<AppStackNavigationProps>();
  const setDistanceUnit = useSetCellCallback(tables.settings, 'local', 'distanceUnit', (newValue: string) => newValue);
  const setTheme = useSetCellCallback(tables.settings, 'local', 'theme', (newValue: string) => newValue);
  const store = useStore() as MergeableStore ;

  const convertValues = (newDistance) => {
    setDistanceUnit(newDistance);
    Alert.alert(
      'Convert distances',
      `Would you like to convert all distances to ${newDistance}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            const convert = newDistance === 'Kilometers' ? milesToKilos : kilosToMiles;
            store.forEachRow(tables.maintenance_records, (rowId) => {
              const row = store.getRow(tables.maintenance_records, rowId);
              if (row) {
                store.setCell(tables.maintenance_records, rowId, 'odometer', convert(row.odometer));
                if (row.interval_unit === 'dist') {
                  store.setCell(tables.maintenance_records, rowId, 'interval', convert(row.interval));
                }
              }
            });
            // This is mostly to cover for the fact that
            navigation.navigate('Home', { screen: 'Index' });
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const exportJson = () => {
    const storeJson = store.getJson();
    const today = new Date();
    const asyncFunc = async () => {
      if (await Sharing.isAvailableAsync()) {
        const fileLocation = `${FileSystem.cacheDirectory}AutoMyself_Export_${today.toISOString().slice(0, 19)}.json`;
        await FileSystem.writeAsStringAsync(fileLocation, storeJson, { encoding: FileSystem.EncodingType.UTF8 });
        Sharing.shareAsync(fileLocation, { dialogTitle: 'Download File', mimeType: 'application/json' });
      } else {
        await Clipboard.setStringAsync(storeJson);
        Alert.alert('Exported', 'Data copied to clipboard. Please save to a file');
      }
    };
    asyncFunc();
  };

  const importHelper = () => {
    const asyncFunc = async () => {
      const data = await getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (data.canceled) {
        return;
      }

      for (const asset of data.assets) {
        const toImport: object = JSON.parse(await readAsStringAsync(asset.uri));
        let importFunction: (data: object) => void;
        if (toImport.constructor.name === 'Array') {
          importFunction = importFullDatabase;
        } else {
          importFunction = importVehicle;
        }
        importFunction(toImport);
      }
    };
    asyncFunc();
  };

  const importFullDatabase = (toImport) => {
    Alert.alert(
      'Warning',
      'Importing may overwrite existing data! ' +
      'It is sugested to only use a full export when setting up a new device.',
      [
        {
          text: 'I Understand',
          onPress: () => {
            const tmp_store = createMergeableStore();
            tmp_store.setJson(JSON.stringify(toImport));
            store.merge(tmp_store);
          },
        },
        {
          text: 'Abort',
        },
      ],
    );
  };

  const importVehicle = (toImport) => {
    const { records, ...vehcle } = toImport;
    const car_id = store.addRow(tables.cars, vehcle);
    for (const maintenance_record of records) {
      store.addRow(tables.maintenance_records, { ...maintenance_record, car_id: car_id });
    }
  };

  return (
    <View>
      <FormElement label="Distance Unit">
        <OptionButtons
          options={[
            { label: 'Miles', key: 'Miles' },
            { label: 'Kilometers', key: 'Kilometers' },
          ]}
          value={ useCell(tables.settings, 'local', 'distanceUnit') }
          onSelect={ (newValue: string) => convertValues(newValue) }
        />
      </FormElement>
      <FormElement label="Theme">
        <OptionButtons
          options={[
            { label: 'Dark', key: 'dark' },
            { label: 'Light', key: 'light' },
          ]}
          value={ useCell(tables.settings, 'local', 'theme') }
          onSelect={ (newValue: string) => setTheme(newValue) }
        />
      </FormElement>
      <FormElement>
        <Pressable onPress={ () => {
          showFeedbackWidget();
        } } style={ pageStyles.pressable }>
          <Text style={ pageStyles.text }>
            Provide Feedback
          </Text>
        </Pressable>
        <Pressable onPress={ importHelper }
          style={ pageStyles.pressable }>
          <Text style={ pageStyles.text }>
            Import
          </Text>
        </Pressable>
        <Pressable onPress={ exportJson }
          style={ pageStyles.pressable }>
          <Text style={ pageStyles.text }>
            Export All
          </Text>
        </Pressable>
      </FormElement>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  pressable: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
  },
});
