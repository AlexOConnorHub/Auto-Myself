import { Platform } from "react-native";

const darkColors = {
  background: '#282A3A',
  secondaryBackground: '#3D4153',
  primary: '#A67729',
  secondary: '#FFFF66',
  text: '#FFFFFF',
  theme: 'light', // Theme for status bar
};

const lightColors = {
  background: '#EEEEEE',
  secondaryBackground: '#3D4153',
  primary: '#C69749',
  secondary: '#000000',
  text: '#000000',
  theme: 'dark', // Theme for status bar
};

const colors = (true ? darkColors : lightColors);

const style = {
  view: {
    style: {
      backgroundColor: colors.background,
    }
  },
  flatList: {
    style: {
      backgroundColor: colors.background,
    }
  },
  text: {
    button: {
      color: colors.text,
    },
    style: {
      color: colors.text,
    }
  },
  textInput: {
    style: {
      backgroundColor: colors.secondaryBackground,
      color: colors.text,
    },
  },
  button: {
    color: colors.primary,
  },
  pressable: {
    style: {
      backgroundColor: colors.primary,
      borderRadius: 30,
    },
  },
  icon: {
    color: colors.secondary,
  },
  statusBar: {
    barStyle: `${colors.theme}-content`,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  },
}

export { style, colors };
