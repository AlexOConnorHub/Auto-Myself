import { tables } from '@app/database/schema';
import { File } from 'expo-file-system';
import { createIndexes, Store } from 'tinybase';
import { v7 } from 'uuid';

export const getId = (currentIds: string[]) => {
  let tmp_v7_id;
  do {
    tmp_v7_id = v7();
  } while (currentIds.includes(tmp_v7_id));
  return tmp_v7_id;
};

export const deleteFile = (store: Store, fileId: string) => {
  const row = store.getRow(tables.files, fileId);
  if (!row) {
    return;
  }

  const file = new File(`${row.local_path}`);
  if (file.exists) {
    file.delete();
  }

  store.delRow(tables.files, fileId);
};

export const deleteRecord = (store: Store, recordId: string) => {
  const row = store.getRow(tables.maintenance_records, recordId);
  if (!row) {
    return;
  }

  const indexes = createIndexes(store);
  indexes.getSliceRowIds('byRecord', recordId)
    .filter((fileId) => store.getRow(tables.files, fileId).related_table === tables.maintenance_records)
    .forEach((fileKey) => deleteFile(store, fileKey));

  store.delRow(tables.maintenance_records, recordId);
};

export const deleteVehicle = (store: Store, vehicleId: string) => {
  const row = store.getRow(tables.vehicles, vehicleId);
  if (!row) {
    return;
  }

  const indexes = createIndexes(store);
  indexes.getSliceRowIds('byVehicle', vehicleId).forEach((recordId) => {
    deleteRecord(store, recordId);
  });

  store.delRow(tables.vehicles, vehicleId);
};
