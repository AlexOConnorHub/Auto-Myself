export const schema = {
  "schema_version": {
    "version": { "type": "number" },
  },
  "cars": {
    "make": { "type": "string" },
    "make_id": { "type": "number" },
    "model": { "type": "string" },
    "model_id": { "type": "number" },
    "year": { "type": "string" },
    "vin": { "type": "string" },
    "lpn": { "type": "string" },
    "nickname": { "type": "string" },
    "annual_usage": { "type": "string" },
    "created_at": { "type": "number" },
    "updated_at": { "type": "number" },
    "notes": { "type": "string" },
  },
  "car_maintenance_intervals": {
    "interval": { "type": "string" },
    "interval_unit": { "type": "string" },
    "car_id": { "type": "string" },
    "maintenance_type_id": { "type": "string"},
  },
  "maintenance_records": {
    "odometer": { "type": "string" },
    "notes": { "type": "string" },
    "cost": { "type": "string" },
    "created_at": { "type": "number" },
    "car_id": { "type": "string" },
    "maintenance_type_id": { "type": "string" },
  },
  "maintenance_types": {
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
  "car_maintenance_intervals": "car_maintenance_intervals",
  "maintenance_records": "maintenance_records",
  "maintenance_types": "maintenance_types",
  "permissions": "permissions",
  "settings": "settings",
  "users": "users",
  "schema_version": "schema_version",
}
