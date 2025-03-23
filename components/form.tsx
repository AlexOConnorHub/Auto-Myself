import React, { useEffect, useState } from "react";
import { Checkbox, Dropdown, Ionicons, Pressable, Text, TextInput, View } from "./elements";
import { KeyboardType, StyleSheet } from "react-native";
import FormElement from "./formElement";
import { OptionButtons } from "./optionButtons";

type formStateGeneratorType = {
  label: string;
  toggleLabel?: string;
  value: string;
  model: string;
  keyboardType?: KeyboardType;
  condition?: { formStateKey: string; value: string; invert?: boolean; };
  disable?: { disable: boolean; label: string; };
  input?: 'dropdown' | 'text' | 'optionButtons' | 'toggle';
  optionButtonOptions?: { key: string; label: string; }[];
  textAreaOptions?: { multiline: boolean; numberOfLines: number; };
  dropdownData?: { label: string; value: string; }[];
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
            return evaluation;
          }
          return Object.hasOwn(element, 'hidden') ? !element.hidden : true;
        }).map((key) => {
          const element = formMetaData[key] as formStateGeneratorType;
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
                (element.input === 'dropdown') ?
                  <Dropdown
                    value={ formState[`${key}_id`] || formState[key] }
                    onChange={(newValue: any) => { onFormStateChange(key, newValue) }}
                    data={ element.dropdownData }
                    style={ pageStyles.dropdown }
                    selectedTextStyle={ pageStyles.dropdownInput }
                    placeholderStyle={ pageStyles.dropdownInput }
                    /> :
                (element.input === 'optionButtons') ?
                  <OptionButtons
                    value={ formState[key] }
                    onSelect={(newValue: any) => { onFormStateChange(key, newValue) }}
                    options={ element.optionButtonOptions }
                    direction="vertical"
                    /> :
                (element.input === 'toggle') ?
                  <Pressable
                    style={ pageStyles.togglePressable }
                    onPress={() => { onFormStateChange(key, !formState[key]) }}
                    >
                    <Text style={ pageStyles.toggleText }>
                      {
                        formState[key] ?
                        <Ionicons size={15} name="checkmark-circle-outline"/> :
                        <Ionicons size={15} name="ellipse-outline"/>
                      } { element.toggleLabel }
                    </Text>
                  </Pressable> :
                // else
                  <TextInput
                    value={ formState[key] }
                    onChangeText={(newValue: any) => { onFormStateChange(key, newValue) }}
                    keyboardType={ element.keyboardType || 'default' }
                    multiline={ element.textAreaOptions?.multiline || false }
                    numberOfLines={ element.textAreaOptions?.numberOfLines || 1 }
                    style={ pageStyles.textInput }
                    />
              }
            </View>
          )
        })
      }
    </View>
  );
}

const pageStyles = StyleSheet.create({
  dropdown: {
    marginVertical: 5,
  },
  dropdownInput: {
    fontSize: 18,
    paddingLeft: 4,
    paddingVertical: 5,
  },
  formElementInputSection: {
    padding: 10,
  },
  formElementText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 18,
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
    fontSize: 18,
  },
});
