import React from 'react';
import { Text } from './elements';

export default function ConditionalText(props): React.ReactElement {
  if (!props.condition) {
    return null;
  }
  const localProps = { ...props };
  delete localProps.condition;
  return (
    <Text { ...localProps }>
      { localProps.children }
    </Text>
  );
}
