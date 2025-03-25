import React from 'react';
import { View, Pressable, Text } from '../../components/elements';
import { OptionButtons } from '../../components/optionButtons';
import FormElement from '../../components/formElement';
import { useCell, useSetCellCallback } from 'tinybase/ui-react';
import { tables } from '../../database/schema';
import { showFeedbackWidget } from '@sentry/react-native';
import { StyleSheet } from 'react-native';

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
      <FormElement>
        <Pressable onPress={ () => { showFeedbackWidget() } } style={ pageStyles.pressable }>
          <Text style={ pageStyles.text }>
            Provide Feedback
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
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
  }
});
