import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { CallbackButton } from '../../components/callbackButton.js';
import { Account } from './account.js';
import { AddCarModal } from '../../components/addCarModal.js';

/* This is the home page of the app. It will need to:
  1. If logged in, sync the remote DB with the local DB, and push updates if needed
  2. List all cars that are currently in the local database
  3. Allow the user to add a new car to the local database
  4. Allow the user to select a car and view its details
 */

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.Stack = createStackNavigator();
  }
  render() {
    return (
      <View style={pageStyles.container}>
        <this.Stack.Navigator screenOptions={{ headerShown: false }}>
          <this.Stack.Screen name="Account" component={Account} />
        </this.Stack.Navigator>
        <AddCarModal/>
      </View>
    );
  }
}

export { Home };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
