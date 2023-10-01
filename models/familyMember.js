import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class FamilyMember extends Model {
  static table = 'family_members';
  static associations = {
    family: { type: 'belongs_to', key: 'family_id' },
    user: { type: 'belongs_to', key: 'user_id' },
  };

  @children('family') family;
  @children('user') user;
}

export { FamilyMember };
