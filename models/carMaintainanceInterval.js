import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class CarMaintainanceInterval extends Model {
  static table = 'car_maintainance_intervals';
  static associations = {
    car: { type: 'belongs_to', key: 'car_id' },
    maintainanceType: { type: 'belongs_to', key: 'maintainance_type_id' },
  };

  @field('miles_between') milesBetween;
  @field('weeks_between') weeksBetween;

  @children('car') car;
  @children('maintainanceType') maintainanceType;
}

export { CarMaintainanceInterval };
