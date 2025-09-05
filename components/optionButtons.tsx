import React from 'react';
import { View } from './elements';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import CallbackButton from './callbackButton';

export function OptionButtons(props): React.ReactElement {
  const theme = useTheme();

  return (
    <View style={[pageStyles.view, { flexDirection: props.direction === 'vertical' ? 'column' : 'row' }]}>
      {
        props.options.map((option: { key: string; label: string; label_style?: object }) => {
          return (
            <CallbackButton
              key={option.key}
              onPress={(callback) => {
                props.onSelect(option.key, callback);
              }}
              pressable={{
                style: {
                  ...pageStyles.pressable,
                  backgroundColor: props.value === option.key || props.highlightAll ? theme.colors.primary : theme.colors.card,
                  width: `${props.direction === 'vertical' ? 95 : (100 / props.options.length) - 2}%`,
                },
              }}
              title={option.label}
            />
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
});
