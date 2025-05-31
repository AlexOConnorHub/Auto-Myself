// import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { feedbackIntegration, init, wrap } from '@sentry/react-native';
import { hide, preventAutoHideAsync } from 'expo-splash-screen';
import React, { useEffect, useState, StrictMode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'tinybase/ui-react';
import { NavigationContainer, StatusBar, Ionicons } from './components/elements';
import { setupDatabase } from './database/database';
import Home from './views/home';
import Settings from './views/settings';
import { NavigatorScreenParams, ParamListBase } from '@react-navigation/native';
import { createMergeableStore } from 'tinybase/mergeable-store';

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

export interface TabParamList extends ParamListBase {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Settings: undefined;
};

export interface HomeStackParamList extends ParamListBase {
  Index: undefined;
  EditCar: undefined;
  Records: undefined;
  EditRecord: undefined;
};

init({
  dsn: 'https://ec4adae5dfe85a00b368745227de8d66@o4509037304807424.ingest.us.sentry.io/4509037306707968',
  integrations: [
    feedbackIntegration({
      formTitle: 'Provide Feedback',
      submitButtonLabel: 'Send Feedback',
      messageLabel: 'Feedback',
      messagePlaceholder: 'What is your feedback?',
      successMessageText: 'Thank you for your feedback!',
    }),
  ],
});

const store = createMergeableStore();
const Tab = createBottomTabNavigator();

preventAutoHideAsync();
export default wrap(function App() {
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
                tabBarIcon: (props: {focused: boolean; }): React.ReactNode => {
                  return <Ionicons size={48} name={props.focused ? 'car-sharp' : 'car-outline'} />;
                },
                tabBarAccessibilityLabel: 'Home',
                headerShown: false,
              }} component={ Home } />
              <Tab.Screen name='Settings' options={{
                tabBarIcon: (props: {focused: boolean; }): React.ReactNode => {
                  return <Ionicons name={props.focused ? 'settings-sharp' : 'settings-outline'} />;
                },
                tabBarAccessibilityLabel: 'Settings',
              }} component={ Settings }/>
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </StrictMode>
  );
});
