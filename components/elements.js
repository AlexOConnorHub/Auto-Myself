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
import { style, colors } from "./style";

let Button = (props) => (
  <ButtonPkg color={ style.button.color }  { ... props }>
    { props.children }
  </ButtonPkg>
);

let Dropdown = (props) => (
  <DropdownPkg 
    placeholder="Select..."
    searchPlaceholder="Search..."
    labelField="label"
    valueField="value"
    searchField="label"
    search={ true }
    activeColor={ colors.background }
    { ... props }
    placeholderStyle={ [style.dropdown.placeholderStyle, props.placeholderStyle] }
    selectedTextStyle={ [style.dropdown.selectedTextStyle, props.selectedTextStyle] }
    flatListProps={{ style: [style.dropdown.flatListProps, props.flatListProps] }}
    itemTextStyle={ [style.dropdown.itemTextStyle, props.itemTextStyle] }
    inputSearchStyle={ [style.dropdown.inputSearchStyle, props.inputSearchStyle] }
    containerStyle={ [style.dropdown.view, props.containerStyle] }
    style={[ style.dropdown.style, props.style ]}/>
);

let Feather = (props) => (
  <FeatherPkg color={ style.icon.color } { ... props } />
);

let FlatList = (props) => (
  <FlatListPkg { ... props } style={[ style.flatList.style, props.style ]}/>
);

let FontAwesome = (props) => (
  <FontAwesomePkg color={ style.icon.color } { ... props }/>
);

let KeyboardScrollView = (props) => {
  return (
    <KeyboardScrollViewPkg { ... props }>
      { props.children }
    </KeyboardScrollViewPkg>
  );
}

let Modal = (props) => (
  <ModalPkg { ... props }>
    { props.children }
  </ModalPkg>
);

let Pressable = (props) => (
  <PressablePkg { ... props } style={[ style.pressable.style, props.style ]}>
    { props.children }
  </PressablePkg>
);

let ScrollView = (props) => (
  <ScrollViewPkg { ... props }>
    { props.children }
  </ScrollViewPkg>
);

let StatusBar = (props) => (
  <StatusBarPkg backgroundColor={ style.statusBar.backgroundColor } barStyle={ style.statusBar.barStyle } { ... props } />
);

let Text = (props) => (
  <TextPkg ellipsizeMode='tail' numberOfLines={1} { ... props } style={[ style.text.style, props.style ]}>
    { props.children }
  </TextPkg>
);

let TextInput = (props) => (
  <TextInputPkg { ... props } style={[ style.textInput.style, props.style ]}>
    { props.children }
  </TextInputPkg>
);

let View = (props) => (
  <ViewPkg { ... props } style={[ style.view.style, props.style ]}>
    { props.children }
  </ViewPkg>
);
    
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
