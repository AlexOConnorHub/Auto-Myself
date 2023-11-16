import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Pressable } from '../../components/elements';
import { CallbackButton } from '../../components/callbackButton';

/* This is the home page of the app. It will need to:
  1. If logged in, sync the remote DB with the local DB, and push updates if needed
  2. List all cars that are currently in the local database
  3. Allow the user to add a new car to the local database
  4. Allow the user to select a car and view its details
 */

class Settings extends React.Component {
  render() {
    return (
      <View style={pageStyles.container}>
        <Text>Open up App to start working on your app!!!</Text>
        <Text>Test Firebase Data</Text>
        <CallbackButton
          title="Settings"
          onPress={(callback) => {
            console.log("Button pressed");
            callback();
          }}
        />
      </View>
    );
  }
}

export { Settings };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
