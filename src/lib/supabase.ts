import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Running with safe mock client for preview.'
  );
}

const mockClient = {
  from: (_table: string) => ({
    insert: async (_data: any) => {
      console.log(`[Supabase Mock] Insert into ${_table}:`, _data);
      return { data: null, error: null };
    },
    select: async () => ({ data: [], error: null }),
  }),
  rpc: async (_fn: string, _args: any) => {
    console.log(`[Supabase Mock] RPC ${_fn}:`, _args);
    return { data: 'EU-SWE-VAST-PREVIEW', error: null };
  },
};

export const supabase: any = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : mockClient;

