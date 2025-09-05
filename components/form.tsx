import React from 'react';
import { DateTimePicker, Dropdown, Ionicons, Pressable, Text, TextInput, View } from './elements';
import { KeyboardType, Platform, StyleSheet } from 'react-native';
import { OptionButtons } from './optionButtons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { displayTime, provideLocalTime } from '@app/helpers/localTime';

interface FormStateGeneratorType {
  label: string;
  toggleLabel?: string;
  value: string;
  model: string;
  keyboardType?: KeyboardType;
  condition?: { formStateKey: string; value: string; invert?: boolean; };
  disable?: { disable: boolean; label: string; };
  input?: 'dropdown' | 'text' | 'optionButtons' | 'toggle' | 'date';
  optionButtonOptions?: { key: string; label: string; }[];
  textAreaOptions?: { multiline: boolean; numberOfLines: number; };
  dropdownData?: { label: string; value: string; }[];
};

const FormSegment = ({ element, formStateKey, formState, onFormStateChange }) => {
  const theme = useTheme();
  switch (element.input) {
    case 'dropdown':
      // @ts-expect-error Defaults for dropdown set in abstraction, results in incomplete props here
      return <Dropdown
        value={ formState[`${formStateKey}_id`] || formState[formStateKey] }
        onChange={(newValue) => {
          onFormStateChange(formStateKey, newValue);
        }}
        data={ element.dropdownData }
        style={ pageStyles.dropdown }
        selectedTextStyle={ pageStyles.dropdownInput }
        placeholderStyle={ pageStyles.dropdownInput }
      />;
    case 'optionButtons':
      return <OptionButtons
        value={ formState[formStateKey] }
        onSelect={(newValue, enable) => {
          onFormStateChange(formStateKey, newValue);
          enable();
        }}
        options={ element.optionButtonOptions }
        direction="vertical"
      />;
    case 'toggle':
      return <Pressable
        style={ pageStyles.togglePressable }
        onPress={() => {
          onFormStateChange(formStateKey, !formState[formStateKey]);
        }}
      >
        <Text style={ pageStyles.toggleText }>
          {
            formState[formStateKey] ?
              <Ionicons size={15} name="checkmark-circle-outline"/> :
              <Ionicons size={15} name="ellipse-outline"/>
          } { element.toggleLabel }
        </Text>
      </Pressable>;
    case 'date':
      if (Platform.OS === 'ios') {
        return <DateTimePicker
          mode='date'
          value={ provideLocalTime(formState[formStateKey]) }
          display='compact'
          onChange={(event, date) => {
            onFormStateChange(formStateKey, date);
          }}
        />;
      } else {
        return <Pressable
          style={ { ...pageStyles.datePickerAndroid, backgroundColor: theme.colors.card } }
          onPress={ () => DateTimePickerAndroid.open({
            mode: 'date',
            value: provideLocalTime(formState[formStateKey]),
            display: 'spinner',
            onChange: (event, date) => {
              onFormStateChange(formStateKey, date);
            },
          }) }>
          <Text style={ pageStyles.toggleText }>
            { displayTime(formState[formStateKey]) }
          </Text>
        </Pressable>;
      }
    default:
      return <TextInput
        value={ formState[formStateKey] }
        onChangeText={(newValue) => {
          onFormStateChange(formStateKey, newValue);
        }}
        keyboardType={ element.keyboardType || 'default' }
        multiline={ element.textAreaOptions?.multiline || false }
        numberOfLines={ element.textAreaOptions?.numberOfLines || 1 }
        style={ pageStyles.textInput }
        autoFocus={ element.autoFocus }
      />;
  }
};

export default function Form({ formMetaData, formState, onFormStateChange }): React.ReactElement {
  return (
    <View>
      { Object.keys(formMetaData).filter((key) => {
        const element = formMetaData[key];
        if (Object.hasOwn(element, 'condition')) {
          let evaluation = formState[element.condition.formStateKey] == element.condition.value;
          if (Object.hasOwn(element.condition, 'constant_or')) {
            evaluation = evaluation || element.condition.constant_or;
          }
          if (Object.hasOwn(element.condition, 'constant_and')) {
            evaluation = evaluation && element.condition.constant_and;
          }
          if (element.condition.invert) {
            evaluation = !evaluation;
          }
          if (!Object.hasOwn(element, 'autoFocus')) {
            element.autoFocus = true;
          }
          return evaluation;
        }
        return Object.hasOwn(element, 'hidden') ? !element.hidden : true;
      }).map((key) => {
        const element = formMetaData[key] as FormStateGeneratorType;
        return (
          <View key={ key } style={ pageStyles.formElementInputSection }>
            {
              element.label !== undefined &&
                <Text style={ pageStyles.formElementText }>
                  { element.label }
                </Text>
            }
            {
              (Object.hasOwn(element, 'disable') && element.disable.disable) ?
                <Text style={ pageStyles.formElementText }>
                  { element.disable.label }
                </Text> :
                <FormSegment element={ element } formStateKey={ key } formState={ formState } onFormStateChange={ onFormStateChange } />
            }
          </View>
        );
      })
      }
    </View>
  );
}

const pageStyles = StyleSheet.create({
  datePickerAndroid: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  dropdown: {
    marginVertical: 5,
  },
  dropdownInput: {
    paddingLeft: 4,
    paddingVertical: 5,
  },
  formElementInputSection: {
    padding: 10,
  },
  formElementText: {
    fontWeight: 'bold',
  },
  textInput: {
    marginVertical: 5,
    paddingLeft: 4,
    paddingVertical: 5,
  },
  togglePressable: {
    borderRadius: 3,
    flexDirection: 'row',
    alignContent: 'center',
  },
  toggleText: {
    marginLeft: 10,
    marginVertical: 5,
  },
});
