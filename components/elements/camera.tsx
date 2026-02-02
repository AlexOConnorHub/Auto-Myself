import { StyleSheet } from 'react-native';
import { Pressable, Text, View } from '@app/components/elements';
import { Camera as CameraPkg, useCameraPermission } from 'react-native-vision-camera';
import { openSettings } from 'react-native-permissions';

export default function Camera(props) {
  const { hasPermission, requestPermission } = useCameraPermission();

  if (hasPermission !== true) {
    requestPermission();
  }

  return (
    <View style={pageStyles.container}>
      {
        hasPermission ?
          <CameraPkg style={StyleSheet.absoluteFill} {...props} />
          :
          <>
            <Text> Camera permission is required to use this feature. Please grant camera access in your device settings.</Text>
            <Pressable style={pageStyles.pressable} onPress={() => openSettings()}>
              <Text style={pageStyles.text}>Open Settings</Text>
            </Pressable>
          </>
      }
    </View>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: '25%',
  },
  pressable: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    margin: 5,
  },
});
