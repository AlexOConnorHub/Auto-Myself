import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class MaintainanceType extends Model {
  static table = 'maintainance_types';
  static associations = {
    carMaintainanceIntervals: { type: 'has_many', foreignKey: 'maintainance_type_id' },
    maintainanceRecords: { type: 'has_many', foreignKey: 'maintainance_type_id' },
  };

  @field('name') name;
  // @field('description') description;

  @children('carMaintainanceIntervals') carMaintainanceIntervals;
  @children('maintainanceRecords') maintainanceRecords;
}

export { MaintainanceType };
