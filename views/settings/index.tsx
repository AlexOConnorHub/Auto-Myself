import React from 'react';
import { View } from '../../components/elements';
import { OptionButtons } from '../../components/optionButtons';
import FormElement from '../../components/formElement';
import { useCell, useSetCellCallback, useStore } from 'tinybase/ui-react';
import { tables } from '../../database/schema';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabParamList, HomeStackParamList } from '../../App';

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
  const store = useStore();


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
    </View>
  );
}
