import React, { useEffect, useRef } from 'react';
import { Pressable, Text } from './elements';
import { useNavigation } from 'expo-router';

export default function CallbackButton(props): React.ReactElement {
  const disabledRef = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      disabledRef.current = false;
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Pressable
      {...props.pressable}
      disabled={disabledRef.current}
      onPress={() => {
        if (disabledRef.current) return;
        disabledRef.current = true;
        props.onPress(() => disabledRef.current = false);
      }}
    >
      <Text {...props.text}>{props.title}</Text>
    </Pressable>
  );
}
