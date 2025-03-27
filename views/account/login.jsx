import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import CallbackButton from '../../components/callbackButton';
import { View, Text, Pressable, Modal, FontAwesome, Feather, TextInput } from '../../components/elements';
import FormElement from '../../components/formElement';
import { supabase } from '../../helpers/supabase';

export class Login extends React.Component {
  state = {
    modalVisible: false,
    email: '',
    password: '',
  };
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
                onPress={ async (callback) => {
                  if (this.state.email === '') {
                    Alert.alert('Email cannot be blank');
                  } else if (this.state.password === '') {
                    Alert.alert('Password cannot be blank');
                  } else {
                    const { data, error } = await supabase.auth.signInWithPassword({
                      email: this.state.email,
                      password: this.state.password,
                    });
                    if (error) {
                      Alert.alert(error.message);
                    } else {
                      Alert.alert('Logged in');
                      this.setState({ modalVisible: false });
                    }
                  }
                  callback();
                }} />
            </View>
            <View style={ pageStyles.modalBody }>
              <FormElement label="E-Mail">
                <TextInput
                  onChangeText={(text) => { this.setState({ email: text }); }}
                  // keyboardType="email-address" TODO, maybe???
                />
              </FormElement>
              <FormElement label="Password">
                <TextInput
                  onChangeText={(text) => { this.setState({ password: text }); }}
                  secureTextEntry={true}
                />
              </FormElement>
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
