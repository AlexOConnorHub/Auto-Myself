import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Pressable, Modal, Button, TextInput, Feather } from "../../components/elements.js";
import { CallbackButton } from "../../components/callbackButton.js";
import { style } from "../../components/style.js";
import { FormElement } from "../../components/formElement.js";

class AddCarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  render() {    
    return (
      <View style={ modalStyles.view }>
        <Pressable onPress={() => { this.setState({ modalVisible: true }); }} style={ modalStyles.showPressable }>
          <Feather name='plus-circle' size={40} />
          <Text style={ modalStyles.showPressableText }>Add Car</Text>
        </Pressable>
        <Modal animationType='slide' onRequestClose={() => { this.setState({ modalVisible: false }); }} visible={ this.state.modalVisible }>
          <View style={ modalStyles.modal }>
            <View style={ modalStyles.modalHeaader }>
              <Pressable onPress={() => { this.setState({ modalVisible: false }); }}>
                <Feather name='x-circle' size={40} />
              </Pressable>
              <Text style={ modalStyles.modalHeaderText }>Enter Details</Text>
              <Button title='Add Car' style={ modalStyles.modalHeaderButton } />
            </View>
            <View>
              <FormElement onChangeText={(text) => { console.log(text); }}>Make</FormElement>
              <FormElement onChangeText={(text) => { console.log(text); }}>Model</FormElement>
              <FormElement onChangeText={(text) => { console.log(text); }}>Year</FormElement>
              <FormElement onChangeText={(text) => { console.log(text); }}>VIN</FormElement>
              <FormElement onChangeText={(text) => { console.log(text); }}>License Plate</FormElement>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

export { AddCarModal };

const modalStyles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  modal: {
    height: '100%',
  },
  showPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    width: '95%',
  },
  showPressableText: {
    fontSize: 24,
    color: style.text.button.color,
    paddingLeft: 10,
  },
  modalHeaader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalHeaderButton: {
    fontSize: 24,
    color: style.text,
  },
});
