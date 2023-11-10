import { Platform } from "react-native";

const darkColors = {
  background: '#282A3A',
  secondaryBackground: '#3D4153',
  primary: '#C69749',
  secondary: '#735F32',
  text: '#FFFFFF',
  theme: 'light',
};

const lightColors = {
  background: '#EFEFEF',
  primary: '#735F32',
  secondary: '#C69749',
  secondaryBackground: '#3D4153',
  text: '#000000',
  theme: 'dark',
};

const colors = (true ? darkColors : lightColors);

const style = {
  colors: colors,
  view: {
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
  },
  keyboardAvoidingView: {
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  },
}

export { style };
