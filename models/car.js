import { Model, Q } from '@nozbe/watermelondb';
import { date, text, children, writer } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class Car extends Model {
  static table = tables.cars;
  static associations = {
    [tables.car_maintainance_intervals]: { type: 'has_many', foreignKey: 'car_id' },
    [tables.maintainance_records]: { type: 'has_many', foreignKey: 'car_id' },
    [tables.owners]: { type: 'has_many', foreignKey: 'car_id' },
  };
  @text('make') make;
  @text('model') model;
  @text('year') year;
  @text('vin') vin;
  @text('lpn') lpn;
  @text('nickname') nickname;
  @text('annual_usage') annualUsage;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;
  @children(tables.car_maintainance_intervals) carMaintainanceIntervals;
  @children(tables.maintainance_records) maintainanceRecords;
  @children(tables.owners) owners;

  @writer async updateRecord(newRecord) {
    return await this.update((car) => {
      for (const key in newRecord) {
        car[key] = newRecord[key];
      }
    });
  }

  @writer async deleteRecord() {
    return await this.destroyPermanently(); // TODO: Make sure to not actually delete if synced
  }
}
