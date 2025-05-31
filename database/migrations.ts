import { tables } from './schema';
import { ExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { MergeableStore } from 'tinybase/mergeable-store';
import { captureEvent } from '@sentry/react-native';
import { documentDirectory, getInfoAsync } from 'expo-file-system';

function incrementSchemaVersion(store: MergeableStore) {
  const currentVersion = store.getCell(tables.schema_version, 'local', 'version') as number || 0;
  store.setCell(tables.schema_version, 'local', 'version', currentVersion + 1);
}

export const migrations = [
  async (persister: ExpoSqlitePersister) => {
    const store = persister.getStore() as MergeableStore;
    store.setRow(tables.settings, 'local', { distanceUnit: 'Miles', theme: 'dark' });
    incrementSchemaVersion(store);
  },
  async (persister: ExpoSqlitePersister) => {
    const store = persister.getStore() as MergeableStore;
    try {
      const watermelonDBDirectory = documentDirectory.replace('/files', '');
      const watermelonDBFile = 'mycars.db';
      if ((await getInfoAsync(`${ watermelonDBDirectory }${ watermelonDBFile }`)).exists) {

        const watermelonDB = openDatabaseSync(watermelonDBFile, {}, watermelonDBDirectory);
        const cars = watermelonDB.getAllSync('SELECT id, nickname, upper(make), model, year, vin, lpn, created_at, updated_at FROM cars;') as Record<string, string>[];
        const maintenance_records = watermelonDB.getAllSync(`SELECT R.car_id, R.odometer, R.notes, R.cost,
          DATE(ROUND(R.created_at / 1000), 'unixepoch') as date,
          R.created_at, R.created_at as updated_at,
          T.name as type, I.interval, I.interval_unit
        FROM maintainance_records R
        LEFT JOIN maintainance_types T ON R.maintainance_type_id = T.id
        LEFT JOIN car_maintainance_intervals I ON I.car_id = R.car_id AND I.maintainance_type_id = T.id;`) as Record<string, string>[];
        const car_mapping = {} as Record<string, string>;
        for (const car of cars) {
          const oldId = car.id;
          delete car.id;
          const newId = store.addRow(tables.cars, car);
          car_mapping[oldId] = newId;
        }
        for (const maintenance_record of maintenance_records) {
          maintenance_record.car_id = car_mapping[maintenance_record.car_id];
          store.addRow(tables.maintenance_records, maintenance_record);
        }
        watermelonDB.closeSync();
      }
    } catch (e) {
      captureEvent(e);
    }
    incrementSchemaVersion(store);
  },
];
