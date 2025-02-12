import React from "react";
import { Pressable, Text } from "./elements";

export default function ListItem(props): React.ReactElement {
  return (
    <Pressable onPress={() => props.onPress() } style={{
      backgroundColor: null,
      borderRadius: 0,

      }}>
      {/* { backgroundColor: settings.colors.primary } */}
      <Text>
        { props.label }
      </Text>
      {/* This is going to be a verticle "..." type menu, with options to edit */}
      <Pressable onPress={() => props.onPress() }>
        <Text>
          { props.value }
        </Text>
      </Pressable>
    </Pressable>
  )
}