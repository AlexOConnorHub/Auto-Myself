import { setupDatabase } from '@app/database/database';
import { tables } from '@app/database/schema';
import { Directory, File, Paths } from 'expo-file-system';
import { Alert } from 'react-native';
import { unzip } from 'react-native-zip-archive';
import { createIndexes, createMergeableStore, Store } from 'tinybase';
import { getId } from './tinybase';

const importVehicle = (store: Store, vehicleData: Record<string, string|object[]>, importDirectory: Directory) => {
  const { records, ...vehicle } = vehicleData;
  const vehicle_id = getId(store.getRowIds(tables.vehicles));
  store.setRow(tables.vehicles, vehicle_id, vehicle as Record<string, string>);
  const destinationDirectory = new Directory(Paths.document, 'files');
  if (!destinationDirectory.exists) {
    destinationDirectory.create();
  }
  for (const maintenance_record of records) {
    const { files, ...record } = maintenance_record as Record<string, string|string[]>;
    const record_id = getId(store.getRowIds(tables.maintenance_records));
    store.setRow(tables.maintenance_records, record_id, { ...record, vehicle_id: vehicle_id });
    for (const file of files as string[]) {
      const fileFromImport = new File(importDirectory, file);
      const fileID = getId(store.getRowIds(tables.files));
      const fileFinalPath = new File(destinationDirectory, `${fileID}.${fileFromImport.extension}`);
      fileFromImport.copy(fileFinalPath);
      store.setRow(tables.files, fileID, {
        local_path: fileFinalPath.uri,
        related_table: tables.maintenance_records,
        related_id: record_id,
      });
    }
  }
};

const legacyImportFullDatabase = (store, toImport) => {
  Alert.alert(
    'Warning',
    'Importing may overwrite existing data! ' +
      'It is suggested to only use a full export when setting up a new device.',
    [
      {
        text: 'I Understand',
        onPress: () => {
          const tmp_store = createMergeableStore();
          tmp_store.setJson(JSON.stringify(toImport));
          store.merge(tmp_store);
          const indexes = createIndexes(store);
          setupDatabase(store).then(() => {
            indexes.setIndexDefinition('byVehicle', tables.maintenance_records, 'vehicle_id', 'date', undefined, (a: string, b: string) => b.localeCompare(a));
            indexes.setIndexDefinition('byRecord', tables.files, 'related_id');
          });
        },
      },
      {
        text: 'Abort',
      },
    ],
  );
};

const legacyImportVehicle = (store, toImport) => {
  const { records, ...vehicle } = toImport;
  const vehicle_id = getId(store.getRowIds(tables.vehicles));
  store.setRow(tables.vehicles, vehicle_id, vehicle as Record<string, string>);
  for (const maintenance_record of records) {
    const record_id = getId(store.getRowIds(tables.maintenance_records));
    store.setRow(tables.maintenance_records, record_id, { ...maintenance_record, vehicle_id: vehicle_id });
  }
};

export const importData = (store: Store, file: File) => {
  if (file.extension === '.json') {
    const toImport: object = JSON.parse(file.textSync());
    if (toImport.constructor.name === 'Array') {
      legacyImportFullDatabase(store, toImport);
    } else {
      legacyImportVehicle(store, toImport);
    }
  } else if (file.extension === '.zip') {
    const unzipDir = new Directory(Paths.cache, 'unzipped');
    if (unzipDir.exists) {
      unzipDir.delete();
    }
    unzipDir.create();
    unzip(file.uri, unzipDir.uri).then(() => {
      const dataFile = new File(unzipDir, 'data.json');
      const parsed = JSON.parse(dataFile.textSync());
      console.log('Parsed data from zip:', parsed);
      if (Array.isArray(parsed)) {
        parsed.forEach((vehicle) => {
          importVehicle(store, vehicle, unzipDir);
        });
      } else {
        importVehicle(store, parsed, unzipDir);
      }
    });
  }

};
