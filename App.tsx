import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { hide, preventAutoHideAsync } from 'expo-splash-screen';
import React, { useEffect, useState, StrictMode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStore } from 'tinybase/store';
import { Provider } from 'tinybase/ui-react';
import { NavigationContainer, StatusBar, Ionicons } from './components/elements';
import { setupDatabase } from './database/database';
import Home from './views/home';
import Settings from './views/settings';

// import { sync } from './database/synchronize';
// import { supabase } from './helpers/supabase';
// import { Account } from './views/account/account';

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh()
//   } else {
//     supabase.auth.stopAutoRefresh()
//   }
// })

const store = createStore();
const Tab = createBottomTabNavigator();

preventAutoHideAsync();
export default function App() {
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    setupDatabase(store).then(() => setInitializing(false));
  }, []);
  if (initializing) {
    return null;
  }

  hide();
  return (
    <StrictMode>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar/>
            <Tab.Navigator screenOptions={{
                tabBarStyle: {
                  borderTopWidth: 0,
                },
                tabBarShowLabel: false,
                headerTitleStyle: {
                  fontSize: 30,
                  fontWeight: 'bold',
                },
              }} backBehavior='initialRoute' initialRouteName='Home'>
              {/* <Tab.Screen name='Account' options={{
                  tabBarIcon: () => { return <FontAwesome size={40} name='user'/> },
                  tabBarAccessibilityLabel: 'Account',
                }} component={ Account }/> */}
              <Tab.Screen name='Home' options={{
                tabBarIcon: (props: {focused: boolean; color: string; size: number; }): React.ReactNode => {
                    let name = props.focused ? 'car-sharp' : 'car-outline';
                    return <Ionicons size={48} name={name as 'car-sharp' | 'car-outline'} />
                  },
                  tabBarAccessibilityLabel: 'Home',
                  headerShown: false,
                }} component={ Home } />
              <Tab.Screen name='Settings' options={{
                  tabBarIcon: (props: {focused: boolean; color: string; size: number; }): React.ReactNode => {
                    let name = props.focused ? 'settings-sharp' : 'settings-outline';
                    return <Ionicons name={name as 'settings-sharp' | 'settings-outline'} />
                  },
                  tabBarAccessibilityLabel: 'Settings',
                }} component={ Settings }/>
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </StrictMode>
  );
}
