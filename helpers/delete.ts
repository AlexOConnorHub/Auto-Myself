import { tables } from '@app/database/schema';
import { Directory, File, Paths } from 'expo-file-system';
import { createQueries } from 'tinybase';

export const deleteRecord = (store, recordId: string) => {
  const row = store.getRow(tables.maintenance_records, recordId);
  if (!row) {
    return;
  }

  const queries = createQueries(store);
  queries.setQueryDefinition('files_for_record_id', tables.files, ({ select, where }) => {
    select('related_table');
    where('related_id', recordId);
    where('related_table', tables.maintenance_records);
  });
  const fileRows = queries.getResultTable('files_for_record_id');
  Object.keys(fileRows).forEach((fileKey) => {
    const file = new File(Paths.document, `${row.car_id}/${recordId}/${fileKey}.jpg`);
    if (file.exists) {
      file.delete();
    }
    store.delRow(tables.files, fileKey);
  });
  queries.delQueryDefinition('files_for_record_id');
  queries.destroy();
  const dir = new Directory(Paths.document, `${row.car_id}/${recordId}`);
  if (dir.exists) {
    dir.delete();
  }

  store.delRow(tables.maintenance_records, recordId);
};
