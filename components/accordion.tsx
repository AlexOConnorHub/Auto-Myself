import { useRef, useState, useEffect } from 'react';
import { Ionicons, View, Text, Pressable } from './elements';
import { useTheme } from '@react-navigation/native';
import { Animated, LayoutChangeEvent, StyleSheet } from 'react-native';

export default function Accordion(props) {
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? contentHeight : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight]);

  const onContentLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
    }
  };

  return (
    <View>
      <Pressable
        style={[pageStyles.heading, {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        }]}
        onPress={() => setIsOpen((prev) => !prev)}>
        <Text>{props.title}</Text>
        <Ionicons
          name={ isOpen ? 'chevron-down-outline' : 'chevron-back-outline'}
        />
      </Pressable>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <View
          style={pageStyles.contentWrapper}
          onLayout={onContentLayout}
          pointerEvents="none"
        >
          {props.children}
        </View>
        {props.children}
      </Animated.View>
      <View style={[ pageStyles.hr, { borderColor: theme.colors.card } ]}/>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  hr: {
    borderTopWidth: 3,
  },
  contentWrapper: {
    position: 'absolute',
    opacity: 0,
  },
});
