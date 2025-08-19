import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { feedbackIntegration, init, wrap } from '@sentry/react-native';
import React, { useEffect, useState, StrictMode } from 'react';
import { Provider } from 'tinybase/ui-react';
import { Slot, SplashScreen } from 'expo-router';
import { createMergeableStore } from 'tinybase/mergeable-store';
import { tables } from '../database/schema';
import { setupDatabase } from '../database/database';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from '@app/components/elements';

const store = createMergeableStore();

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
  beforeSend(event) {
    const analyticsEnabled = store.getCell(tables.settings, 'local', 'analyticsEnabled');
    if (analyticsEnabled) {
      return event;
    }
    return null;
  },
});

SplashScreen.preventAutoHideAsync();
export default wrap(function RootLayout() {
  useEffect(() => {
    setupDatabase(store).then(() => setInitializing(false));
  }, []);

  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    if (!initializing) {
      SplashScreen.hide();
    }
  }, [initializing]);

  const storeTheme = store.getCell(tables.settings, 'local', 'theme') as string;
  const lightColors = {
    notification: '#E8E8E8',
    background: '#E8E8E8',
    secondary: '#000000',
    primary: '#B18234',
    border: '#D0D0DF',
    card: '#D0D0DF',
    text: '#000000',
  };
  const darkColors = {
    notification: '#282A3A',
    background: '#282A3A',
    secondary: '#FFFF66',
    primary: '#B18234',
    border: '#3D4153',
    card: '#3D4153',
    text: '#FFFFFF',
  };
  const [theme, setTheme] = useState({
    dark: true,
    colors: darkColors,
  });
  useEffect(() => {
    setTheme({
      dark: storeTheme === 'dark',
      colors: storeTheme === 'dark' ? darkColors : lightColors,
    });
  }, [storeTheme]);

  // console.log(JSON.stringify(DefaultTheme));
  // console.log(JSON.stringify(DarkTheme));

  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider value={theme}>
          {/* <StatusBar /> */}
          <Slot />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
});
