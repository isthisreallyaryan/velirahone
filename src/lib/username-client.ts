import { supabase } from './supabase';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const UsernameClient = {
  /**
   * Enforces the premium, cryptographic aesthetic of the Arena.
   * Pseudonyms must be 3-15 characters, alphanumeric only, with no spaces.
   */
  validateFormat: (pseudonym: string): ValidationResult => {
    const cleanPseudo = pseudonym.trim();
    
    if (cleanPseudo.length < 3) {
      return { isValid: false, message: 'Pseudonym must be at least 3 characters.' };
    }
    if (cleanPseudo.length > 15) {
      return { isValid: false, message: 'Pseudonym cannot exceed 15 characters.' };
    }
    
    // Only letters and numbers — prevents messy UI formatting in the chat bubbles
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(cleanPseudo)) {
      return { isValid: false, message: 'Only letters and numbers are permitted.' };
    }

    return { isValid: true };
  },

  /**
   * Securely queries the pgvector/profiles table to ensure absolute uniqueness 
   * before the user attempts to claim the identity.
   */
  isAvailable: async (pseudonym: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pseudonym')
        .ilike('pseudonym', pseudonym.trim())
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Availability check failed:', error.message);
        return false;
      }

      // If no data is returned, the pseudonym is free to claim
      return !data;
    } catch (err) {
      console.error('Unexpected error checking pseudonym:', err);
      return false;
    }
  },

  /**
   * Binds the validated pseudonym to the authenticated user's session natively.
   */
  claim: async (userId: string, pseudonym: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ pseudonym: pseudonym.trim(), updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Failed to claim pseudonym:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Unexpected error claiming pseudonym:', err);
      return false;
    }
  }
};

