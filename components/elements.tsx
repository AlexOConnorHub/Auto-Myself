import {
  FontAwesome as FontAwesomePkg,
  Feather as FeatherPkg,
  Ionicons as IoniconsPkg,
} from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import {
  FlatList as FlatListPkg,
  Modal as ModalPkg,
  Pressable as PressablePkg,
  StatusBar as StatusBarPkg,
  Text as TextPkg,
  TextInput as TextInputPkg,
  View as ViewPkg,
} from 'react-native';
import DateTimePickerPkg from '@react-native-community/datetimepicker';
import { Dropdown as DropdownPkg } from 'react-native-element-dropdown';
import React from 'react';
import { KeyboardAwareScrollView as KeyboardAwareScrollViewPkg } from 'react-native-keyboard-controller';

export function DateTimePicker(props): React.ReactElement {
  const theme = useTheme();
  return (
    <DateTimePickerPkg
      themeVariant={ theme.dark ? 'dark' : 'light' }
      textColor={ theme.colors.text }
      accentColor={ theme.colors.border }
      { ...props }
    />
  );
}

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
      flatListProps={{ style: { backgroundColor: theme.colors.border }, ...props.flatListProps }}
      itemTextStyle={[{ color: theme.colors.text }, props.itemTextStyle ]}
      inputSearchStyle={[{ color: theme.colors.text, backgroundColor: theme.colors.border, borderWidth: 0 }, props.inputSearchStyle ]}
      containerStyle={[{ backgroundColor: theme.colors.background, borderWidth: 1.5, borderColor: theme.colors.primary }, props.containerStyle ]}
      style={[{ backgroundColor: theme.colors.border }, props.style ]} />
  );
}

export function Feather(props: Readonly<React.ComponentProps<typeof FeatherPkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <FeatherPkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function FlatList(props: Readonly<React.ComponentProps<typeof FlatListPkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <FlatListPkg { ...props } style={{ backgroundColor: theme.colors.background, ...props.style as object }}/>
  );
}

export function FontAwesome(props: Readonly<React.ComponentProps<typeof FontAwesomePkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <FontAwesomePkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function Ionicons(props: Readonly<React.ComponentProps<typeof IoniconsPkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <IoniconsPkg color={ theme.colors.text } size={40} { ...props }/>
  );
}

export function KeyboardAwareScrollView(props): React.ReactElement {
  return (
    <KeyboardAwareScrollViewPkg { ...props }>
      { props.children }
    </KeyboardAwareScrollViewPkg>
  );
}

export function Modal(props: React.ComponentProps<typeof ModalPkg>): React.ReactElement {
  return (
    <ModalPkg { ...props }>
      { props.children }
    </ModalPkg>
  );
}

export function Pressable(props: React.ComponentProps<typeof PressablePkg>): React.ReactElement {
  const theme = useTheme();
  return (
    <PressablePkg { ...props } style={[{ backgroundColor: theme.colors.primary, borderRadius: 30 }, props.style as object ]}>
      { props.children }
    </PressablePkg>
  );
}

export function StatusBar(props: Readonly<React.ComponentProps<typeof StatusBarPkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <StatusBarPkg barStyle={ theme.dark ? 'light-content' : 'dark-content' } { ...props }/>
  );
}

export function Text(props: Readonly<React.ComponentProps<typeof TextPkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <TextPkg { ...props } style={{ color: theme.colors.text, ...props.style as object }}>
      { props.children }
    </TextPkg>
  );
}

export function TextInput(props: Readonly<React.ComponentProps<typeof TextInputPkg>>): React.ReactElement {
  const theme = useTheme();
  return (
    <TextInputPkg { ...props } style={{ backgroundColor: theme.colors.border, color: theme.colors.text, borderColor: theme.colors.border, ...props.style as object }}>
      { props.children }
    </TextInputPkg>
  );
}

export function View(props: Readonly<React.ComponentProps<typeof ViewPkg>>): React.ReactElement {
  return (
    <ViewPkg { ...props }>
      { props.children }
    </ViewPkg>
  );
}
