import { Store } from "tinybase/store";
import { tables } from "./schema";

export const migrations = [
  (store: Store) => {
    console.log('Migration 1');
    console.log(tables);
    store.setRow(tables.settings, 'local', { distanceUnit: 'Miles', theme: 'dark' });
    console.log(store.getRow(tables.settings, 'local'));

    // for (let version in MaintainanceType.defaultMaintainanceTypes) {
    //   if (version > currentVersion) {
    //     await database.write(async () => {
    //       let maintainanceTypeTable = database.get(tables.maintainance_types);
    //       for (let maintainanceType of MaintainanceType.defaultMaintainanceTypes[version]) {
    //         await maintainanceTypeTable.create((record) => {
    //           record.name = maintainanceType;
    //         });
    //       }
    //     });
    //     kvStorage.set('database.seed.maintainance_type.version', Number(version));
    //   }
    // }

    let currentVersion = store.getCell('_schema_version', 'local', 'version') as number || 0;
    store.setCell('_schema_version', 'local',  'version', currentVersion + 1);
    console.log('Stored version: ', store.getCell('_schema_version', 'local', 'version',));
  },
];
