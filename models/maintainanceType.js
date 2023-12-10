import { Model, Q } from '@nozbe/watermelondb';
import { text, children, writer, lazy } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class MaintainanceType extends Model {
  static table = tables.maintainance_types;
  static associations = {
    [tables.car_maintainance_intervals]: { type: 'has_many', foreignKey: 'maintainance_type_id' },
    [tables.maintainance_records]: { type: 'has_many', foreignKey: 'maintainance_type_id' },
  };
  @text('name') name;
  // @field('description') description;
  @children(tables.car_maintainance_intervals) carMaintainanceIntervals;
  @children(tables.maintainance_records) maintainanceRecords;

  @writer async updateRecord(newRecord) {
    return await this.update((record) => {
      for (const key in newRecord) {
        // TODO: If id fields used in future, support here
        record[key] = newRecord[key];
      }
    });
  }

  @writer async ensureCarMaintainanceInterval(carId, maintainanceIntervalId, maintainanceInterval, isWeeks) {
    if (!maintainanceIntervalId) {
      return await this.collections.get(tables.car_maintainance_intervals).create((record) => {
        if (isWeeks) {
          record.weeksBetween = maintainanceInterval;
          record.milesBetween = null;
        } else {
          record.weeksBetween = null;
          record.milesBetween = maintainanceInterval;
        }
        record._setRaw('car_id', carId);
        record._setRaw('maintainance_type_id', this.id);
      });
    } else {
      let databaseRecord = await this.collections.get(tables.car_maintainance_intervals).find(maintainanceIntervalId);
      if (carId && databaseRecord.car.id !== carId) {
        return null;
      }
      if (maintainanceIntervalId && databaseRecord.maintainanceType.id !== this.id) {
        return null;
      }
      return await databaseRecord.update((record) => {
        if (isWeeks) {
          record.weeksBetween = maintainanceInterval;
          record.milesBetween = null;
        } else {
          record.weeksBetween = null;
          record.milesBetween = maintainanceInterval;
        }
      });
    }
  }

  @writer async createMaintainanceRecord(data) {
    return await this.collections.get(tables.maintainance_records).create((record) => {
      record.odometer = data.odometer;
      record.cost = data.cost;
      record.notes = data.notes;
      record._setRaw('car_id', data.carId);
      record._setRaw('maintainance_type_id', this.id);
    });
  }

  /* pass carID, and return carMaintainanceInterval */
  async carMaintainanceInterval(carId) {
    let res = await this.collections.get(tables.car_maintainance_intervals).query(
      Q.where('car_id', carId),
      Q.where('maintainance_type_id', this.id),
    ).fetch();
    return res[0];
  }

  @writer async deleteRecord() {
    return await this.destroyPermanently(); // TODO: Make sure to not actually delete if synced
  }
}
