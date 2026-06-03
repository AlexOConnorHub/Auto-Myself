import React from 'react';
import { DateTimePicker, Dropdown, Ionicons, Text, TextInput, View } from '@app/components/elements';
import { KeyboardType, Platform, StyleSheet } from 'react-native';
import { OptionButtons } from '@app/components/elements/optionButtons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatDate, provideDateObj } from '@app/helpers/numbers';

interface FormStateGeneratorType {
  label: string;
  toggleLabel?: string;
  value: string;
  model: string;
  keyboardType?: KeyboardType;
  condition?: { formStateKey: string; value: string; invert?: boolean; };
  disable?: { disable: boolean; label: string; };
  input?: 'dropdown' | 'text' | 'optionButtons' | 'toggle' | 'date' | 'photoPicker';
  optionButtonOptions?: { key: string; label: string; }[];
  textAreaOptions?: { multiline: boolean; numberOfLines: number; };
  dropdownData?: { label: string; value: string; }[];
};

const FormSegment = ({ element, formStateKey, formState, onFormStateChange }) => {
  switch (element.input) {
    case 'custom':
      return element.element;
    case 'dropdown':
      // @ts-expect-error Defaults for dropdown set in abstraction, results in incomplete props here
      return <Dropdown
        value={ formState[formStateKey] }
        onChange={(newValue) => {
          onFormStateChange(prev => ({ ...prev, [formStateKey]: { ...prev[formStateKey], value: newValue.value, label: newValue.label } }));
        }}
        onChangeText={ (newValue) => {
          if (newValue.length !== 0) {
            onFormStateChange(prev => ({ ...prev, [formStateKey]: { ...prev[formStateKey], search: newValue } }));
          }
        }}
        searchQuery={ (keyword: string, labelValue: string) => {
          if (labelValue === 'New Item') {
            return true;
          }
          return labelValue.toLowerCase().split(' ').some(word => word.startsWith((formState[formStateKey].search || '').toLowerCase().trim()));
        }}
        data={ [...element.dropdownData, { label: 'New Item', value: 'new_item' }] }
        style={ pageStyles.dropdown }
        selectedTextStyle={ pageStyles.dropdownInput }
        placeholderStyle={ pageStyles.dropdownInput }
      />;
    case 'optionButtons':
      return <OptionButtons
        value={ formState[formStateKey] }
        onSelect={(newValue, enable) => {
          onFormStateChange(prev => ({ ...prev, [formStateKey]: newValue }));
          enable();
        }}
        options={ element.optionButtonOptions }
        direction="vertical"
      />;
    case 'toggle':
      return <OptionButtons
        options={[
          { label: element.toggleLabel, icon: formState[formStateKey]
            ? <Ionicons name="checkmark-circle-outline" size={15} />
            : <Ionicons name="ellipse-outline" size={15} />, key: 'toggle' },
        ]}
        onSelect={ (newValue: string, callback: () => void) => {
          onFormStateChange(prev => ({ ...prev, [formStateKey]: !prev[formStateKey] }));
          callback();
        } }
        highlightAll={true}
      />;
    case 'date':
      if (Platform.OS === 'ios') {
        return <DateTimePicker
          mode='date'
          value={ provideDateObj(formState[formStateKey]) }
          display='compact'
          onChange={(event, date) => {
            onFormStateChange(prev => ({ ...prev, [formStateKey]: date }));
          }}
        />;
      } else {
        return <OptionButtons
          options={[
            { label: formatDate(formState[formStateKey]), key: 'open_picker' },
          ]}
          onSelect={ (newValue: string, callback: () => void) => {
            callback();
            DateTimePickerAndroid.open({
              mode: 'date',
              value: provideDateObj(formState[formStateKey]),
              display: 'spinner',
              onChange: (event, date) => {
                onFormStateChange(prev => ({ ...prev, [formStateKey]: date }));
              },
            });
          } }
          highlightAll={true}
        />;
      }
    default:
      return <TextInput
        value={ formState[formStateKey] }
        onChangeText={(newValue) => {
          onFormStateChange(prev => ({ ...prev, [formStateKey]: newValue }));
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
  toggleText: {
    marginLeft: 10,
    marginVertical: 5,
  },
});
