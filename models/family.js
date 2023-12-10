import { Model } from '@nozbe/watermelondb';
import { children } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class Family extends Model {
  static table = tables.families;
  static associations = {
    [tables.family_members]: { type: 'has_many', foreignKey: 'family_id' },
  };
  @children(tables.family_members) familyMember;
}
