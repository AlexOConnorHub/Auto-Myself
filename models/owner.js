import { Model } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class Owner extends Model {
  static table = tables.owners;
  static associations = {
    car: { type: 'belongs_to', key: 'car_id' },
    user: { type: 'belongs_to', key: 'user_id' },
    family: { type: 'belongs_to', key: 'family_id' },
  };
  @relation(tables.cars, 'car_id') car;
  @relation(tables.users, 'user_id') user;
  @relation(tables.families, 'family_id') family;
}
