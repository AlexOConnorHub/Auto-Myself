import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { View, Text, Modal, Pressable } from '../../components/elements.js';
import { CallbackButton } from '../../components/callbackButton.js';
import { AddCarModal } from './addCarModal.js';
import { ListCars } from './listCars.js';
import { style } from '../../components/style.js';
import Sample from '../../components/sample.js';

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
        <Sample/>
        <this.Stack.Navigator screenOptions={ pageStyles.navigatorScreenOptions }>
          <this.Stack.Screen name="ListCars" component={ListCars} />
        </this.Stack.Navigator>
        <AddCarModal/>
      </View>
    );
  }
}

export { Home };

const pageStyles = StyleSheet.create({
  container: {
    height: '100%',
    // backgroundColor: colors.background,
  },
  navigatorScreenOptions: {
    headerShown: false,
    cardStyle: {
      backgroundColor: style.colors.background,
    },
  },
});
