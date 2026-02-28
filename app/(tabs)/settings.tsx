import React from 'react';
import { View } from '@app/components/elements';
import { OptionButtons } from '@app/components/elements/optionButtons';
import FormElement from '@app/components/elements/formElement';
import { useCell, useSetCellCallback, useStore } from 'tinybase/ui-react';
import { tables } from '@app/database/schema';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { showFeedbackWidget } from '@sentry/react-native';
import { getDocumentAsync } from 'expo-document-picker';
import { File } from 'expo-file-system';
import { MergeableStore } from 'tinybase/mergeable-store';
import { exportAllVehicles } from '@app/helpers/export';
import { formatNumberForSave, kilosToMiles, milesToKilos } from '@app/helpers/numbers';
import { importData } from '@app/helpers/import';

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
                store.setCell(tables.maintenance_records, rowId, 'odometer', formatNumberForSave(`${convert(row.odometer as number)}`));
                if (row.interval_unit === 'dist') {
                  store.setCell(tables.maintenance_records, rowId, 'interval', formatNumberForSave(`${convert(row.interval as number)}`));
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

  const importHelper = () => {
    getDocumentAsync({
      type: ['application/json', 'application/zip'],
      copyToCacheDirectory: true,
      multiple: true,
    }).then((data) => {
      if (data.canceled) {
        return;
      }

      for (const asset of data.assets) {
        const file = new File(asset.uri);
        importData(store, file);
      }
    });
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
              exportAllVehicles(store, true);
            }
            enable();
          }}
        />
      </FormElement>
    </View>
  );
}
