import React from 'react';
import { View, Pressable, Text } from './elements';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export function OptionButtons(props): React.ReactElement {
  const theme = useTheme();
  const [value, setValue] = React.useState(props.value || props.options[0].key);
  return (
    <View style={[pageStyles.view, { flexDirection: props.direction === 'vertical' ? 'column' : 'row' }]}>
      {
        props.options.map((option: { key: string; label: string;}) => {
          return (
            <Pressable
              key={option.key}
              onPress={() => {
                setValue(option.key);
                props.onSelect(option.key);
              }}
              style={[
                pageStyles.pressable,
                {
                  backgroundColor: props.value === option.key ? theme.colors.primary : theme.colors.card,
                  width: `${props.direction === 'vertical' ? 95 : 100 / props.options.length}%`,
                },
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
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});
