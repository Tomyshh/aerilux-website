import { createClient } from '@supabase/supabase-js'

// Variables d'environnement Supabase
// Fallback vers les valeurs du projet aerilux (uceyszidppfmaswwxfbe)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
  || 'https://uceyszidppfmaswwxfbe.supabase.co'

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY 
  || 'sb_publishable_BjNRun294u_Fi-UxY28sTQ_ZPohuhjt'

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
// Note: Cette fonction ne lance JAMAIS d'erreur pour ne pas bloquer l'envoi via Firebase
export const addContactLeadToSupabase = async (
  lead: Omit<ContactLead, 'id' | 'created_at' | 'status'>
): Promise<ContactLead | null> => {
  // Wrapper pour garantir qu'aucune erreur ne s'échappe
  return new Promise((resolve) => {
    (async () => {
      try {
        console.log('Supabase: Tentative d\'insertion...', { url: supabaseUrl, lead })
        
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
          console.error('Supabase ERROR:', error.code, error.message, error.details, error.hint)
          resolve(null)
          return
        }

        console.log('Lead ajouté avec succès dans Supabase:', data)
        resolve(data)
      } catch (error: any) {
        // Gérer silencieusement les erreurs réseau
        console.error('Supabase CATCH:', error?.message || error, error)
        resolve(null)
      }
    })()
  })
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