import { setStringAsync } from 'expo-clipboard';
import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { Alert } from 'react-native';

export async function exportAsFile(data: string, filename: string, shareData: { mimeType: string, dialogTitle: string }) {
  if (await isAvailableAsync()) {
    let filepath;
    let writeData = false;
    if (filename.length > 0) {
      filepath = [Paths.cache, filename];
      writeData = true;
    } else {
      filepath = [data];
    }
    console.log(filepath);
    const file = new File(...filepath);
    if (writeData) {
      file.write(data);
    }
    await shareAsync(file.uri, shareData);
    file.delete();
  } else {
    let alertMessage = 'Data copied to clipboard. Please save to a file';
    if (filename.length > 0) {
      alertMessage = 'Failed to export.';
    } else {
      await setStringAsync(data);
    }
    Alert.alert('Exported', alertMessage);
  }
}
