const usersSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
            minLength: 36
        },
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        created_at: {
            type: 'number'
        },
        updated_at: {
            type: 'number'
        }
    },
    required: ['id', 'first_name', 'last_name', 'created_at', 'updated_at']
}

const carsSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
            minLength: 36
        },
        make: {
            type: 'string'
        },
        model: {
            type: 'string'
        },
        year: {
            type: 'string'
        },
        vin: {
            type: 'string'
        },
        lpn: {
            type: 'string'
        },
        nickname: {
            type: 'string'
        },
        annual_usage: {
            type: 'string'
        },
        created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string'
        }
    },
    required: ['id', 'make', 'model', 'created_at', 'updated_at']
}

const maintainanceTypesSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
            minLength: 36
        },
        name: {
            type: 'string'
        },
        created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string'
        },
    },
    required: ['id', 'name'],
}

const permissionsSchema = {
  version: 0,
  type: 'object',
  properties: {
    car_id: {
      type: 'string',
      maxLength: 36
      minLength: 36
    },
    user_id: {
      type: 'string',
      maxLength: 36
      minLength: 36
    },
    write: {
      type: 'boolean'
    },
    share: {
      type: 'boolean'
    },
    created_at: {
      type: 'string'
    },
    updated_at: {
      type: 'string'
    }
  },
  required: ['id', 'name']
}
const ownersSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
            minLength: 36
        },
        created_at: {
            type: 'number'
        },
        car_id: {
            type: 'string'
        },
        user_id: {
            type: 'string'
        },
        family_id: {
            type: 'string'
        }
    },
    required: ['id', 'created_at', 'car_id']
}

const carMaintainanceIntervalsSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
            minLength: 36
        },
        interval: {
            type: 'string'
        },
        interval_unit: {
            type: 'string'
        },
        car_id: {
            type: 'string'
        },
        maintainance_type_id: {
            type: 'string'
        }
    },
    required: ['id', 'interval', 'interval_unit', 'car_id', 'maintainance_type_id']
}

const maintainanceRecordsSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 36
            minLength: 36
        },
        odometer: {
            type: 'string'
        },
        notes: {
            type: 'string'
        },
        cost: {
            type: 'string'
        },
        created_at: {
            type: 'number'
        },
        car_id: {
            type: 'string'
        },
        maintainance_type_id: {
            type: 'string'
        }
    },
    required: ['id', 'created_at', 'car_id', 'maintainance_type_id']
}



