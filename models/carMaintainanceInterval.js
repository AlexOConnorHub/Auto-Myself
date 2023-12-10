import { Model } from '@nozbe/watermelondb';
import { field, lazy, relation, writer } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class CarMaintainanceInterval extends Model {
  static table = tables.car_maintainance_intervals;
  static associations = {
    [tables.cars]: { type: 'belongs_to', key: 'car_id' },
    [tables.maintainance_types]: { type: 'belongs_to', key: 'maintainance_type_id' },
  };
  @field('miles_between') milesBetween;
  @field('weeks_between') weeksBetween;
  @relation(tables.cars, 'car_id') car;
  @relation(tables.maintainance_types, 'maintainance_type_id') maintainanceType;

  @writer async updateRecord(newRecord) {
    return await this.update((record) => {
      record.milesBetween = newRecord.milesBetween;
      record.weeksBetween = newRecord.weeksBetween;
    });
  }

  @writer async deleteRecord() {
    return await this.destroyPermanently(); // TODO: Make sure to not actually delete if synced
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

  frequency = this.milesBetween ? this.milesBetween : this.weeksBetween;
  frequencyType = this.milesBetween ? 'miles' : this.weeksBetween ? 'weeks' : '';
}
