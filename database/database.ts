import { createExpoSqlitePersister, ExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { migrations } from './migrations';
import { deleteAsync, documentDirectory, getInfoAsync } from 'expo-file-system';
import { openDatabaseSync } from 'expo-sqlite';
import { MergeableStore } from 'tinybase';
import { tables } from './schema';
import { captureEvent } from '@sentry/react-native';

const migrateWatermelon = async (persister: ExpoSqlitePersister) => {
  const store = persister.getStore();

  const watermelonDB = openDatabaseSync('mycars.db', {}, documentDirectory);
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
};

export async function setupDatabase(store: MergeableStore): Promise<void> {
  const db = openDatabaseSync('auto-myself.db');

  const persister = createExpoSqlitePersister(store, db, {
    mode: 'json',
    autoLoadIntervalSeconds: 60,
  },
  );
  await persister.load();

  try {
    const watermelonDBFlie = `${ documentDirectory }/mycar.db`;
    if ((await getInfoAsync(watermelonDBFlie)).exists) {
      await migrateWatermelon(persister);
      deleteAsync(watermelonDBFlie);
    }
  } catch (e) {
    captureEvent(e);
  }

  let current_schema_version = store.getCell(tables.schema_version, 'local', 'version') as number || 0;
  for (current_schema_version; current_schema_version < migrations.length; current_schema_version++) {
    migrations[current_schema_version](persister);
  }
  await persister.save();
  await persister.startAutoLoad();
  await persister.startAutoSave();
};
