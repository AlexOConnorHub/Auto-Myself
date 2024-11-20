import { synchronize } from '@nozbe/watermelondb/sync';
import schema from './schema';

//const schema = {
// cars: {
//   id: 'string',
//   nickname: 'string',
//   make: 'string',
//   model: 'string',
//   year: 'number',
//   vin: 'string',
//   lpn: 'string',
//   annual_usage: 'number',
// },
// // families: {
// //   id: 'string',
// //   name: 'string',
// // },
// maintainance_types: {
//   id: 'string',
//   name: 'string',
// },
// // families_users: {
// //   id: 'string',
// //   family_id: 'string',
// //   user_id: 'string',
// // },
// // cars_families: {
// //   id: 'string',
// //   car_id: 'string',
// //   family_id: 'string',
// // },
// car_maintainance_intervals: {
//   id: 'string',
//   car_id: 'string',
//   maintainance_type_id: 'string',
//   interval: 'number',
// },
// maintainance_records: {
//   id: 'string',
//   car_id: 'string',
//   maintainance_type_id: 'string',
//   cost: 'number',
//   notes: 'string',
//   odometer: 'number',
// },
//};

async function sync(supabase, database) {
  console.log('syncing...');
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log('pulling changes...', lastPulledAt);

//      start with a test, pull * from cars
      let { data, error } = await supabase.from('users').select('id');
//      let { data, error } = await supabase.from('users').insert([{ first_name: 'Hello', last_name: 'World' }]);
      console.log(JSON.stringify(data));
      console.log(JSON.stringify(error));

      throw new Error('Caused failure');

      let last_pulled_at_pg = new Date(lastPulledAt);
      let transaction_time_pg = new Date();
      let transaction_time = transaction_time_pg.getTime();
      let final = { timestamp: transaction_time, changes: {} };

      console.log(`There are ${Object.keys(schema.tables).length} tables to sync`);
      for (let table_name of Object.keys(schema.tables)) {
        let table = schema.tables[table_name];
        let created = [];
        let updated = [];
        let deleted = [];
        if (lastPulledAt === null) {
          created = await supabase.from(table_name).select('*');
        } else {
          created = await supabase.from(table_name).select('*').gt('created_at', lastPulledAt);
          updated = await supabase.from(table_name).select('*').lte('created_at', lastPulledAt).gt('updated_at', lastPulledAt);
          deleted = await supabase.from(deleted).select('source_id').gt('deleted_at', lastPulledAt).eq('source_table', table_name);
        }
        final.changes[table_name] = {
          created: created,
          updated: updated,
          deleted: deleted,
        };
      }

      return final;
  },
  pushChanges: async ({ changes, lastPulledAt }) => {
    // console.log('pushing changes...', JSON.stringify(changes), lastPulledAt);
    console.log('pushing changes...', lastPulledAt);
//      const { data, error } = await supabase.rpc('wdb_sync_receive', {
//        last_pulled_at: lastPulledAt,
//        changes: changes,
//      })
/**
  let last_pulled_at_pg = plv8.execute("SELECT to_timestamp($1::double precision / 1000) t", last_pulled_at)[0].t;
  let transaction_time = Date.now();
  let transaction_time_pg = plv8.execute("SELECT to_timestamp($1::double precision / 1000) t", transaction_time)[0].t;
  let final = {};
  let schema = plv8.find_function('private_functions.wdb_sync_schema')(0);
  let queries = [];
  let errors = [];

  // Takes the row form the user and makes sure only fields in the DB are passed (as defined by wdb_sync_Schema)
  let processRow = (row, table) => {
    final = {};
    for (let field of Object.keys(table)) {
      if (row[field] === undefined) {
        continue;
      } else if (row[field] === '') {
        final[field] = undefined;
      } else if (table[field] === 'number') {
        final[field] = Number(row[field]);
      } else if (table[field] === 'string') {
        final[field] = `${row[field]}`;
      }
    }
    return final;
  };

  // Takes row from user and generates SQL query for storing in DB


  for (let table of Object.keys(schema)) {
    let created = changes[table].created;
    let updated = changes[table].updated;
    let deleted = changes[table].deleted;
    for (let row of created) {
      queries.push(generateQuery(table, row, true));
    }

    for (let row of updated) {
      queries.push(generateQuery(table, row, false));
    }

    for (let row of deleted) {
      queries.push([`UPDATE ${table} SET deleted_at = $1 WHERE id = $2`, [transaction_time_pg, row]]);
    }
  }
  plv8.subtransaction(() => {
    for (let query of queries) {
      try {
        plv8.execute(query[0], query[1]);
      } catch (e) {
        errors.push(e);
      }
    }
  });

  let dupIds = plv8.execute(`SELECT STRING_AGG(id || '|' || created_at, ',') data FROM maintainance_types GROUP BY name HAVING COUNT(*) > 1`);
  let maintainanceTypesToMerge = dupIds.map((dupId) => {
      let pairs = dupId.data.split(',');
      let final = [];
      for (let i = 1; i < pairs.length; i++) {
        let items = pairs[i].split('|');
        final.push({
          id: items[0],
          createdAt: items[1],
        });
      }
      return final;
  });

  let toKeep = maintainanceTypesToMerge.reduce((a, b) => {
    return a.createdAt < b.createdAt ? a : b;
  }).id;
  let toMerge = maintainanceTypesToMerge.filter((x) => x.id !== toKeep).map((x) => x.id);

  for (let mergeId of toMerge) {
    plv8.execute("UPDATE maintainance_types SET deleted_at = (now() AT TIME ZONE 'utc'::text), updated_at = (now() AT TIME ZONE 'utc'::text) WHERE id = $1", [mergeId]);
    plv8.execute("INSERT INTO maintainance_type_mappings (from, to) VALUES ($1, $2)", [mergeId, toKeep]);
  }

  for (let table of ['maintainance_records', 'car_maintainance_intervals']) {
    plv8.execute(`UPDATE ${table} SET maintainance_type_id = M.to FROM maintainance_type_mappings M WHERE maintainance_type_id = M.from`);
  }

  final.debug =  {
    args: [
      last_pulled_at.toString(),
      changes,
    ],
    calculated: [
      last_pulled_at_pg,
      transaction_time_pg
    ],
    schema: schema,
    queries: queries,
    errors: errors,
    t: maintainanceTypesToMerge,
  };

  return final;
*/
//      console.log(JSON.stringify(data));
//      console.log(JSON.stringify(error));
       throw new Error('Caused failure')
    },
    migrationsEnabledAtVersion: 1,
  })
}

export { sync };
