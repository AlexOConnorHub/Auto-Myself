import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from "../secrets/supabase-config";

const supabase = createClient(supabaseConfig.url, supabaseConfig.apiKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: supabaseConfig.schema,
  },
});

export { supabase };
