import React from "react";
import {
  Button as ButtonRN,
  FlatList as FlatListRN,
  Modal as ModalRN,
  Pressable as PressableRN,
  ScrollView as ScrollViewRN,
  StatusBar as StatusBarRN,
  Text as TextRN,
  TextInput as TextInputRN,
  View as ViewRN,
} from "react-native";
import {
  FontAwesome as FontAwesomeRN,
  Feather as FeatherRN,
} from "@expo/vector-icons";
import { style, colors } from "./style";
import { KeyboardScrollView as KeyboardScrollViewPkg} from '@rlemasquerier/react-native-keyboard-scrollview';

let Button = (props) => (
  <ButtonRN color={ style.button.color }  { ... props }>
    { props.children }
  </ButtonRN>
);

let Feather = (props) => (
  <FeatherRN color={ style.icon.color } { ... props } />
);

let FlatList = (props) => (
  <FlatListRN { ... props } style={[ style.flatList.style, props.style ]}/>
);

let FontAwesome = (props) => (
  <FontAwesomeRN color={ style.icon.color } { ... props }/>
);

let KeyboardScrollView = (props) => {
  return (
    <KeyboardScrollViewPkg { ... props }>
      { props.children }
    </KeyboardScrollViewPkg>
  );
}

let Modal = (props) => (
  <ModalRN { ... props }>
    { props.children }
  </ModalRN>
);

let Pressable = (props) => (
  <PressableRN { ... props } style={[ style.pressable.style, props.style ]}>
    { props.children }
  </PressableRN>
);

let ScrollView = (props) => (
  <ScrollViewRN { ... props }>
    { props.children }
  </ScrollViewRN>
);

let StatusBar = (props) => (
  <StatusBarRN backgroundColor={ style.statusBar.backgroundColor } barStyle={ style.statusBar.barStyle } { ... props } />
);

let Text = (props) => (
  <TextRN { ... props } style={[ style.text.style, props.style ]}>
    { props.children }
  </TextRN>
);

let TextInput = (props) => (
  <TextInputRN { ... props } style={[ style.textInput.style, props.style ]}>
    { props.children }
  </TextInputRN>
);

let View = (props) => (
  <ViewRN { ... props } style={[ style.view.style, props.style ]}>
    { props.children }
  </ViewRN>
);
    
export {
  Button,
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
