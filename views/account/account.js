import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../../components/elements';
import { Auth } from './auth';
import { Manage } from './manage';
import { SettingsContext } from '../../helpers/settingsContext';

/* This is the home page of the app. It will need to:
  1. If logged in, sync the remote DB with the local DB, and push updates if needed
  2. List all cars that are currently in the local database
  3. Allow the user to add a new car to the local database
  4. Allow the user to select a car and view its details
 */

class Account extends React.Component {
  static contextType = SettingsContext;
  constructor(props) {
    super(props);
    this.props.supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          this.setState({ loggedIn: true });
        } else {
          this.setState({ loggedIn: false });
        }
      }
    );
    this.props.supabase.auth.onAuthStateChange((event, session) => {
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
    console.log(this.state.loggedIn ? 'True' : 'False');
    return (
    <View style={ pageStyles.view }>
      { this.state.loggedIn
        ? <Manage supabase={ this.props.supabase } database={ this.props.database } />
        : <Auth supabase={ this.props.supabase } /> }
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
});
