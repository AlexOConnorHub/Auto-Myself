import { appSchema, tableSchema } from '@nozbe/watermelondb'

const Schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'cars',
      columns: [
        { name: 'make', type: 'string' },
        { name: 'model', type: 'string' },
        { name: 'year', type: 'number', isOptional: true },
        { name: 'vin', type: 'string', isOptional: true },
        { name: 'lpn', type: 'string', isOptional: true },
        { name: 'nickname', type: 'string', isOptional: true },
        { name: 'annual_mileage', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'families',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'maintainance_types',
      columns: [
        { name: 'name', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'family_members',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'family_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: 'owners',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'car_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'family_id', type: 'string', isIndexed: true, isOptional: true },
      ]
    }),
    tableSchema({
      name: 'car_maintainance_intervals',
      columns: [
        { name: 'miles_between', type: 'number', isOptional: true },
        { name: 'weeks_between', type: 'string', isOptional: true },
        { name: 'car_id', type: 'string', isIndexed: true },
        { name: 'maintainance_type_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: 'maintainance_records',
      columns: [
        { name: 'odometer', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'cost', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'car_id', type: 'string', isIndexed: true },
        { name: 'maintainance_type_id', type: 'string', isIndexed: true },
      ]
    }),
  ]
});

export { Schema };
