import { ImagePickerOptions, ImagePickerResult, launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import { FlatList, Ionicons, Text, View } from '../elements';
import { Image, StyleSheet } from 'react-native';
import { OptionButtons } from './optionButtons';
import { openSettings } from 'react-native-permissions';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export default function ImagePicker(props) {
  const addImages = async (result: ImagePickerResult) => {
    const assets = result.assets.filter((asset) => asset.uri !== undefined);
    const newImages = [];
    for (const asset of assets) {
      const manipulator = ImageManipulator.manipulate(asset.uri);
      const render = await manipulator.renderAsync();
      const result = await render.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.75,
      });
      newImages.push(result.uri);
    }
    props.onChange([...props.data, ...newImages]);
  };

  const imagePickerOptions = {
    mediaTypes: 'images',
    allowsMultipleSelection: true,
    quality: 0.75,
    base64: false,
    exif: false,
  } as ImagePickerOptions;

  const pickImage = async (callback) => {
    callback();
    const result = await launchImageLibraryAsync(imagePickerOptions);

    if (!result.canceled) {
      addImages(result);
    }
  };

  const takePhoto = async (callback) => {
    callback();
    const permissionResult = await requestCameraPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      openSettings();
      return;
    }

    const result = await launchCameraAsync(imagePickerOptions);

    if (!result.canceled) {
      addImages(result);
    }
  };

  return (
    <View {...props.viewProps}>
      <OptionButtons
        options={[
          { key: 'select_photos', label: <View style={pageStyles.buttonText}><Ionicons name="image" size={20} /><Text style={pageStyles.buttonText}> Select</Text></View> },
          { key: 'take_photo', label: <View style={pageStyles.buttonText}><Ionicons name="camera" size={20} /><Text style={pageStyles.buttonText}> Take</Text></View> },
        ]}
        direction='horizontal'
        onSelect={(key, callback) => {
          if (key === 'select_photos') {
            pickImage(callback);
          } else if (key === 'take_photo') {
            takePhoto(callback);
          }
        }}
      />
      <FlatList
        horizontal={true}
        keyExtractor={(_, index) => `${index}`}
        data={props.data}
        renderItem={({ item }) => <Image source={{ uri: item as string }} style={{ width: 100, height: 100, margin: 5 }} />}
      />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  buttonText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
