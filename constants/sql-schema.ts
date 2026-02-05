export const SQL_SCHEMA = `-- DIGITAL V-CARD SAAS - BACKEND ARCHITECTURE
-- Designed by: Senior Backend Architect
-- Date: 2026-02-03
-- Target System: Supabase (PostgreSQL 15+)

/* 
  FIX: Recursion Infinite Loop Resolved
  We now use a SECURITY DEFINER function to fetch roles, preventing RLS policies from triggering themselves.
*/

-- 1. CLEANUP (Fix existing recursion)
DROP POLICY IF EXISTS "Super Admin View All" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin Manage All" ON public.franchises;
DROP POLICY IF EXISTS "Super Admin Manage All Businesses" ON public.businesses;

-- 2. HELPER FUNCTIONS (Prevent Recursion)
-- Accessing public.profiles in a policy on public.profiles causes recursion.
-- We bypass RLS using SECURITY DEFINER to safely fetch the role.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'franchise_admin', 'business_owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. DATABASE TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'business_owner',
  franchise_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.franchises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  admin_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  franchise_id UUID REFERENCES public.franchises(id),
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  owner_photo_url TEXT,
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  view_count BIGINT DEFAULT 0,
  whatsapp_template TEXT DEFAULT 'Hi {{business_name}}, I found your V-Card at {{vcard_url}} and would like to connect',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'website', 'github')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 5a. Profiles Policies (FIXED)
CREATE POLICY "Public Read Own Profile" ON public.profiles 
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Super Admin View All" ON public.profiles 
  FOR SELECT TO authenticated USING (
    public.get_my_role() = 'super_admin'
  );

-- 5b. Franchises Policies
CREATE POLICY "Public View Options" ON public.franchises 
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Super Admin Manage All" ON public.franchises 
  FOR ALL TO authenticated USING (
    public.get_my_role() = 'super_admin'
  );

CREATE POLICY "Franchise Admin Manage Own" ON public.franchises
  FOR UPDATE TO authenticated USING (admin_id = auth.uid());

-- 5c. Businesses Policies
CREATE POLICY "Public Read V-Card" ON public.businesses 
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Owner Manage Own Business" ON public.businesses 
  FOR ALL TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Franchise Admin View Region" ON public.businesses 
  FOR SELECT TO authenticated USING (
    franchise_id IN (
      SELECT id FROM public.franchises WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "Super Admin Manage All Businesses" ON public.businesses 
  FOR ALL TO authenticated USING (
    public.get_my_role() = 'super_admin'
  );

-- 6. STORAGE BUCKETS (Pseudo-SQL, run in dashboard usually)
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('qrcodes', 'qrcodes', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Logos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'logos');
CREATE POLICY "Owner Upload Logos" ON storage.objects FOR INSERT TO authenticated USING (bucket_id = 'logos');

-- 7. TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'business_owner')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
