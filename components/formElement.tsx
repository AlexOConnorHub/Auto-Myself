import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from './elements';

export default function FormElement(props): React.ReactElement {
  return (
    <View
      {...props.viewProps}
      style={
        props.viewProps?.style
          ? [pageStyles.formElementInputSection, props.viewProps.style]
          : pageStyles.formElementInputSection
      }>
      <Text
        {...props.textProps}
        style={
          props.textProps?.style
            ? [pageStyles.formElementText, props.textProps.style]
            : pageStyles.formElementText
        }>
        {props.label}
      </Text>
      {props.children}
    </View>
  );
}

const pageStyles = StyleSheet.create({
  formElementInputSection: {
    marginBottom: 20,
    padding: 10,
  },
  formElementText: {
    fontSize: 18,
    fontWeight: 'bold',
    // padding: 10,
  },
});
