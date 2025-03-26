import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { migrations } from './migrations';
import { openDatabaseSync } from 'expo-sqlite';
import { Store  } from 'tinybase';
import { tables } from './schema';

export async function setupDatabase(store: Store): Promise<void> {
  const db = openDatabaseSync('auto-myself.db');

  const persister = createExpoSqlitePersister(store, db, {
    mode: 'tabular',
    autoLoadIntervalSeconds: 60,
    tables: {
      load: {
        ...tables,
        _schema_version: '_schema_version',
      },
      save: {
        ...tables,
        _schema_version: '_schema_version',
      },
    },
  },
  );
  await persister.load();
  let current_schema_version = store.getCell(tables.schema_version, 'local', 'version') as number || 0;
  for (current_schema_version; current_schema_version < migrations.length; current_schema_version++) {
    migrations[current_schema_version](persister);
  }
  await persister.save();
  await persister.startAutoLoad();
  await persister.startAutoSave();
};
