import React from "react";
import { Alert, StyleSheet } from "react-native";
import { CallbackButton } from "../../components/callbackButton.js";
import { View, Text, Pressable, Modal, FontAwesome, Feather } from "../../components/elements";
import { FormElement } from "../../components/formElement.js";
import { auth } from "../../helpers/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.values = {
      email: "",
      password: "",
    };
  }
  render() {
    return (
      <View>
        <Pressable style={ pageStyles.showModalPressable } onPress={() => { this.setState({ modalVisible: true }); }}>
          <FontAwesome name="user" size={40} />
          <Text style={ pageStyles.showModalText }>Login</Text>
        </Pressable>
        <Modal animationType='slide' onRequestClose={() => { this.setState({ modalVisible: false }); }} visible={ this.state.modalVisible }>
          <View style={ pageStyles.modal }>
            <View style={ pageStyles.modalHeader }>
              <Pressable onPress={() => { this.setState({ modalVisible: false }); }}>
                <Feather name='x-circle' size={40} />
              </Pressable>
              <Text style={ pageStyles.modalHeaderText }>Login</Text>
              <CallbackButton
                title="Login"
                onPress={(callback) => {
                  if (this.values.email === "") {
                    Alert.alert("Email cannot be blank");
                    callback();
                  } else if (this.values.password === "") {
                    Alert.alert("Password cannot be blank");
                    callback();
                  } else {
                    signInWithEmailAndPassword(auth, this.values.email, this.values.password).then((userCredential) => {
                      const user = userCredential.user;
                      console.log(user);
                      Alert.alert("Logged in");
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
              <FormElement textInputProps={{secureTextEntry: true}} onChangeText={(text) => { this.values.password = text; }}>Password</FormElement>
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
