import React from 'react';
import { Text } from '@app/components/elements';

export default function ConditionalText(props): React.ReactElement {
  if (!props.condition) {
    return <></>;
  }
  const localProps = { ...props };
  delete localProps.condition;
  return (
    <Text { ...localProps }>
      { localProps.children }
    </Text>
  );
}
