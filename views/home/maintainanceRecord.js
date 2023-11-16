import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TextInput } from "../../components/elements";

class MaintainanceRecord extends React.Component {
  constructor(props) {
    super(props);
    if (props.onChangeText === undefined) {
      throw new Error("FormElement requires an onChangeText prop");
    }
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

export { MaintainanceRecord };

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