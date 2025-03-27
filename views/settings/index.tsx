import React from 'react';
import { View } from '../../components/elements';
import { OptionButtons } from '../../components/optionButtons';
import FormElement from '../../components/formElement';
import { useCell, useSetCellCallback } from 'tinybase/ui-react';
import { tables } from '../../database/schema';

export default function Settings(): React.JSX.Element {
  const setDistanceUnit = useSetCellCallback(tables.settings, 'local', 'distanceUnit', (newValue: string) => newValue);
  const setTheme = useSetCellCallback(tables.settings, 'local', 'theme', (newValue: string) => newValue);

  return (
    <View>
      <FormElement label="Distance Unit">
        <OptionButtons
          options={[
            { label: 'Miles', key: 'Miles' },
            { label: 'Kilometers', key: 'Kilometers' },
          ]}
          value={ useCell(tables.settings, 'local', 'distanceUnit') }
          onSelect={ (newValue: string) => setDistanceUnit(newValue) }
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
