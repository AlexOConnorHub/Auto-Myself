import React from "react";
import { StyleSheet } from "react-native";
import { CallbackButton } from "../../components/callbackButton.js";
import { View, Text, Pressable } from "../../components/elements";

export class ListCars extends React.Component {
  render() {
    return (
      <View>
        <Text>Open up App.js to start working on your app!!!</Text>
        <Text>Test Firebase Data</Text>
        <CallbackButton
          title="List"
          onPress={(callback) => {
            console.log("Button pressed");
            callback();
          }}
        />
      </View>
    );
  }
}