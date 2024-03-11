import {
  FontAwesome as FontAwesomePkg,
  Feather as FeatherPkg,
} from "@expo/vector-icons";
import {
  Button as ButtonPkg,
  FlatList as FlatListPkg,
  Modal as ModalPkg,
  Pressable as PressablePkg,
  ScrollView as ScrollViewPkg,
  StatusBar as StatusBarPkg,
  Text as TextPkg,
  TextInput as TextInputPkg,
  View as ViewPkg,
} from "react-native";
import { Dropdown as DropdownPkg } from 'react-native-element-dropdown';
import { KeyboardScrollView as KeyboardScrollViewPkg} from '@rlemasquerier/react-native-keyboard-scrollview';
import React from "react";
import { SettingsContext } from "../helpers/settingsContext";

class Button extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <ButtonPkg color={ this.context.button.color } { ... this.props }>
        { this.props.children }
      </ButtonPkg>
    );
  }
}

class Dropdown extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <DropdownPkg
        placeholder="Select..."
        searchPlaceholder="Search..."
        labelField="label"
        valueField="value"
        searchField="label"
        search={ true }
        activeColor={ this.context.styles.dropdown.activeColor }
        { ... this.props }
        placeholderStyle={ [this.context.styles.dropdown.placeholderStyle, this.props.placeholderStyle] }
        selectedTextStyle={ [this.context.styles.dropdown.selectedTextStyle, this.props.selectedTextStyle] }
        flatListProps={{ style: [this.context.styles.dropdown.flatListProps, this.props.flatListProps] }}
        itemTextStyle={ [this.context.styles.dropdown.itemTextStyle, this.props.itemTextStyle] }
        inputSearchStyle={ [this.context.styles.dropdown.inputSearchStyle, this.props.inputSearchStyle] }
        containerStyle={ [this.context.styles.dropdown.view, this.props.containerStyle] }
        style={[ this.context.styles.dropdown.style, this.props.style ]}/>
    );
  }
}

class Feather extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <FeatherPkg color={ this.context.colors.secondary } { ... this.props }/>
    );
  }
}

class FlatList extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <FlatListPkg { ... this.props } style={[ this.context.styles.flatList.style, this.props.style ]}/>
    );
  }
}

class FontAwesome extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <FontAwesomePkg color={ this.context.colors.secondary } { ... this.props }/>
    );
  }
}

class KeyboardScrollView extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <KeyboardScrollViewPkg { ... this.props }>
        { this.props.children }
      </KeyboardScrollViewPkg>
    );
  }
}

class Modal extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <ModalPkg { ... this.props }>
        { this.props.children }
      </ModalPkg>
    );
  }
}

class Pressable extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <PressablePkg { ... this.props } style={[ this.context.styles.pressable.style, this.props.style ]}>
        { this.props.children }
      </PressablePkg>
    );
  }
}

class ScrollView extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <ScrollViewPkg { ... this.props }>
        { this.props.children }
      </ScrollViewPkg>
    );
  }
}

class StatusBar extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <StatusBarPkg backgroundColor={ this.context.styles.statusBar.backgroundColor } barStyle={ this.context.styles.statusBar.barStyle } { ... this.props } />
    );
  }
}

class Text extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <TextPkg ellipsizeMode='tail' numberOfLines={1} { ... this.props } style={[ this.context.styles.text.style, this.props.style ]}>
        { this.props.children }
      </TextPkg>
    );
  }
}

class TextInput extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <TextInputPkg { ... this.props } style={[ this.context.styles.textInput.style, this.props.style ]}>
        { this.props.children }
      </TextInputPkg>
    );
  }
}

class View extends React.Component {
  static contextType = SettingsContext;
  render() {
    return (
      <ViewPkg { ... this.props } style={[ this.context.styles.view.style, this.props.style ]}>
        { this.props.children }
      </ViewPkg>
    );
  }
}

export {
  Button,
  Dropdown,
  Feather,
  FlatList,
  FontAwesome,
  KeyboardScrollView,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
}
