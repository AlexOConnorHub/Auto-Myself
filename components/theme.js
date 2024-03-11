import { Platform } from "react-native";

const darkColors = {
  key: 'dark',
  background: '#282A3A',
  secondaryBackground: '#3D4153',
  primary: '#A67729',
  secondary: '#FFFF66',
  text: '#FFFFFF',
  theme: 'light', // Theme for status bar
};

const lightColors = {
  key: 'light',
  background: '#C8C8C8',
  secondaryBackground: '#A3A3A3',
  primary: '#A67729',
  secondary: '#000000',
  text: '#000000',
  theme: 'dark', // Theme for status bar
};

function themedStyle(colors) {
  return {
    button: {
      color: colors.primary,
    },
    dropdown: {
      activeColor: colors.background,
      style: {
        backgroundColor: colors.secondaryBackground,
        color: colors.text,
      },
      placeholderStyle: {
        color: colors.text,
      },
      selectedTextStyle: {
        color: colors.text,
      },
      flatListProps: {
        backgroundColor: colors.secondaryBackground,
      },
      itemTextStyle: {
        color: colors.text,
      },
      inputSearchStyle: {
        color: colors.text,
        backgroundColor: colors.secondaryBackground,
        borderWidth: 0,
      },
      view: {
        backgroundColor: colors.background,
        borderWidth: 1.5,
        borderColor: colors.primary,
      },
    },
    icon: {
      color: colors.secondary,
    },
    flatList: {
      style: {
        backgroundColor: colors.background,
      }
    },
    keyboardAvoidingView: {
      behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    },
    pressable: {
      style: {
        backgroundColor: colors.primary,
        borderRadius: 30,
      },
    },
    statusBar: {
      barStyle: `${colors.theme}-content`,
      backgroundColor: colors.background,
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
    view: {
      style: {
        backgroundColor: colors.background,
      }
    },
  };
}

export { darkColors, lightColors, themedStyle };
