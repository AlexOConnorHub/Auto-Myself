import { Model } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class FamilyMember extends Model {
  static table = tables.family_members;
  static associations = {
    [tables.families]: { type: 'belongs_to', key: 'family_id' },
    [tables.users]: { type: 'belongs_to', key: 'user_id' },
  };
  @relation(tables.families, 'family_id') family;
  @relation(tables.users, 'user_id') user;
}
