import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import CallbackButton from '../../components/callbackButton';
import { View, Text, Pressable, Modal, FontAwesome, Feather, TextInput } from '../../components/elements';
import FormElement from '../../components/formElement';
import { supabase } from '../../helpers/supabase';

export class Signup extends React.Component {
  state = {
    modalVisible: false,
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  };
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
                onPress={async (callback) => {
                  let email = this.state.email;
                  let confirmEmail = this.state.confirmEmail;
                  let password = this.state.password;
                  let confirmPassword = this.state.confirmPassword;
                  if (email !== confirmEmail) {
                    Alert.alert('Emails do not match');
                  } else if (password !== confirmPassword) {
                    Alert.alert('Passwords do not match');
                  } else {
                    const { error } = await supabase.auth.signUp({
                      email: email,
                      password: password,
                    });
                    if (error) {
                      Alert.alert(error.message);
                    } else {
                      Alert.alert('Account created');
                      this.setState({ modalVisible: false });
                    }
                  }
                  callback();
                }} />
            </View>
            <View style={ pageStyles.modalBody }>
              {[
                { label: 'E-Mail', keyboardType: 'email-address', model: 'email' },
                { label: 'Confirm E-Mail', keyboardType: 'email-address', model: 'confirmEmail' },
                { label: 'Password', keyboardType: 'default', model: 'password' },
                { label: 'Confirm Password', keyboardType: 'default', model: 'confirmPassword' },
              ].map((item) => (
                <FormElement label={ item.label }
                  key={ item.model }>
                  <TextInput
                    onChangeText={(text) => this.setState({ [item.model]: text })}
                    keyboardType={ item.keyboardType } />
                </FormElement>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const pageStyles = StyleSheet.create({
  showModalPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,

    width: '95%'
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
