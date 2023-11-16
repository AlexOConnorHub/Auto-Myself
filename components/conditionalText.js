import React from "react";
import { Text } from "./elements";

class ConditionalText extends React.Component {
  render() {
    if (this.props.condition) {
      let props = Object.assign({}, this.props);
      delete props.condition;
      return (
        <Text { ...props }>
          { this.props.children }
        </Text>
      );
    } else {
      return null;
    }
  }
}

export { ConditionalText };
