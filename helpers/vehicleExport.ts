import { schema, tables } from '@app/database/schema';
import { createQueries } from 'tinybase';
import { exportAsFile } from './fileExport';

export const exportVehicle = (store, id: string) => {
  const vehicle = store.getRow(tables.vehicles, id);
  delete vehicle.uuid;
  delete vehicle.id;

  const queries = createQueries(store);
  queries.setQueryDefinition('exportVehicle_records', tables.maintenance_records, ({ select, where }) => {
    for (const column of Object.keys(schema.maintenance_records).filter((col) => !['uuid', 'id', 'car_id'].includes(col))) {
      select(column);
    }
    where('car_id', id);
  });
  const final = JSON.stringify({
    ...vehicle,
    records: Object.values(queries.getResultTable('exportVehicle_records')),
  }, null, 4);

  queries.delQueryDefinition('exportVehicle_records');

  exportAsFile(final, 'export.json');
};
