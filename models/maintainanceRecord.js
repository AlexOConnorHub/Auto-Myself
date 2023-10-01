import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class MaintainanceRecord extends Model {
  static table = 'maintainance_records';
  static associations = {
    car: { type: 'belongs_to', key: 'car_id' },
    maintainance_type: { type: 'belongs_to', key: 'maintainance_type_id' },
  };

  @field('created_at') date;
  @field('odometer') mileage;
  @field('cost') cost;
  @field('notes') notes;

  @children('car') car;
  @children('maintainance_type') maintainance_type;
}

export { MaintainanceRecord };
