// src/lib/supabase-instagram.js
import { supabaseClient } from '../../utils/supabaseClient';

export class SupabaseInstagramService {
  constructor() {
    this.supabase = supabaseClient();
  }

  // Save Instagram account to Supabase
  async saveInstagramAccount(accountData, clerkUserId) {
    try {
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .upsert({
          instagram_id: accountData.instagram_business_account_id,
          clerk_id: clerkUserId,
          username: accountData.page_name || 'Unknown',
          access_token: accountData.page_access_token,
          expires_at: new Date(Date.now() + (accountData.page_token_expires_in * 1000)).toISOString(),
          connected_at: new Date().toISOString(),
          last_posted_at: null
        }, {
          onConflict: 'instagram_id'
        });

      if (error) {
        console.error('Error saving Instagram account to Supabase:', error);
        throw new Error(`Failed to save Instagram account: ${error.message}`);
      }

      console.log('Instagram account saved to Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error in saveInstagramAccount:', error);
      throw error;
    }
  }

  // Save multiple Instagram accounts
  async saveInstagramAccounts(accounts, clerkUserId) {
    try {
      const accountsToSave = accounts.map(account => ({
        instagram_id: account.instagram_business_account_id,
        clerk_id: clerkUserId,
        username: account.page_name || 'Unknown',
        access_token: account.page_access_token,
        expires_at: new Date(Date.now() + (account.page_token_expires_in * 1000)).toISOString(),
        connected_at: new Date().toISOString(),
        last_posted_at: null
      }));

      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .upsert(accountsToSave, {
          onConflict: 'instagram_id'
        });

      if (error) {
        console.error('Error saving Instagram accounts to Supabase:', error);
        throw new Error(`Failed to save Instagram accounts: ${error.message}`);
      }

      console.log('Instagram accounts saved to Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error in saveInstagramAccounts:', error);
      throw error;
    }
  }

  // Get Instagram accounts for a user
  async getInstagramAccounts(clerkUserId) {
    try {
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .select('*')
        .eq('clerk_id', clerkUserId)
        .order('connected_at', { ascending: false });

      if (error) {
        console.error('Error fetching Instagram accounts from Supabase:', error);
        throw new Error(`Failed to fetch Instagram accounts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getInstagramAccounts:', error);
      throw error;
    }
  }

  // Get a specific Instagram account
  async getInstagramAccount(instagramId, clerkUserId) {
    try {
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .select('*')
        .eq('instagram_id', instagramId)
        .eq('clerk_id', clerkUserId)
        .single();

      if (error) {
        console.error('Error fetching Instagram account from Supabase:', error);
        throw new Error(`Failed to fetch Instagram account: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getInstagramAccount:', error);
      throw error;
    }
  }

  // Update Instagram account
  async updateInstagramAccount(instagramId, clerkUserId, updates) {
    try {
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .update(updates)
        .eq('instagram_id', instagramId)
        .eq('clerk_id', clerkUserId)
        .select()
        .single();

      if (error) {
        console.error('Error updating Instagram account in Supabase:', error);
        throw new Error(`Failed to update Instagram account: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateInstagramAccount:', error);
      throw error;
    }
  }

  // Delete Instagram account
  async deleteInstagramAccount(instagramId, clerkUserId) {
    try {
      const { error } = await this.supabase
        .from('instagram_accounts')
        .delete()
        .eq('instagram_id', instagramId)
        .eq('clerk_id', clerkUserId);

      if (error) {
        console.error('Error deleting Instagram account from Supabase:', error);
        throw new Error(`Failed to delete Instagram account: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteInstagramAccount:', error);
      throw error;
    }
  }

  // Check if Instagram account exists
  async accountExists(instagramId, clerkUserId) {
    try {
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .select('instagram_id')
        .eq('instagram_id', instagramId)
        .eq('clerk_id', clerkUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking Instagram account existence:', error);
        throw new Error(`Failed to check Instagram account: ${error.message}`);
      }

      return !!data;
    } catch (error) {
      console.error('Error in accountExists:', error);
      return false;
    }
  }

  // Update last posted timestamp
  async updateLastPosted(instagramId, clerkUserId) {
    try {
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .update({
          last_posted_at: new Date().toISOString()
        })
        .eq('instagram_id', instagramId)
        .eq('clerk_id', clerkUserId)
        .select()
        .single();

      if (error) {
        console.error('Error updating last posted timestamp:', error);
        throw new Error(`Failed to update last posted timestamp: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateLastPosted:', error);
      throw error;
    }
  }

  // Get accounts that need token refresh (expiring within 7 days)
  async getAccountsNeedingRefresh(clerkUserId) {
    try {
      const sevenDaysFromNow = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString();
      
      const { data, error } = await this.supabase
        .from('instagram_accounts')
        .select('*')
        .eq('clerk_id', clerkUserId)
        .lt('expires_at', sevenDaysFromNow)
        .order('expires_at', { ascending: true });

      if (error) {
        console.error('Error fetching accounts needing refresh:', error);
        throw new Error(`Failed to fetch accounts needing refresh: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAccountsNeedingRefresh:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const supabaseInstagram = new SupabaseInstagramService();
