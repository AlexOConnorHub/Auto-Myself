import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React from 'react';
import { AppState, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, StatusBar } from './components/elements';
import { lightColors, darkColors, themedStyle } from './components/theme';
import { Home } from './views/home/home';
import { Settings } from './views/settings/settings';
import { database } from './database/database';
import { tables } from './database/tables';
import { kvStorage } from './helpers/kvStorage';
import { SettingsContext } from './helpers/settingsContext';
import MaintainanceType from './models/maintainanceType';
import { sync } from './database/synchronize';
import { supabase } from './helpers/supabase';
import { Account } from './views/account/account';

const Tab = createBottomTabNavigator();

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!kvStorage.contains('local_user')) {
      this.createLocalUser();
    }
    if (!kvStorage.contains('display.theme')) {
      kvStorage.set('display.theme', 'dark');
    }
    if (!kvStorage.contains('display.units')) {
      kvStorage.set('display.units', 'Miles');
    }
    if (!kvStorage.contains('database.seed.maintainance_type.version') || kvStorage.getNumber('database.seed.maintainance_type.version') < 1) {
      this.initMaintainanceType(kvStorage.getNumber('database.seed.maintainance_type.version'));
    }
    this.state = {
      colors: kvStorage.getString('display.theme') === 'light' ? lightColors : darkColors,
      distanceUnit: kvStorage.getString('display.units'),
    };
    this.state.styles = themedStyle(this.state.colors);
  }
  async createLocalUser() {
    let user = await database.write(async () => {
      return await database.get(tables.users).create((record) => {});
    });
    kvStorage.set('local_user', user.id);
  };
  async initMaintainanceType(currentVersion = 0) {
    for (let version in MaintainanceType.defaultMaintainanceTypes) {
      if (version > currentVersion) {
        await database.write(async () => {
          let maintainanceTypeTable = database.get(tables.maintainance_types);
          for (let maintainanceType of MaintainanceType.defaultMaintainanceTypes[version]) {
            await maintainanceTypeTable.create((record) => {
              record.name = maintainanceType;
            });
          }
        });
        kvStorage.set('database.seed.maintainance_type.version', Number(version));
      }
    }
  }
  componentDidMount() {
    this.listener = kvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey === 'display.theme') {
        let newColors = kvStorage.getString('display.theme') === 'light' ? lightColors : darkColors;
        this.setState({ colors: newColors, styles: themedStyle(newColors) });
      } else if (changedKey === 'display.units') {
        this.setState({ distanceUnit: kvStorage.getString('display.units') });
      }
    });
  }
  componentWillUnmount() {
    this.listener.remove();
  }
  render() {
    // sync(database);
    return (
      // <React.StrictMode>
        <SettingsContext.Provider value={{ ...this.state }}>
          <NavigationContainer>
            <StatusBar/>
            <Tab.Navigator screenOptions={{...appStyles.navigatorScreenOptions, tabBarInactiveBackgroundColor: this.state.colors.secondaryBackground, tabBarActiveBackgroundColor: this.state.colors.primary, }} backBehavior='initialRoute' initialRouteName='Home'>
              <Tab.Screen name='Account' options={ appStyles.screenOptionsAccount } children={ () => <Account database={ database } supabase={ supabase }/> }/>
              <Tab.Screen name='Home' options={ appStyles.screenOptionsHome }>
                { (props) => { return <Home { ...props } database={ database }/> } }
              </Tab.Screen>
              <Tab.Screen name='Settings' options={ appStyles.screenOptionsSettings } children={ () => <Settings database={ database }/> }/>
            </Tab.Navigator>
          </NavigationContainer>
        </SettingsContext.Provider>
      // </React.StrictMode>
    );
  }
}

const appStyles = StyleSheet.create({
  navigatorScreenOptions: {
    headerShown: false,
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
