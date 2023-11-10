import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './schema.js';
import migrations from './migrations.js';
import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId/index.js';
import 'react-native-get-random-values' // Polyfill for uuid v4
import { v4 as uuidv4 } from 'uuid';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'mycars',
  jsi: true,
  onSetUpError: error => { console.log(error); },
});

import Car from '../models/car.js';
import CarMaintainanceInterval from '../models/carMaintainanceInterval.js';
import Family from '../models/family.js';
import FamilyMember from '../models/familyMember.js';
import MaintainanceRecord from '../models/maintainanceRecord.js';
import MaintainanceType from '../models/maintainanceType.js';
import Owner from '../models/owner.js';
import User from '../models/user.js';

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

setGenerator(() => uuidv4());

export { database, adapter };
