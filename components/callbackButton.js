import React from 'react';
import { Pressable, Text } from './elements';
import { StyleSheet } from 'react-native';

class CallbackButton extends React.Component {
  state = {
    disabled: false
  };
  render() {
    return (
      <Pressable
        {...this.props.pressable}
        disabled={this.state.disabled}
        onPress={() => {
          this.setState({ disabled: true });
          this.props.onPress(this.callback.bind(this));
        }}
        style={[pageStyles.pressable, this.props.pressable ? this.props.pressable.style : {}]}>
        <Text {...this.props.text}>{this.props.title}</Text>
      </Pressable>
    );
  }
  callback() {
    this.setState({ disabled: false });
  }
}

export { CallbackButton };

const pageStyles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
});