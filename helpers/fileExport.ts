import { setStringAsync } from 'expo-clipboard';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { cacheDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system';
import { Alert } from 'react-native';

export async function exportAsFile(data: string, filename: string) {
  if (await isAvailableAsync()) {
    const fileLocation = `${cacheDirectory}${filename}`;
    await writeAsStringAsync(fileLocation, data, { encoding: EncodingType.UTF8 });
    shareAsync(fileLocation);
  } else {
    await setStringAsync(data);
    Alert.alert('Exported', 'Data copied to clipboard. Please save to a file');
  }
}
