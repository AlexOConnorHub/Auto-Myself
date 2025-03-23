import { supabase } from '../helpers/supabase';

export const sync = async () => {
  const { data, error } = await supabase.rpc('test', {
    arg: 3
  });
  // await synchronize({
  //   database,
  //   pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
  //     const { data, error } = supabase.rpc('pull', {
  //       last_pulled_at: lastPulledAt,
  //       schema_version: schemaVersion,
  //       migration: migration,
  //     })
  //     console.log(data);
  //     console.log(error);
  //     // const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
  //     //   JSON.stringify(migration),
  //     // )}`
  //     // console.log('syncing...', urlParams);
  //     // const response = await fetch(`https://my.backend/sync?${urlParams}`)
  //     // if (!response.ok) {
  //       throw new Error('Caused failure')
  //     // }

  //     // const { changes, timestamp } = await response.json()
  //     // return { changes, timestamp }
  //   },
  //   pushChanges: async ({ changes, lastPulledAt }) => {
  //     console.log('pushing changes...', JSON.stringify(changes));
  //     // const response = await fetch(`https://my.backend/sync?last_pulled_at=${lastPulledAt}`, {
  //     //   method: 'POST',
  //     //   body: JSON.stringify(changes),
  //     // })
  //     // if (!response.ok) {
  //       throw new Error('Caused failure')
  //     // }
  //   },
  //   migrationsEnabledAtVersion: 1,
  // })
}
