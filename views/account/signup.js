import React from "react";
import { Alert, StyleSheet } from "react-native";
import { CallbackButton } from "../../components/callbackButton";
import { View, Text, Pressable, Modal, FontAwesome, Feather } from "../../components/elements";
import { FormElement } from "../../components/formElement";
import { auth } from "../../helpers/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.values = {
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    };
  }
  render() {
    return (
      <View>
        <Pressable style={ pageStyles.showModalPressable } onPress={() => { this.setState({ modalVisible: true }); }}>
          <FontAwesome name="user" size={40} />
          <Text style={ pageStyles.showModalText }>Signup</Text>
        </Pressable>
        <Modal animationType='slide' onRequestClose={() => { this.setState({ modalVisible: false }); }} visible={ this.state.modalVisible }>
          <View style={ pageStyles.modal }>
            <View style={ pageStyles.modalHeader }>
              <Pressable onPress={() => { this.setState({ modalVisible: false }); }}>
                <Feather name='x-circle' size={40} />
              </Pressable>
              <Text style={ pageStyles.modalHeaderText }>Signup</Text>
              <CallbackButton
                title="Signup"
                onPress={(callback) => {
                  let email = this.values.email;
                  let confirmEmail = this.values.confirmEmail;
                  let password = this.values.password;
                  let confirmPassword = this.values.confirmPassword;
                  if (email !== confirmEmail) {
                    Alert.alert("Emails do not match");
                    callback();
                } else if (password !== confirmPassword) {
                    Alert.alert("Passwords do not match");
                    callback();
                  } else {
                    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                      const user = userCredential.user;
                      console.log(user);
                      Alert.alert("Account created");
                      this.setState({ modalVisible: false });
                    }).catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.log(errorCode);
                      console.log(errorMessage);
                      Alert.alert(errorMessage); // Consider "Try again later error"
                    }).finally(() => {
                      callback();
                    });
                  }
                }} />
            </View>
            <View style={ pageStyles.modalBody }>
              <FormElement onChangeText={(text) => { this.values.email = text; }}>E-Mail</FormElement>
              <FormElement onChangeText={(text) => { this.values.confirmEmail = text; }}>Confirm E-Mail</FormElement>
              <FormElement textInputProps={{secureTextEntry: true}} onChangeText={(text) => { this.values.password = text; }}>Password</FormElement>
              <FormElement textInputProps={{secureTextEntry: true}} onChangeText={(text) => { this.values.confirmPassword = text; }}>Confirm Password</FormElement>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const pageStyles = StyleSheet.create({
  showModalPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',    
    padding: 10,
    
    width: "95%"
  },
  showModalText: {
    fontSize: 20,
    paddingLeft: 10,
  },
  modal: {
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  modalHeaderText: {
    fontSize: 24,
  },
  modalBody: {
    padding: 10,
  },
});
