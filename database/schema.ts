export const schema = {
  'schema_version': {
    'version': { 'type': 'number' },
  },
  'cars': {
    'make': { 'type': 'string' },
    'make_id': { 'type': 'number' },
    'model': { 'type': 'string' },
    'model_id': { 'type': 'number' },
    'year': { 'type': 'string' },
    'color': { 'type': 'string' },
    'vin': { 'type': 'string' },
    'lpn': { 'type': 'string' },
    'nickname': { 'type': 'string' },
    'annual_usage': { 'type': 'string' },
    'created_at': { 'type': 'number' },
    'updated_at': { 'type': 'number' },
    'notes': { 'type': 'string' },
  },
  'maintenance_records': {
    'odometer': { 'type': 'string' },
    'notes': { 'type': 'string' },
    'cost': { 'type': 'string' },
    'created_at': { 'type': 'number' },
    'car_id': { 'type': 'string' },
    'type': { 'type': 'string' },
    'interval': { 'type': 'number' },
    'interval_unit': { 'type': 'string' },
    'date': { 'type': 'string' },
  },
  'settings': {
    'distance_unit': { 'type': 'string', 'default': 'Miles' },
    'theme': { 'type': 'string', 'default': 'dark' },
    'analyticsEnabled': { 'type': 'string', 'default': 'disabled' },
  },
  'files': {
    'local_path': { 'type': 'string' },
    'related_table': { 'type': 'string' },
    'related_id': { 'type': 'string' },
  },
  // 'users': {
  //   'name': { 'type': 'string' },
  //   'created_at': { 'type': 'number' },
  //   'updated_at': { 'type': 'number' },
  // },
};

export const tables = {
  'vehicles': 'cars',
  'maintenance_records': 'maintenance_records',
  // 'permissions': 'permissions',
  'settings': 'settings',
  // 'users': 'users',
  'schema_version': 'schema_version',
  'files': 'files',
};
