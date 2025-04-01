import React from 'react';
import { Pressable, Text } from './elements';
import { StyleSheet } from 'react-native';

export default function CallbackButton(props): React.ReactElement {
  const [disabled, setDisabled] = React.useState(false);
  const callback = () => {
    setDisabled(false);
  };
  return (
    <Pressable
      {...props.pressable}
      disabled={disabled}
      onPress={() => {
        setDisabled(true);
        props.onPress(callback.bind(this));
      }}
      style={[pageStyles.pressable, props.pressable ? props.pressable.style : {}]}>
      <Text {...props.text}>{props.title}</Text>
    </Pressable>
  );
}

const pageStyles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
});
