import React from "react";
import { Alert, StyleSheet } from "react-native";
import { CallbackButton } from "../../components/callbackButton";
import { View, Text, Pressable, Modal, FontAwesome, Feather, TextInput } from "../../components/elements";
import { FormElement } from "../../components/formElement";
import { hcaptcha } from "../../secrets/hcaptcha";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";

export class Auth extends React.Component {
  state = {
    signup: false,
    email: "",
    password: "",
    confirmPassword: "",
    hcaptchaCode: "",
  }
  render() {
    return (
      <View style={ pageStyles.page }>
        <FormElement noLabel={true}>
          <View style={ pageStyles.optionRow }>
            <Pressable style={ { ... pageStyles.optionPressable } } onPress={() => { this.setState({ signup: false }); }}>
              <FontAwesome name="sign-in" size={35} />
              <Text style={ pageStyles.optionLabel }>Login</Text>
            </Pressable>
            <Pressable style={ pageStyles.optionPressable } onPress={() => { this.setState({ signup: true }); }}>
              <FontAwesome name="user" size={35} />
              <Text style={ pageStyles.optionLabel }>Signup</Text>
            </Pressable>
          </View>
        </FormElement>
        <FormElement label="E-Mail">
          <TextInput
            onChangeText={(text) => { this.setState({ email: text }); }}
            keyboardType="email-address" />
        </FormElement>
        <FormElement label="Password">
          <TextInput
            onChangeText={(text) => { this.setState({ password: text }); }}
            secureTextEntry={true}
          />
        </FormElement>
        {this.state.signup ?
          <FormElement label="Confirm Password">
            <TextInput
              onChangeText={(text) => { this.setState({ confirmPassword: text }); }}
              secureTextEntry={true}
            />
          </FormElement> :
          null
        }
        <FormElement noLabel={true}>
          <CallbackButton
            title="Login"
            onPress={ async (callback) => {
              if (this.state.email === "") {
                Alert.alert("Email cannot be blank");
              } else if (this.state.password === "") {
                Alert.alert("Password cannot be blank");
              } else if (this.state.signup && this.state.confirmPassword === "") {
                Alert.alert("Confirm password cannot be blank");
              } else if (this.state.signup && this.state.password !== this.state.confirmPassword) {
                Alert.alert("Passwords do not match");
              } else {
                this.hcaptcha.show();
              }
              callback();
            }} />
        </FormElement>
        <ConfirmHcaptcha
          ref={(ref) => (this.hcaptcha = ref)}
          siteKey={hcaptcha.siteKey}
          onMessage={(event) => {
            if (event.nativeEvent.data !== 'open') {
              this.hcaptcha.hide();
              if (['cancel', 'error'].includes(event.nativeEvent.data)) {
                Alert.alert('Error', 'Please complete the captcha to continue');
                return;
              }
              this.setState({ hcaptchaCode: event.nativeEvent.data });
              if (this.state.signup) {
                this.props.supabase.auth.signUp({
                  email: this.state.email,
                  password: this.state.password,
                  options: { captchaToken: this.state.hcaptchaCode },
                }).then(({ error }) => {
                  if (error) {
                    Alert.alert(error.message);
                    console.log(JSON.stringify(error));
                    for (let key in error) {
                      console.log(key);
                      console.log(error[key]);
                    }
                  }
                });
              } else {
                this.props.supabase.auth.signInWithPassword({
                  email: this.state.email,
                  password: this.state.password,
                  options: { captchaToken: this.state.hcaptchaCode },
                }).then(({ error }) => {
                  if (error) {
                    Alert.alert(error.message);
                  }
                });
              }
            }
          }}
        />
      </View>
    )
  }
}

const pageStyles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 20,
  },
  optionPressable: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  optionLabel: {
    fontSize: 20,
    paddingLeft: 10,
  },
});
