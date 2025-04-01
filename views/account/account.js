import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text } from '../../components/elements';
import CallbackButton from '../../components/callbackButton';
import { Signup } from './signup';
import { Login } from './login';
// import { supabase } from '../../helpers/supabase';

/* This is the home page of the app. It will need to:
  1. If logged in, sync the remote DB with the local DB, and push updates if needed
  2. List all cars that are currently in the local database
  3. Allow the user to add a new car to the local database
  4. Allow the user to select a car and view its details
 */

class Account extends React.Component {
  constructor(props) {
    super(props);
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          this.setState({ loggedIn: true });
        } else {
          this.setState({ loggedIn: false });
        }
      }
    );
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed");
      if (event === "SIGNED_IN") {
        this.setState({ loggedIn: true });
      } else if (event === "SIGNED_OUT") {
        this.setState({ loggedIn: false });
      }
    });
  }
  state = {
    loggedIn: false
  }
  render() {
    return (
    <View style={ pageStyles.view }>
      { this.state.loggedIn ?
        <CallbackButton
          title="Logout"
          onPress={(callback) => {
            supabase.auth.signOut();
            callback();
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
    // flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  authButtons: {
    rowGap: 15,
  },
});
