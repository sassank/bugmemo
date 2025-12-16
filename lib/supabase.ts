import { createClient } from '@supabase/supabase-js'

// Assurez-vous que .env.local est configuré
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
