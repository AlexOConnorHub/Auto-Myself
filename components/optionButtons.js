import React from 'react';
import { View, Pressable, Text } from './elements';
import { StyleSheet } from 'react-native';
import { SettingsContext } from '../helpers/settingsContext';

class OptionButtons extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
    <View style={ [pageStyles.view, { flexDirection: this.props.direction === 'vertical' ? 'column' : 'row' }] }>
        {
          this.props.options.map((option) => {
            return (
              <Pressable
                key={option.key}
                onPress={() => {
                  this.setState({ value: option.key });
                  this.props.onSelect(option.key);
                }}
                style={[
                  pageStyles.pressable,
                  { backgroundColor: this.props.value === option.key ?
                    this.context.colors.primary : this.context.colors.secondaryBackground },
                ]}>
                <Text style={pageStyles.text}>{option.label}</Text>
              </Pressable>
            );
          })
        }
      </View>
    );
  }
}

export { OptionButtons };

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
