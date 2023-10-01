import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class Family extends Model {
  static table = 'families';
  static associations = {
    familyMembers: { type: 'has_many', foreignKey: 'family_id' },
    cars: { type: 'has_many', foreignKey: 'family_id' },
  };

  @children('familyMembers') familyMembers;
  @children('cars') cars;
}

export { Family };
