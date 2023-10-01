import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { View, FontAwesome, StatusBar } from './components/elements.js';
import { Account } from './views/account/account.js';
import { Home } from './views/home/home.js';
import { Settings } from './views/settings/settings.js';
import { style } from './components/style.js';
import { database, adapter } from './database/database.js';

const Tab = createBottomTabNavigator();

export default class App extends React.Component { 
  render() {
    return (
      <View style={{height: "100%"}}>
        <NavigationContainer>
          <StatusBar/>
          <Tab.Navigator screenOptions={ appStyles.navigatorScreenOptions } backBehavior='initialRoute' initialRouteName='Home'>
            <Tab.Screen name='Account' component={ Account } options={ appStyles.screenOptionsAccount }/>
            <Tab.Screen name='Home' component={ Home } options={ appStyles.screenOptionsHome }/>
            <Tab.Screen name='Settings' component={ Settings } options={ appStyles.screenOptionsSettings }/>
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const appStyles = StyleSheet.create({
  navigatorScreenOptions: {
    headerShown: false,
    tabBarInactiveBackgroundColor: style.colors.primary,
    tabBarActiveBackgroundColor: style.colors.background,
    tabBarShowLabel: false,
    tabBarStyle: {
      borderTopWidth: 0,
    },
  },
  screenOptionsAccount: {
    tabBarIcon: () => { return <FontAwesome size={40} name='user'/> },
    tabBarAccessibilityLabel: 'Account',
  },
  screenOptionsHome: {
    tabBarIcon: () => {return < FontAwesome size={40} name='car'/> },
    tabBarAccessibilityLabel: 'Home',
  },
  screenOptionsSettings: {
    tabBarIcon: () => {return < FontAwesome size={40} name='gear'/> },
    tabBarAccessibilityLabel: 'Settings',
  },
});
