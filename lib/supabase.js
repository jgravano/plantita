import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

// Si no están las variables de entorno, creamos un cliente dummy
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Database features will be disabled.');
  // Crear un cliente dummy que no haga nada
  supabase = {
    from: () => ({
      insert: () => Promise.resolve({ data: null, error: null }),
      select: () => Promise.resolve({ data: null, error: null }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
