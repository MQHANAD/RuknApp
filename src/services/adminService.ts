import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@config/env';
import { UserProfile, UserRole } from '@lib/supabase';

export interface AdminRecord {
  idx: number;
  id: number;
  email: string;
  name: string;
  password: string;
  permissions: string[] | null;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser extends UserProfile {
  role: 'admin';
  permissions: string[];
}

class AdminService {
  private getDefaultHeaders() {
    return {
      'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  async authenticateAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      console.log('Authenticating admin with email:', email);
      
      // TEMPORARY: Hardcoded admin for testing until RLS is fixed
      if (email === 'admin@ruknapp.com' && password === 'admin123!@#') {
        console.log('Using temporary hardcoded admin for testing');
        const adminProfile: AdminUser = {
          id: 1,
          name: 'Admin',
          email: 'admin@ruknapp.com',
          role: 'admin',
          permissions: [
            'dashboard:read',
            'users:read',
            'users:write',
            'businesses:read',
            'businesses:write',
            'analytics:read',
            'system:read'
          ],
          created_at: '2025-09-23T09:42:45.55908+00:00',
          updated_at: '2025-09-23T09:42:45.55908+00:00'
        };

        console.log('Admin authentication successful for:', adminProfile.name);
        return { success: true, user: adminProfile };
      }
      
      // Get admin from database (will work once RLS is fixed)
      const adminRecord = await this.getAdminFromDatabase(email);
      
      if (!adminRecord) {
        return { success: false, error: 'Admin not found' };
      }

      if (!adminRecord.isActive) {
        return { success: false, error: 'Admin account is deactivated' };
      }

      // Check password (simple comparison for now - in production use proper hashing)
      if (adminRecord.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      const adminProfile: AdminUser = {
        id: adminRecord.id,
        name: adminRecord.name,
        email: adminRecord.email,
        role: 'admin',
        permissions: adminRecord.permissions || [
          'dashboard:read',
          'users:read',
          'users:write',
          'businesses:read',
          'businesses:write',
          'analytics:read',
          'system:read'
        ],
        created_at: adminRecord.created_at,
        updated_at: adminRecord.updated_at
      };

      console.log('Admin authentication successful for:', adminRecord.name);
      return { success: true, user: adminProfile };
    } catch (error) {
      console.error('Admin authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  private async getAdminFromDatabase(email: string): Promise<AdminRecord | null> {
    try {
      console.log('Fetching admin from database with email:', email);
      console.log('Supabase URL:', EXPO_PUBLIC_SUPABASE_URL);
      
      const queryUrl = `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/admins?email=eq.${encodeURIComponent(email)}`;
      console.log('Query URL:', queryUrl);
      
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: this.getDefaultHeaders()
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching admin from database:', response.status, response.statusText, errorText);
        return null;
      }

      const admins = await response.json();
      console.log('Admin query result:', admins);
      console.log('Number of admins found:', admins.length);

      if (admins && admins.length > 0) {
        console.log('Found admin:', admins[0]);
        return admins[0] as AdminRecord;
      }

      console.log('No admin found with email:', email);
      return null;
    } catch (error) {
      console.error('Error getting admin from database:', error);
      return null;
    }
  }

  async createAdmin(adminData: {
    email: string;
    name: string;
    password: string;
    permissions?: string[];
  }): Promise<AdminRecord | null> {
    try {
      console.log('Creating new admin:', adminData.email);
      
      const newAdmin = {
        email: adminData.email,
        name: adminData.name,
        password: adminData.password, // In production, hash this password
        permissions: adminData.permissions || [],
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/admins`, {
        method: 'POST',
        headers: {
          ...this.getDefaultHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(newAdmin)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create admin:', errorText);
        throw new Error(`Failed to create admin: ${errorText}`);
      }

      const result = await response.json();
      console.log('Admin created successfully:', result[0]);
      return result[0] as AdminRecord;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  isAdmin(user: UserProfile | null): boolean {
    return user?.role === 'admin';
  }

  hasPermission(user: UserProfile | null, permission: string): boolean {
    if (!this.isAdmin(user)) return false;
    
    // For now, all admins have all permissions
    // In a more complex system, you'd check specific permissions
    return true;
  }

  async getAllAdmins(): Promise<AdminRecord[]> {
    try {
      console.log('Fetching all admins...');
      const queryUrl = `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/admins?select=*`;
      console.log('All admins query URL:', queryUrl);
      
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: this.getDefaultHeaders()
      });

      console.log('All admins response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch admins:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch admins: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('All admins result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching all admins:', error);
      return [];
    }
  }

  async updateAdmin(id: number, updates: Partial<AdminRecord>): Promise<AdminRecord | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/admins?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: {
            ...this.getDefaultHeaders(),
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updateData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update admin: ${response.statusText}`);
      }

      const result = await response.json();
      return result[0] as AdminRecord;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  async deleteAdmin(id: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/admins?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: this.getDefaultHeaders()
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting admin:', error);
      return false;
    }
  }
}

export const adminService = new AdminService();
