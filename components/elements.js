import React from "react";
import {
  Button as ButtonRN,
  Modal as ModalRN,
  Pressable as PressableRN,
  StatusBar as StatusBarRN,
  Text as TextRN,
  TextInput as TextInputRN,
  View as ViewRN,
} from "react-native";
import {
  FontAwesome as FontAwesomeRN,
  Feather as FeatherRN,
} from "@expo/vector-icons";
import { style } from "./style";

class Button extends React.Component {
  render() {
    return (
      <ButtonRN color={ style.button.color } { ... this.props }>
        { this.props.children }
      </ButtonRN>
    )
  }
}

class FontAwesome extends React.Component {
  render() {
    return (
      <FontAwesomeRN color={ style.icon.color } { ... this.props } />
    )
  }
}
  
class Feather extends React.Component {
  render() {
    return (
      <FeatherRN color={ style.icon.color } { ... this.props } />
    )
  }
}

class Modal extends React.Component {
  render() {
    return (
      <ModalRN { ... this.props }>
        { this.props.children }
      </ModalRN>
    )
  }
}

class Pressable extends React.Component {
  render() {
    return (
      <PressableRN { ... this.props } style={[ style.pressable.style, this.props.style ]}>
        { this.props.children }
      </PressableRN>
    )
  }
}
  
class StatusBar extends React.Component {
  render() {
    return (
      <StatusBarRN backgroundColor={ style.colors.background } barStyle={ style.statusBar.barStyle } { ... this.props } />
    )
  }
}

class Text extends React.Component {
  render() {
    return (
      <TextRN { ... this.props } style={[ this.props.style, style.text.style ]}>
        { this.props.children }
      </TextRN>
    )
  }
}

class TextInput extends React.Component {
  render() {
    return (
      <TextInputRN { ... this.props } style={[ style.textInput.style, this.props.style ]}>
        { this.props.children }
      </TextInputRN>
    )
  }
}

class View extends React.Component {
  render() {
    return (
      <ViewRN { ... this.props } style={[ this.props.style, style.view.style ]}>
        { this.props.children }
      </ViewRN>
    )
  }
}
    
export {
  Button,
  Feather,
  FontAwesome,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
}
