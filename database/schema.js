import { appSchema, tableSchema } from '@nozbe/watermelondb'
import { tables } from './tables';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: tables.cars,
      columns: [
        { name: 'make', type: 'string' },
        { name: 'model', type: 'string' },
        { name: 'year', type: 'string', isOptional: true },
        { name: 'vin', type: 'string', isOptional: true },
        { name: 'lpn', type: 'string', isOptional: true },
        { name: 'nickname', type: 'string', isOptional: true },
        { name: 'annual_mileage', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: tables.users,
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: tables.families,
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: tables.maintainance_types,
      columns: [
        { name: 'name', type: 'string' },
      ]
    }),
    tableSchema({
      name: tables.family_members,
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'family_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: tables.owners,
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'car_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'family_id', type: 'string', isIndexed: true, isOptional: true },
      ]
    }),
    tableSchema({
      name: tables.car_maintainance_intervals,
      columns: [
        { name: 'interval', type: 'string', isOptional: true },
        { name: 'interval_unit', type: 'string', isOptional: true },
        { name: 'car_id', type: 'string', isIndexed: true },
        { name: 'maintainance_type_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: tables.maintainance_records,
      columns: [
        { name: 'odometer', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'cost', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'car_id', type: 'string', isIndexed: true },
        { name: 'maintainance_type_id', type: 'string', isIndexed: true },
      ]
    }),
  ]
});
