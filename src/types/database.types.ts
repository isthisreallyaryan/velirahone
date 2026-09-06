export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          pseudonym: string
          real_name: string | null
          location: string | null
          is_kyc_verified: boolean
          // pgvector representation on the client is typically an array or formatted string
          ideological_vector: number[] | null 
          fact_check_tokens: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          pseudonym: string
          real_name?: string | null
          location?: string | null
          is_kyc_verified?: boolean
          ideological_vector?: number[] | null
          fact_check_tokens?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pseudonym?: string
          real_name?: string | null
          location?: string | null
          is_kyc_verified?: boolean
          ideological_vector?: number[] | null
          fact_check_tokens?: number
          created_at?: string
          updated_at?: string
        }
      }
      pods: {
        Row: {
          id: string
          topic: string
          heat_level: number
          status: 'active' | 'sunset' | 'archived'
          expires_at: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          topic: string
          heat_level?: number
          status?: 'active' | 'sunset' | 'archived'
          expires_at: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          topic?: string
          heat_level?: number
          status?: 'active' | 'sunset' | 'archived'
          expires_at?: string
          created_by?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          pod_id: string
          sender_id: string
          content: string
          type: 'text' | 'voice' | 'dilemma_reference'
          status: 'none' | 'verified' | 'challenged' | 'debunked'
          audio_duration: number | null
          audio_pins: number[] | null
          created_at: string
        }
        Insert: {
          id?: string
          pod_id: string
          sender_id: string
          content: string
          type?: 'text' | 'voice' | 'dilemma_reference'
          status?: 'none' | 'verified' | 'challenged' | 'debunked'
          audio_duration?: number | null
          audio_pins?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          pod_id?: string
          sender_id?: string
          content?: string
          type?: 'text' | 'voice' | 'dilemma_reference'
          status?: 'none' | 'verified' | 'challenged' | 'debunked'
          audio_duration?: number | null
          audio_pins?: number[] | null
          created_at?: string
        }
      }
      handshakes: {
        Row: {
          initiator_id: string
          receiver_id: string
          status: 'pending' | 'accepted' | 'declined'
          alignment_score: number | null
          created_at: string
        }
        Insert: {
          initiator_id: string
          receiver_id: string
          status?: 'pending' | 'accepted' | 'declined'
          alignment_score?: number | null
          created_at?: string
        }
        Update: {
          initiator_id?: string
          receiver_id?: string
          status?: 'pending' | 'accepted' | 'declined'
          alignment_score?: number | null
          created_at?: string
        }
      }
      citations: {
        Row: {
          id: string
          message_id: string
          challenger_id: string
          source_url: string
          excerpt: string
          status: 'pending' | 'verified' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          challenger_id: string
          source_url: string
          excerpt: string
          status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          challenger_id?: string
          source_url?: string
          excerpt?: string
          status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      // Define RPCs here, e.g., for vector similarity search
      match_profiles_by_vector: {
        Args: {
          query_vector: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          pseudonym: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

