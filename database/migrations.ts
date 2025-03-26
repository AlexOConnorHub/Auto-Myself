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

    store.setTable(tables.maintenance_types, {
      0: { name: 'Oil change' },
      1: { name: 'Coolant flush' },
      2: { name: 'Cabin air filter' },
      3: { name: 'Engine air filter' },
      4: { name: 'Tire rotation' },
      5: { name: 'Brake pads' },
      6: { name: 'Brake fluid' },
      7: { name: 'Transmission fluid' },
      8: { name: 'Spark plugs' },
      9: { name: 'Transfer case fluid' },
      10: { name: 'Serpentine belt' },
      11: { name: 'Timing belt' },
      12: { name: 'Power steering fluid' },
      13: { name: 'Differential fluid' },
      14: { name: 'Change tires' },
      15: { name: 'Wheel alignment' },
      16: { name: 'Battery' },
      17: { name: 'Fuel filter' },
      18: { name: 'Fuel injector' },
      19: { name: 'Fuel pump' },
    });

    incrementSchemaVersion(store);
  },
];
