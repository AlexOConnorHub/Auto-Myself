import React from "react";
import { StyleSheet, View, Text, Button, Modal, Pressable, TextInput } from "react-native";
import { CallbackButton } from "./callbackButton.js";
import { FontAwesome, Feather } from "@expo/vector-icons";

class AddCarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  render() {    
    return (
      <View style={ modalStyles.container }>
        <Pressable onPress={() => {this.setState( { modalVisible: true }); }} style={ modalStyles.showButton }>
          <Feather name='plus-circle' size={40} color='white'/>
          <Text style={ modalStyles.showButtonText }>Add Car</Text>
        </Pressable>
        <Modal animationType='slide' onRequestClose={ () => {this.setState( { modalVisible: false } ); } } visible={ this.state.modalVisible }>
            <View style={ modalStyles.modalHeaader }>
              <Pressable onPress={ () => {this.setState( { modalVisible: false } ); } }>
                <Feather name='x-circle' size={40} />
              </Pressable>
              <Text style={modalStyles.headerLabel}>Enter details</Text>
              <Button title='Add Car'/>
            </View>
            <View style={modalStyles.modalBody}>
              <this.FormText>Make</this.FormText>
              <this.FormText>Model</this.FormText>
              <this.FormText>Year</this.FormText>
              <this.FormText>VIN</this.FormText>
              <this.FormText>License Plate</this.FormText>
            </View>
        </Modal>
      </View>
    )
  }
  FormText(props) {
    return (
      <View style={modalStyles.modalInputSection}>
        <Text style={modalStyles.modalInputLabel}>{props.children}</Text>
        <TextInput style={modalStyles.textInput} />
      </View>
    )
  }
}

export { AddCarModal };

const modalStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  showButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282A3A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginVertical: 10,
    width: '95%',
  },
  showButtonText: {
    fontSize: 24,
    color: 'white',
    paddingLeft: 10,
  },
  modalHeaader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  modalInputSection: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
  },
  modalInputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 18,
    backgroundColor: '#E5E5E5',
  },
});
