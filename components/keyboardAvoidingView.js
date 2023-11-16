import React from "react";
import { StyleSheet, View, Animated, Keyboard, TextInput } from "react-native";

const KeyboardAvoidingFlatList = (props) => {
  const keyboardOffset = React.useRef(new Animated.Value(0)).current;

  // 200 duration is somewhat a magic number that seemed to work nicely with
  // the default keyboard opening speed
  const startAnimation = (toValue) =>
    Animated.timing(keyboardOffset, { toValue, duration: 200 }).start();

  React.useEffect(() => {
    // start the animation when the keyboard appears
    Keyboard.addListener("keyboardWillShow", (e) => {
      // use the height of the keyboard (negative because the translateY moves upward)
      startAnimation(-e.endCoordinates?.height);
    });
    // perform the reverse animation back to keyboardOffset initial value: 0
    Keyboard.addListener("keyboardWillHide", () => {
      startAnimation(0);
    });
    return () => {
      // remove listeners to avoid memory leak
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  return (
    <Animated.FlatList { ...props } style={[ { transform: [{ translateY: keyboardOffset }] }, props.style ]}/>
  );
}

export { KeyboardAvoidingFlatList };

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});