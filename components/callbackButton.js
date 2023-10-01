import React from 'react';
import { Button } from './elements.js';

class CallbackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
  }

  render() {
    return (
      <Button
        title={this.props.title}
        disabled={this.state.disabled}
        onPress={() => {
          this.setState({ disabled: true });
          this.props.onPress(this.callback.bind(this));
        }}
      />
    );
  }

  callback() {
    this.setState({ disabled: false });
  }
}

export { CallbackButton };
