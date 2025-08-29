import React from 'react';
import { View } from '@app/components/elements';
import { OptionButtons } from '@app/components/optionButtons';
import FormElement from '@app/components/formElement';
import { useCell, useSetCellCallback, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { showFeedbackWidget } from '@sentry/react-native';
import { getDocumentAsync } from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system';
import { createMergeableStore, MergeableStore } from 'tinybase/mergeable-store';
import { exportAsFile } from '@app/helpers/fileExport';

const milesToKilos = (miles) => {
  return Math.floor(miles * 1.60934);
};

const kilosToMiles = (kilos) => {
  return Math.floor(kilos / 1.60934);
};

export default function Tab(): React.JSX.Element {
  const setDistanceUnit = useSetCellCallback(tables.settings, 'local', 'distanceUnit', (newValue: string) => newValue);
  const setTheme = useSetCellCallback(tables.settings, 'local', 'theme', (newValue: string) => newValue);
  const setAnalyticsEnabled = useSetCellCallback(tables.settings, 'local', 'analyticsEnabled', (newValue: string) => newValue === 'enabled');
  const store = useStore() as MergeableStore;

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
            router.navigate('/');
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
    exportAsFile(storeJson, `AutoMyself_Export_${today.toISOString().slice(0, 19)}.json`);
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
          onSelect={ (newValue: string, enable: () => void) => {
            convertValues(newValue);
            enable();
          } }
        />
      </FormElement>
      <FormElement label="Theme">
        <OptionButtons
          options={[
            { label: 'Auto', key: 'auto' },
            { label: 'Dark', key: 'dark' },
            { label: 'Light', key: 'light' },
          ]}
          value={ useCell(tables.settings, 'local', 'theme') }
          onSelect={ (newValue: string, enable: () => void) => {
            setTheme(newValue);
            enable();
          } }
        />
      </FormElement>
      <FormElement label="Anonymous Reporting">
        <OptionButtons
          options={[
            { label: 'Enabled', key: 'enabled' },
            { label: 'Disabled', key: 'disabled' },
          ]}
          value={ useCell(tables.settings, 'local', 'analyticsEnabled') ? 'enabled' : 'disabled' }
          onSelect={ (newValue: string, enable: () => void) => {
            setAnalyticsEnabled(newValue);
            enable();
          } }
        />
      </FormElement>
      <FormElement>
        <OptionButtons
          options={[
            { label: 'Provide Feedback', key: 'provide_feedback' },
          ]}
          value='provide_feedback'
          onSelect={ (newValue: string, enable: () => void) => {
            if (newValue === 'provide_feedback') {
              showFeedbackWidget();
            }
            enable();
          }}
        />
      </FormElement>
      <FormElement>
        <OptionButtons
          options={[
            { label: 'Import', key: 'import' },
          ]}
          value='import'
          onSelect={ (newValue: string, enable: () => void) => {
            if (newValue === 'import') {
              importHelper();
            }
            enable();
          }}
        />
      </FormElement>
      <FormElement>
        <OptionButtons
          options={[
            { label: 'Export All', key: 'export_all' },
          ]}
          value='export_all'
          onSelect={ (newValue: string, enable: () => void) => {
            if (newValue === 'export_all') {
              exportJson();
            }
            enable();
          }}
        />
      </FormElement>
    </View>
  );
}
