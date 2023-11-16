import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './schema';
import migrations from './migrations';
import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId/index';
import 'react-native-get-random-values' // Polyfill for uuid v4
import { v4 as uuidv4 } from 'uuid';
import Car from '../models/car';
import CarMaintainanceInterval from '../models/carMaintainanceInterval';
import Family from '../models/family';
import FamilyMember from '../models/familyMember';
import MaintainanceRecord from '../models/maintainanceRecord';
import MaintainanceType from '../models/maintainanceType';
import Owner from '../models/owner';
import User from '../models/user';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'mycars',
  jsi: true,
  onSetUpError: error => { console.log(error); },
});

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
