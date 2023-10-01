import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Schema } from './schema.js';
import { Migrations } from './migrations.js';

const adapter = new SQLiteAdapter({
  Schema,
  Migrations,
  dbName: 'mycars',
  jsi: (Platform.OS === 'ios'),
  onSetUpError: error => {
    console.log(error);
  }
});

import { Car } from '../models/car.js';
import { CarMaintainanceInterval } from '../models/carMaintainanceInterval.js';
import { Family } from '../models/family.js';
import { FamilyMember } from '../models/familyMember.js';
import { MaintainanceRecord } from '../models/maintainanceRecord.js';
import { MaintainanceType } from '../models/maintainanceType.js';
import { Owner } from '../models/owner.js';
import { User } from '../models/user.js';

const database = new Database({
  adapter,
  modelClasses: [
    Car,
    CarMaintainanceInterval,
    Family,
    FamilyMember,
    MaintainanceRecord,
    MaintainanceType,
    Owner,
    User,
  ],
});

export { database, adapter };
