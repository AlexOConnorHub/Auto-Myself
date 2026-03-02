import { ImagePickerOptions, ImagePickerResult, launchCameraAsync, launchImageLibraryAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import { FlatList, Ionicons, View } from '@app/components/elements';
import { OptionButtons } from '@app/components/elements/optionButtons';
import { openSettings } from 'react-native-permissions';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useStore } from 'tinybase/ui-react';
import { v7 } from 'uuid';
import { tables } from '@app/database/schema';
import { Directory, File, Paths } from 'expo-file-system';
import ImageWithPreview from '@app/components/elements/imageWithPreview';
import { MergeableStore } from 'tinybase';

export default function ImagePicker(props) {
  const store = useStore() as MergeableStore;

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

      const currentFile = new File(result.uri);
      const fileID = v7();
      const directory = new Directory(Paths.document, 'files');
      if (!directory.exists) {
        directory.create();
      }
      const destinationFile = new File(directory, `${fileID}.jpg`);
      currentFile.copy(destinationFile);

      store.setRow(tables.files, fileID, { local_path: destinationFile.uri });
      newImages.push({ fileId: fileID, local_path: destinationFile.uri });
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

  const onDelete = (fileId) => {
    props.onChange(props.data.filter((image) => image.fileId !== fileId));
  };

  return (
    <View {...props.viewProps}>
      <OptionButtons
        options={[
          { key: 'select_photos', icon: <Ionicons name="image" size={20} />, label: 'Select' },
          { key: 'take_photo', icon: <Ionicons name="camera" size={20} />, label: 'Take' },
        ]}
        direction='horizontal'
        onSelect={(key, callback) => {
          if (key === 'select_photos') {
            pickImage(callback);
          } else if (key === 'take_photo') {
            takePhoto(callback);
          }
        }}
        highlightAll={true}
      />
      <FlatList
        horizontal={true}
        keyExtractor={(_, index) => `${index}`}
        data={props.data}
        renderItem={({ item }) => <ImageWithPreview data={item} onDelete={onDelete} />}
      />
    </View>
  );
}
