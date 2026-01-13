import { createClient } from '@supabase/supabase-js'

// Variables d'environnement Supabase
// Note: Pour Create React App, utilisez aussi REACT_APP_SUPABASE_URL si nécessaire
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
  || process.env.REACT_APP_SUPABASE_URL 
  || 'https://gfmyxculwaiqcjnjsghc.supabase.co'

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY 
  || process.env.REACT_APP_SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbXl4Y3Vsd2FpcWNqbmpzZ2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzI5NzgsImV4cCI6MjA2NDkwODk3OH0.kYY0LKj_IE7f6xy5xYyY97tFOFk9d1x8JsM6NdnXicw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface ContactLead {
  id?: number
  name: string
  email: string
  subject: string
  message: string
  status?: 'new' | 'read' | 'replied'
  created_at?: string
  source?: string
}

// Fonction pour ajouter un lead de contact dans Supabase
export const addContactLeadToSupabase = async (
  lead: Omit<ContactLead, 'id' | 'created_at' | 'status'>
): Promise<ContactLead | null> => {
  try {
    const { data, error } = await supabase
      .from('contact_leads')
      .insert([
        {
          name: lead.name,
          email: lead.email,
          subject: lead.subject,
          message: lead.message,
          status: 'new',
          source: 'website'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase lors de l\'ajout du lead:', error)
      throw error
    }

    console.log('Lead ajouté avec succès dans Supabase:', data)
    return data
  } catch (error) {
    console.error('Erreur lors de l\'ajout du lead dans Supabase:', error)
    throw error
  }
}

// Fonction pour récupérer tous les leads de contact
export const getContactLeadsFromSupabase = async (
  limitCount: number = 50
): Promise<ContactLead[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount)

    if (error) {
      console.error('Erreur Supabase lors de la récupération des leads:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erreur lors de la récupération des leads:', error)
    return []
  }
}

// Legacy interface pour compatibilité
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