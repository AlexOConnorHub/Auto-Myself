import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { feedbackIntegration, init, wrap } from '@sentry/react-native';
import React, { useEffect, StrictMode } from 'react';
import { Provider, useCell } from 'tinybase/ui-react';
import { Slot, SplashScreen } from 'expo-router';
import { createMergeableStore } from 'tinybase/mergeable-store';
import { tables } from '../database/schema';
import { setupDatabase } from '../database/database';
import { ThemeProvider } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';

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
    setupDatabase(store).then(() => SplashScreen.hide());
  }, []);

  const storedTheme = useCell(tables.settings, 'local', 'theme', store);
  const systemTheme = useColorScheme();

  const lightTheme = {
    notification: '#E8E8E8',
    background: '#E8E8E8',
    primary: '#B18234',
    border: '#D0D0DF',
    card: '#D0D0DF',
    text: '#000000',
  };

  const darkTheme = {
    notification: '#282A3A',
    background: '#282A3A',
    primary: '#B18234',
    border: '#3D4153',
    card: '#3D4153',
    text: '#FFFFFF',
  };

  let theme;
  if (storedTheme === 'light' || (storedTheme == 'auto' && systemTheme === 'light')) {
    theme = {
      dark: false,
      colors: lightTheme,
    };
  } else {
    theme = {
      dark: true,
      colors: darkTheme,
    };
  }

  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider value={ theme }>
          <Slot />
          <StatusBar barStyle={ theme.dark ? 'light-content' : 'dark-content' } />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
});
