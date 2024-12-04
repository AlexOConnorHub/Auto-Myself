const tables = {
  cars: {
    table_name: 'cars',
    columns: {
      id: 'string',
      make: 'string',
      model: 'string',
      year: 'number',
      vin: 'string',
      lpn: 'string',
    },
  }
  users: {
    table_name: 'users',
    columns: {
      id: 'string',
      name: 'string',
    },
  },
  permissions: {
    table_name: 'permissions',
    columns: {
      id: 'string',
      name: 'string',
    },
  },
  maintainance_types: 'maintainance_types',
  family_members: 'family_members',
  owners: 'owners',
  car_maintainance_intervals: 'car_maintainance_intervals',
  maintainance_records: 'maintainance_records',
};

export { tables };
