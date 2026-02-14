import { tables } from '@app/database/schema';
import { createIndexes, Store } from 'tinybase';
import { exportAsFile } from './fileExport';

export const exportVehicle = (store: Store, id: string) => {
  const vehicle = store.getRow(tables.vehicles, id);
  delete vehicle.uuid;
  delete vehicle.id;

  const indexes = createIndexes(store);
  const records = indexes.getSliceRowIds('byVehicle', id).map((recordId) => {
    const record = store.getRow(tables.maintenance_records, recordId);
    delete record.uuid;
    delete record.id;
    delete record.car_id;
    return record;
  });

  const final = JSON.stringify({
    ...vehicle,
    records,
  }, null, 4);

  exportAsFile(final, 'export.json', { mimeType: 'application/json', dialogTitle: `Export ${vehicle.name}` });
};
