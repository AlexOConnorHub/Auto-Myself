import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from "../secrets/firebase-config.js"; 

let app;
let auth;
if (getApps().length) {
  app = getApp();
  auth = getAuth();
} else {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { app, auth };
