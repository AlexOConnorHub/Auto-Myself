import React from 'react';
import { View } from '@app/components/elements';

export default function ConditionalView(props): React.ReactElement {
  if (!props.condition) {
    return <></>;
  }
  const localProps = { ...props };
  delete localProps.condition;
  return (
    <View { ...localProps }>
      { localProps.children }
    </View>
  );
}
