import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { migrations } from "./migrations";
import { openDatabaseSync } from "expo-sqlite";
import { Store } from "tinybase";
import { schema, tables } from "./schema";

// take keys from schema object and make that both the keys and values of the new object
// export const tables = Object.keys(schema).reduce((acc, key) => {
//   acc[key] = Object.keys(schema[key]);
//   return acc;
// }, {});
// console.log(tables);

export async function setupDatabase(store: Store) {
  const db = openDatabaseSync('auto-myself.db');
  if (false) {
    db.execSync("DROP TABLE IF EXISTS tinybase");
  }

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
    // (sql, params) => {
    //   console.log('SQL: ' + sql);
    //   console.log('Params: ' + JSON.stringify(params));
    // },
    // (error) => {
    //   console.warn('Error: ' + error);
    // }
  );
  await persister.load()
  let current_schema_version = store.getCell('_schema_version', 'local', 'version') as number || 0;
  for (current_schema_version; current_schema_version < migrations.length; current_schema_version++) {
    migrations[current_schema_version](store);
  }
  await persister.save();
  await persister.startAutoLoad();
  await persister.startAutoSave();
  return persister;
};
