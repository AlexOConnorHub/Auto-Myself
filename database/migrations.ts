import { Store } from 'tinybase/store';
import { tables } from './schema';
import { ExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';

function incrementSchemaVersion(store: Store) {
  const currentVersion = store.getCell(tables.schema_version, 'local', 'version') as number || 0;
  store.setCell(tables.schema_version, 'local', 'version', currentVersion + 1);
}

export const migrations = [
  (persister: ExpoSqlitePersister) => {
    const store = persister.getStore();
    store.setRow(tables.settings, 'local', { distanceUnit: 'Miles', theme: 'dark' });
    incrementSchemaVersion(store);
  },
];
