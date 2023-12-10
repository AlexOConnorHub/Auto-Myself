import { Model } from '@nozbe/watermelondb';
import { text, date, relation, writer } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class MaintainanceRecord extends Model {
  static table = tables.maintainance_records;
  static associations = {
    [tables.cars]: { type: 'belongs_to', key: 'car_id' },
    [tables.maintainance_types]: { type: 'belongs_to', key: 'maintainance_type_id' },
  };
  @date('created_at') createdAt;
  @text('odometer') odometer;
  @text('cost') cost;
  @text('notes') notes;
  @relation(tables.cars, 'car_id') car;
  @relation(tables.maintainance_types, 'maintainance_type_id') maintainanceType;

  @writer async updateRecord(newRecord) {
    return await this.update((record) => {
      for (const key in newRecord) {
        record[key] = newRecord[key];
      }
    });
  }

  @writer async deleteRecord() {
    return await this.destroyPermanently(); // TODO: Make sure to not actually delete if synced
  }

  humanDate() {
    return this.createdAt.toLocaleDateString();
  }
}
