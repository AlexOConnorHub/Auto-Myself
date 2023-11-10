import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class CarMaintainanceInterval extends Model {
  static table = tables.car_maintainance_intervals;
  static associations = {
    car: { type: 'belongs_to', key: 'car_id' },
    maintainanceType: { type: 'belongs_to', key: 'maintainance_type_id' },
  };
  @field('miles_between') milesBetween;
  @field('weeks_between') weeksBetween;
  @children(tables.cars) car;
  @children(tables.maintainance_types) maintainanceType;
}
