import { Model } from '@nozbe/watermelondb';
import { text, children } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class MaintainanceType extends Model {
  static table = tables.maintainance_types;
  static associations = {
    carMaintainanceIntervals: { type: 'has_many', foreignKey: 'maintainance_type_id' },
    maintainanceRecords: { type: 'has_many', foreignKey: 'maintainance_type_id' },
  };
  @text('name') name;
  // @field('description') description;
  @children(tables.car_maintainance_intervals) carMaintainanceIntervals;
  @children(tables.maintainance_records) maintainanceRecords;
}
