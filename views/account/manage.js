import React from 'react';
import { StyleSheet } from 'react-native';
import { CallbackButton } from '../../components/callbackButton';
import { View } from '../../components/elements';
import { sync } from '../../database/synchronize';

class Manage extends React.Component {
  render() {
    return (
      <View style={ pageStyles.authButtons }>
        <CallbackButton
          title="Logout"
          onPress={(callback) => {
            this.props.supabase.auth.signOut();
            callback();
          }}
        />
        <CallbackButton
          title="Trigger Sync"
          onPress={(callback) => {
            sync(this.props.supabase, this.props.database);
            callback();
          }}
        />
        <CallbackButton
          title="private_functions.test()"
          onPress={async (callback) => {
            const { data, error } = await this.props.supabase.rpc('test');
            console.log(data);
            console.log(error);
            callback();
          }}
        />
      </View>
    );
  }
}

export { Manage };

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
