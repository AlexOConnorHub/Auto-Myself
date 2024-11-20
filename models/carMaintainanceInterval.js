import { Model } from '@nozbe/watermelondb';
import { field, relation, writer } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';
import { kvStorage } from '../helpers/kvStorage';

export default class CarMaintainanceInterval extends Model {
  static table = tables.car_maintainance_intervals;
  static associations = {
    [tables.cars]: { type: 'belongs_to', key: 'car_id' },
    [tables.maintainance_types]: { type: 'belongs_to', key: 'maintainance_type_id' },
  };
  @field('interval') interval;
  @field('interval_unit') intervalUnit;
  @relation(tables.cars, 'car_id') car;
  @relation(tables.maintainance_types, 'maintainance_type_id') maintainanceType;

  @writer async updateRecord(newRecord) {
    return await this.update((record) => {
      record.interval = this.convertIntervalForStorage(newRecord.interval);
      record.intervalUnit = newRecord.intervalUnit;
    });
  }
  @writer async deleteRecord() {
    return await this.markAsDeleted();
  }
  @writer async setCar(carId) {
    return await this.update((record) => {
      record.car.id = carId;
    });
  }
  @writer async setMaintainanceType(maintainanceTypeId) {
    return await this.update((record) => {
      record.maintainanceType.id = maintainanceTypeId;
    });
  }
}
