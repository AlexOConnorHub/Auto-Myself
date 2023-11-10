import { Model } from '@nozbe/watermelondb';
import { text, date, children } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class User extends Model {
  static table = tables.users;
  static associations = {
    owners: { type: 'has_many', foreignKey: 'user_id' },
    familyMembers: { type: 'has_many', foreignKey: 'user_id' },
  };
  @text('first_name') first_name;
  @text('last_name') last_name;
  // @field('email') email;
  // @field('phone_number') phoneNumber;
  // @field('is_logged_in') isLoggedIn;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;
  @children(tables.owners) owners;
  @children(tables.family_members) familyMembers;

  get name() {
    return `${this.first_name} ${this.last_name}`;
  }
}
