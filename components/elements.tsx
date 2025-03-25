import {
  FontAwesome as FontAwesomePkg,
  Feather as FeatherPkg,
  EvilIcons as EvilIconsPkg,
  Ionicons as IoniconsPkg,
} from "@expo/vector-icons";
import { NavigationContainer as NavigationContainerPkg, useTheme} from '@react-navigation/native';
import {
  // Button as ButtonPkg,
  FlatList as FlatListPkg,
  KeyboardAvoidingView as KeyboardAvoidingViewPkg,
  Modal as ModalPkg,
  Platform,
  Pressable as PressablePkg,
  ScrollView as ScrollViewPkg,
  StatusBar as StatusBarPkg,
  Text as TextPkg,
  TextInput as TextInputPkg,
  View as ViewPkg,
} from "react-native";
import { Dropdown as DropdownPkg } from 'react-native-element-dropdown';
import React from "react";
import { useHeaderHeight } from '@react-navigation/elements'
import { useCell } from "tinybase/ui-react";
import { tables } from "../database/schema";

// export function Button(props: React.ComponentProps<typeof ButtonPkg>): React.ReactElement {
//   const theme = useTheme();
//   return (
//     <ButtonPkg color={ theme.colors.primary } { ...props }>
//       { props.children }
//     </ButtonPkg>
//   );
// }

export function Dropdown(props: React.ComponentProps<typeof DropdownPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <DropdownPkg
      placeholder="Select..."
      searchPlaceholder="Search..."
      labelField="label"
      valueField="value"
      searchField="label"
      search={ true }
      activeColor={ theme.colors.background }
      { ...props }
      placeholderStyle={[{ color: theme.colors.text }, props.placeholderStyle ]}
      selectedTextStyle={[{ color: theme.colors.text }, props.selectedTextStyle ]}
      flatListProps={{ style: { backgroundColor: theme.colors.border } , ...props.flatListProps }}
      itemTextStyle={[{ color: theme.colors.text }, props.itemTextStyle ]}
      inputSearchStyle={[{ color: theme.colors.text, backgroundColor: theme.colors.border, borderWidth: 0 }, props.inputSearchStyle ]}
      containerStyle={[{ backgroundColor: theme.colors.background, borderWidth: 1.5, borderColor: theme.colors.primary }, props.containerStyle ]}
      style={[{ backgroundColor: theme.colors.border }, props.style ]} />
  );
}

export function EvilIcons(props: React.ComponentProps<typeof EvilIconsPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <EvilIconsPkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function Feather(props: React.ComponentProps<typeof FeatherPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <FeatherPkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function FlatList(props: React.ComponentProps<typeof FlatListPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <FlatListPkg { ...props } style={{ backgroundColor: theme.colors.background, ...props.style as object }}/>
  );
}

export function FontAwesome(props: React.ComponentProps<typeof FontAwesomePkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <FontAwesomePkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function Ionicons(props: React.ComponentProps<typeof IoniconsPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <IoniconsPkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function KeyboardAvoidingView(props: React.ComponentProps<typeof KeyboardAvoidingViewPkg>): React.ReactElement {
  const height = useHeaderHeight()
  return (
    <KeyboardAvoidingViewPkg keyboardVerticalOffset={height} behavior={ Platform.select({android: undefined, ios: 'padding'}) } { ...props }>
      { props.children }
    </KeyboardAvoidingViewPkg>
  );
}

export function Modal(props: React.ComponentProps<typeof ModalPkg>): React.ReactElement {
  return (
    <ModalPkg { ...props }>
      { props.children }
    </ModalPkg>
  );
}

export function NavigationContainer(props: React.ComponentProps<typeof NavigationContainerPkg>): React.ReactElement {
  const theme = useCell(tables.settings, 'local', 'theme');

  // theme: 'dark', // Theme for status bar
  const colors = theme === 'light' ? {
    notification: '#E8E8E8',
    background: '#E8E8E8',
    secondary: '#000000',
    primary: '#B18234',
    border: '#A3A3A3',
    card: '#A3A3A3',
    text: '#000000',
  } : {
    notification: '#282A3A',
    background: '#282A3A',
    secondary: '#FFFF66',
    primary: '#B18234',
    border: '#3D4153',
    card: '#3D4153',
    text: '#FFFFFF',
  };

  return (
    <NavigationContainerPkg theme={{ dark: theme === 'dark', colors: colors }}>
      { props.children }
    </NavigationContainerPkg>
  );
}

export function Pressable(props: React.ComponentProps<typeof PressablePkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <PressablePkg { ...props } style={[{ backgroundColor: theme.colors.primary, borderRadius: 30}, props.style as object ]}>
      { props.children }
    </PressablePkg>
  );
}

export function ScrollView(props: React.ComponentProps<typeof ScrollViewPkg>): React.ReactElement {
  return (
    <ScrollViewPkg bounces={ false } { ...props }>
      { props.children }
    </ScrollViewPkg>
  );
}

export function StatusBar(props: React.ComponentProps<typeof StatusBarPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <StatusBarPkg backgroundColor={ theme.colors.border } barStyle={ theme.dark ? 'light-content' : 'dark-content' } { ...props }/>
  );
}

export function Text(props: React.ComponentProps<typeof TextPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <TextPkg ellipsizeMode='tail' numberOfLines={1} { ...props } style={{ color: theme.colors.text, ...props.style as object }}>
      { props.children }
    </TextPkg>
  );
}

export function TextInput(props: React.ComponentProps<typeof TextInputPkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <TextInputPkg { ...props } style={{ backgroundColor: theme.colors.border, color: theme.colors.text, ...props.style as object }}>
      { props.children }
    </TextInputPkg>
  );
}

export function View(props: React.ComponentProps<typeof ViewPkg>): React.ReactElement {
  return (
    <ViewPkg { ...props }>
      { props.children }
    </ViewPkg>
  );
}
