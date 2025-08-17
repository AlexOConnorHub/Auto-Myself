import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { migrations } from './migrations';
import { openDatabaseSync } from 'expo-sqlite';
import { MergeableStore } from 'tinybase';
import { tables } from './schema';
import { captureMessage } from '@sentry/react-native';

export async function setupDatabase(store: MergeableStore): Promise<void> {
  const db = openDatabaseSync('auto-myself-mergeable.db');

  const persister = createExpoSqlitePersister(store, db,
    {
      mode: 'json',
      autoLoadIntervalSeconds: 60,
    },
  );
  await persister.load();
  console.log('Loaded mergeable persister');

  let current_schema_version = store.getCell(tables.schema_version, 'local', 'version') as number || 0;
  console.log(`Record of ${ current_schema_version } migrations`);
  for (current_schema_version; current_schema_version < migrations.length; current_schema_version++) {
    console.log(`Performing ${current_schema_version} migration`);
    await migrations[current_schema_version](persister);
  }

  current_schema_version = store.getCell(tables.schema_version, 'local', 'version') as number;
  if (current_schema_version > migrations.length) {
    captureMessage(`Too many migrations run! ${ current_schema_version } marked, ${ migrations.length } found`);
    store.setCell(tables.settings, 'local', 'version', migrations.length - 1);
  }

  await persister.save();
  await persister.startAutoLoad();
  await persister.startAutoSave();
};
