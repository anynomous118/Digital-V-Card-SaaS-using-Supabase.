
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  FRANCHISE_ADMIN = 'franchise_admin',
  BUSINESS_OWNER = 'business_owner'
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  franchise_id?: string;
  created_at: string;
}

export interface Franchise {
  id: string;
  name: string;
  state: string;
  district: string;
  admin_id: string;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  franchise_id: string;
  name: string;
  slug: string;
  bio: string;
  logo_url?: string;
  photo_url?: string;
  whatsapp_number: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  business_id: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'website';
  url: string;
}

export interface ViewState {
  activeTab: 'dashboard' | 'schema' | 'preview' | 'docs';
  selectedBusiness?: Business;
}
