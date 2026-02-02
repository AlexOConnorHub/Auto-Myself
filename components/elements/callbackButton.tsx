import { useState } from 'react';
import { Pressable, Text } from '@app/components/elements';

export default function CallbackButton(props: Readonly<{ pressable?: React.ComponentProps<typeof Pressable>; text?: React.ComponentProps<typeof Text>; title: string; onPress: (callback: () => void) => void }>): React.ReactElement {
  const [disabled, setDisabled] = useState(false);

  return (
    <Pressable
      {...props.pressable}
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        setDisabled(true);
        props.onPress(() => setDisabled(false));
      }}
    >
      <Text {...props.text}>{props.title}</Text>
    </Pressable>
  );
}
