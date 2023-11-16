import React from 'react';
import { Button } from './elements';

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
        {...this.props}
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
