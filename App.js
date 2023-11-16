import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { FontAwesome, StatusBar } from './components/elements';
import { Account } from './views/account/account';
import { Home } from './views/home/home';
import { Settings } from './views/settings/settings';
import { colors } from './components/style';
import { database } from './database/database';

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar/>
        <Tab.Navigator screenOptions={ appStyles.navigatorScreenOptions } backBehavior='initialRoute' initialRouteName='Home'>
          <Tab.Screen name='Account' options={ appStyles.screenOptionsAccount } component={ Account }/>
          <Tab.Screen name='Home' options={ appStyles.screenOptionsHome }>
            { (props) => { return   <Home { ...props } database={ database }/> } }
          </Tab.Screen>
          <Tab.Screen name='Settings' options={ appStyles.screenOptionsSettings } children={ () => <Settings database={ database }/> }/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const appStyles = StyleSheet.create({
  navigatorScreenOptions: {
    headerShown: false,
    tabBarInactiveBackgroundColor: colors.primary,
    tabBarActiveBackgroundColor: colors.background,
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
