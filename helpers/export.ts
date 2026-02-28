import { tables } from '@app/database/schema';
import { createIndexes, Row, Store } from 'tinybase';
import { Directory, File, Paths } from 'expo-file-system';
import { zip } from 'react-native-zip-archive';
import { setStringAsync } from 'expo-clipboard';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { Alert } from 'react-native';
import { getDateString, provideDateObj } from './numbers';
const exportDir = new Directory(Paths.cache, 'export');
const filesDir = new Directory(exportDir, 'files');

export async function shareAsFile(data: {data?: string, file: string}, shareData: { mimeType: string, dialogTitle: string }) {
  if (await isAvailableAsync()) {
    let filename = data.file;
    if (data.data) {
      const file = new File(Paths.cache, filename);
      file.write(data.data);
      filename = file.uri;
    }
    await shareAsync(filename, shareData);
    if (data.data) {
      const file = new File(filename);
      file.delete();
    }
  } else {
    let alertMessage = 'Failed to export.';
    if (data.data) {
      await setStringAsync(data.data);
      alertMessage = 'Data copied to clipboard. Please save to a file';
    }
    Alert.alert('Exported', alertMessage);
  }
}

const prepareExportDirectory = () => {
  if (exportDir.exists) {
    exportDir.delete();
  }
  exportDir.create();
  filesDir.create();
};

const cleanupExportDirectory = () => {
  if (exportDir.exists) {
    exportDir.delete();
  }
};

const prepRecordFiles = (store: Store, recordId: string) => {
  const indexes = createIndexes(store);
  const final = [] as string[];

  indexes.getSliceRowIds('byRecord', recordId)
    .filter((fileId) => store.getRow(tables.files, fileId).related_table === tables.maintenance_records)
    .forEach((fileId) => {
      const file = store.getRow(tables.files, fileId);
      const source = new File(`${file.local_path}`);
      if (source.exists) {
        const destination = new File(filesDir, `${fileId}.jpg`);
        console.log(exportDir.exists, filesDir.exists, destination.exists);
        source.copy(destination);
        final.push(`files/${fileId}.jpg`);
      }
    });

  return final;
};

const getVehicleObject = (store: Store, id: string, includeFiles: boolean) => {
  const vehicle = store.getRow(tables.vehicles, id);

  const indexes = createIndexes(store);
  const recordIds = indexes.getSliceRowIds('byVehicle', id);

  const records = recordIds.map((recordId) => {
    const record = store.getRow(tables.maintenance_records, recordId) as Row & { files?: string[] };
    delete record.vehicle_id;

    if (!includeFiles) {
      return record;
    }

    record.files = prepRecordFiles(store, recordId);
    return record;
  });

  return {
    ...vehicle,
    records,
  };
};

const exportData = (data: object, includeFiles: boolean, exportBaseName: string) => {
  const jsonFile = exportDir.createFile('data.json', 'application/json');
  jsonFile.write(JSON.stringify(data, null, 4));

  if (!includeFiles) {
    shareAsFile({ file: jsonFile.uri }, { mimeType: 'application/json', dialogTitle: `Export ${exportBaseName}` });
    cleanupExportDirectory();
    return;
  }

  const zipFile = new File(Paths.cache, `${exportBaseName}.zip`);
  if (zipFile.exists) {
    zipFile.delete();
  }

  zip(exportDir.uri, zipFile.uri)
    .then(() => {
      shareAsFile({ file: zipFile.uri }, { mimeType: 'application/zip', dialogTitle: `Export ${exportBaseName}` });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      cleanupExportDirectory();
    });
};

export const exportVehicle = (store: Store, id: string, includeFiles: boolean, exportBaseName: string) => {
  prepareExportDirectory();
  const data = getVehicleObject(store, id, includeFiles);
  exportData(data, includeFiles, exportBaseName);
};

export const exportAllVehicles = (store: Store, includeFiles: boolean) => {
  prepareExportDirectory();
  const data = store.getRowIds(tables.vehicles).map((vehicleId) => getVehicleObject(store, vehicleId, includeFiles));
  exportData(data, includeFiles, `All_Vehicles_${getDateString(provideDateObj(''))}`);
};
