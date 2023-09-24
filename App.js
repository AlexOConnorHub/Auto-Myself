import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { Account } from './views/pages/account.js';
import { Home } from './views/pages/home.js';
import { Settings } from './views/pages/settings.js';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default class App extends React.Component { 
  render() {
    return (
      <NavigationContainer>
        <View style={ appStyles.statusBar } />
        <Tab.Navigator screenOptions={ appStyles.screenDefault } backBehavior='initialRoute' initialRouteName='Home'>
          <Tab.Screen name='Account' component={ Account } options={ appStyles.accountOptions }/>
          <Tab.Screen name='Home' component={ Home } options={ appStyles.homeOptions }/>
          <Tab.Screen name='Settings' component={ Settings } options={ appStyles.settingsOptions }/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const appStyles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight,
  },
  screenDefault: {
    headerShown: false,
    tabBarInactiveBackgroundColor: '#C69749',
    tabBarActiveBackgroundColor: '#735F32',
    tabBarShowLabel: false,
  },
  accountOptions: {
    tabBarIcon: () => {return <FontAwesome size={40} color='white' name='user'/>},
    tabBarAccessibilityLabel: 'Account',
  },
  homeOptions: {
    tabBarIcon: () => {return <FontAwesome size={40} color='white' name='car'/>},
    tabBarAccessibilityLabel: 'Home',
  },
  settingsOptions: {
    tabBarIcon: () => {return <FontAwesome size={40} color='white' name='gear'/>},
    tabBarAccessibilityLabel: 'Settings',
  },
});
