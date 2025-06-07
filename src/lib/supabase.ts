import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfmyxculwaiqcjnjsghc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbXl4Y3Vsd2FpcWNqbmpzZ2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzI5NzgsImV4cCI6MjA2NDkwODk3OH0.kYY0LKj_IE7f6xy5xYyY97tFOFk9d1x8JsM6NdnXicw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface ContactMessage {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  status?: string
  received_at?: string
  contact_id?: string
} 