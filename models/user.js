import { Model } from '@nozbe/watermelondb';
import { text, date, children, writer } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class User extends Model {
  static table = tables.users;
  static associations = {
    [tables.owners]: { type: 'has_many', foreignKey: 'user_id' },
    [tables.family_members]: { type: 'has_many', foreignKey: 'user_id' },
  };
  static distance_unit_options = [
    { label: 'Miles', value: 'mi' },
    { label: 'Kilometers', value: 'km' },
  ];
  @text('first_name') first_name;
  @text('last_name') last_name;
  // @field('email') email;
  // @field('phone_number') phoneNumber;
  // @field('is_logged_in') isLoggedIn;
  @text('distance_unit') distance_unit;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;
  @children(tables.owners) owners;
  @children(tables.family_members) familyMembers;

  get name() {
    return `${this.first_name} ${this.last_name}`;
  }
  @writer async setDistanceUnit(unit) {
    this.update((user) => {
      user.distance_unit = unit;
    });
  }
}
