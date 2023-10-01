import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class User extends Model {
  static table = 'users';
  static associations = {
    owners: { type: 'has_many', foreignKey: 'user_id' },
    familyMembers: { type: 'has_many', foreignKey: 'user_id' },
  };

  @field('first_name') first_name;
  @field('last_name') last_name;
  // @field('email') email;
  // @field('phone_number') phoneNumber;
  // @field('is_logged_in') isLoggedIn;
  @field('created_at') createdAt;
  @field('updated_at') updatedAt;

  @children('owners') owners;
  @children('familyMembers') familyMembers;

  get name() {
    return `${this.first_name} ${this.last_name}`;
  }
}

export { User };
