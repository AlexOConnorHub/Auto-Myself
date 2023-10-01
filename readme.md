# MyCar-TotalControl

This is a mobile app written in React Native for taking control of vehicle maintainance.

## Getting Started

Starting off, running `npm install` will install all the dependencies needed to run the app. After that, running `npm start` will start the development server. From there, you can either run the app on a simulator, or on a physical device.

### Firebase

This app uses Firebase for authentication. To get started, you will need to create a Firebase project. After doing that, you will need to create a web app, and copy the config object into a new file `./secrets/firebase-config.js`.

```javascript
export const firebaseConfig = {
  // Your config object goes here
};
```

## Back Story

After getting my first car, I was looking for a way to keep track of all the maintenance I was doing on it. I wanted to be able to see when I last changed the oil, or when I last rotated the tires. After looking for an ad free solution, and not finding one, I decided to make my own. This is the result.
