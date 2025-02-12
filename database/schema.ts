export const schema = {
  "cars": {
    "make": { "type": "string" },
    "model": { "type": "string" },
    "year": { "type": "string" },
    "vin": { "type": "string" },
    "lpn": { "type": "string" },
    "nickname": { "type": "string" },
    "annual_usage": { "type": "string" },
    "created_at": { "type": "number" },
    "updated_at": { "type": "number" },
  },
  "car_maintainance_intervals": {
    "interval": { "type": "string" },
    "interval_unit": { "type": "string" },
    "car_id": { "type": "string" },
    "maintainance_type_id": { "type": "string"},
  },
  "maintainance_records": {
    "odometer": { "type": "string" },
    "notes": { "type": "string" },
    "cost": { "type": "string" },
    "created_at": { "type": "number" },
    "car_id": { "type": "string" },
    "maintainance_type_id": { "type": "string" },
  },
  "maintainance_types": {
    "name": { "type": "string" },
  },
  "permissions": {
    "car_id": { "type": "string" },
    "user_id": { "type": "string" },
  },
  "settings": {
    "distance_unit": { "type": "string", "default": "Miles" },
    "theme": { "type": "string", "default": "dark" },
  },
  "users": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "created_at": { "type": "number" },
    "updated_at": { "type": "number" },
  }
};

export const tables = {
  "cars": "cars",
  "car_maintainance_intervals": "car_maintainance_intervals",
  "maintainance_records": "maintainance_records",
  "maintainance_types": "maintainance_types",
  "permissions": "permissions",
  "settings": "settings",
  "users": "users",
  "_schema_version": "_schema_version",
}