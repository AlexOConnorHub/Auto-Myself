import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class Owner extends Model {
  static table = 'owners';
  static associations = {
    car: { type: 'belongs_to', key: 'car_id' },
    user: { type: 'belongs_to', key: 'user_id' },
    family: { type: 'belongs_to', key: 'family_id' },
  };

  @children('car') car;
  @children('user') user;
  @children('family') family;
}

export { Owner };
