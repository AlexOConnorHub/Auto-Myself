import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TextInput } from "./elements";
import { SettingsContext } from "../helpers/settingsContext";

class FormElement extends React.Component {
  static contextType = SettingsContext;
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View { ... this.props.viewProps } style={( this.props.viewProps && this.props.viewProps.style ? [ pageStyles.formElementInputSection, this.props.viewProps.style ] : pageStyles.formElementInputSection )}>
        <Text { ... this.props.textProps } style={( this.props.textProps && this.props.textProps.style ? [ pageStyles.formElementText, this.props.textProps.style ] : pageStyles.formElementText )}>{ this.props.label }</Text>
        { this.props.children }
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
