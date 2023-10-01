import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text } from '../../components/elements.js';
import { CallbackButton } from '../../components/callbackButton.js';
import { Signup } from './signup.js';
import { Login } from './login.js';
import { auth } from '../../helpers/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/* This is the home page of the app. It will need to:
  1. If logged in, sync the remote DB with the local DB, and push updates if needed
  2. List all cars that are currently in the local database
  3. Allow the user to add a new car to the local database
  4. Allow the user to select a car and view its details
 */

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false, // Assume false, once onAuthStateChanged is called, it will update this
    };
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }
  render() {
    return (
    <View style={ pageStyles.view }>
      { this.state.loggedIn ?
        <CallbackButton
          title="Logout"
          onPress={(callback) => {
            signOut(auth).then(() => {
              console.log('Signed out');
              this.setState({ loggedIn: false });
            }).catch((error) => {
              Alert.alert('Error signing out');
              console.log(error);
            }).finally(() => {
              callback();
            });
          }}
        /> :
        <View style={ pageStyles.authButtons }>
          <Login />
          <Signup />
        </View>
      }
    </View>
    );
  }
}

export { Account };

const pageStyles = StyleSheet.create({
  view: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  authButtons: {
    rowGap: 15,
  },
});
