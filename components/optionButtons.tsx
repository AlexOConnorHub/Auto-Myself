import React from 'react';
import { View, Pressable, Text } from './elements';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export function OptionButtons(props): React.ReactElement {
  const theme = useTheme();
  const [value, setValue] = React.useState(props.value);
  return (
  <View style={ [pageStyles.view, { flexDirection: props.direction === 'vertical' ? 'column' : 'row' }] }>
      {
        props.options.map((option) => {
          return (
            <Pressable
              key={option.key}
              onPress={() => {
                setValue(option.key);
                props.onSelect(option.key);
              }}
              style={[
                pageStyles.pressable,
                { backgroundColor: props.value === option.key ?
                  theme.colors.primary : theme.colors.notification },
              ]}>
              <Text style={pageStyles.text}>{option.label}</Text>
            </Pressable>
          );
        })
      }
    </View>
  );
};

const pageStyles = StyleSheet.create({
  view: {
    justifyContent: 'center',
  },
  pressable: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});
