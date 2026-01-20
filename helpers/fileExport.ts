import { setStringAsync } from 'expo-clipboard';
import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { Alert } from 'react-native';

export async function exportAsFile(data: string, filename: string) {
  if (await isAvailableAsync()) {
    const file = new File(Paths.cache, filename);
    file.write(data);
    shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Export AutoMyself Data' });
  } else {
    await setStringAsync(data);
    Alert.alert('Exported', 'Data copied to clipboard. Please save to a file');
  }
}
