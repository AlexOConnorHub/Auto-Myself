import { Model } from '@nozbe/watermelondb';
import { field, date, relation, readonly } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class MaintainanceRecord extends Model {
  static table = tables.maintainance_records;
  static associations = {
    car: { type: 'belongs_to', key: 'car_id' },
    maintainanceType: { type: 'belongs_to', key: 'maintainance_type_id' },
  };
  @date('created_at') date;
  @field('odometer') mileage;
  @field('cost') cost;
  @field('notes') notes;
  @readonly @field('created_at') createdAt;
  @relation(tables.cars, 'car_id') car;
  @relation(tables.maintainance_types, 'maintainance_type_id') maintainanceType;
}
