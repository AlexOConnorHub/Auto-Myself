import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TextInput } from "./elements.js";

class FormElement extends React.Component {
  constructor(props) {
    if (props.onChangeText === undefined) {
      throw new Error("FormElement requires an onChangeText prop");
    }
    super(props);
    this.value = (this.props.value === undefined ? "" : this.props.value);
    this.state = {
      onChangeText: this.props.onChangeText,
    };
  }
  render() {
    return (
      <View { ... this.props.viewProps } style={( this.props.viewProps && this.props.viewProps.style ? [ pageStyles.formElementInputSection, this.props.viewProps.style ] : pageStyles.formElementInputSection )}>
        <Text { ... this.props.textProps } style={( this.props.textProps && this.props.textProps.style ? [ pageStyles.formElementText, this.props.textProps.style ] : pageStyles.formElementText )}>{ this.props.children }</Text>
        <TextInput { ... this.props.textInputProps } onChangeText={ this.props.onChangeText } value={ this.props.value } />
      </View>
    );
  }
}

export { FormElement };

const pageStyles = StyleSheet.create({
  formElementInputSection: {
    marginBottom: 20,
    padding: 10,
  },
  formElementText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
