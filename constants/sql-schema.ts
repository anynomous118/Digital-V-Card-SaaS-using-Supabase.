
export const SQL_SCHEMA = `-- DIGITAL V-CARD SAAS - DATABASE SCHEMA & RLS POLICIES
-- Created by Senior Backend Architect

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'franchise_admin', 'business_owner');

-- 2. TABLES

-- Profiles (Linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'business_owner',
  franchise_id UUID, -- For franchise admins only
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Franchises (Area-wise separation)
CREATE TABLE franchises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  admin_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses (The core V-Card data)
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  franchise_id UUID REFERENCES franchises(id) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Indexed for fast public lookups
  bio TEXT,
  logo_url TEXT,
  photo_url TEXT,
  whatsapp_number TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  whatsapp_template TEXT DEFAULT 'Hi {{business_name}}, I found your V-Card at {{vcard_url}}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Links
CREATE TABLE social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL
);

-- 3. INDEXES
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_franchise ON businesses(franchise_id);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- 4a. Profiles Policies
CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' );

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING ( auth.uid() = id );

-- 4b. Franchises Policies
CREATE POLICY "Public can view basic franchise info"
  ON franchises FOR SELECT TO anon, authenticated
  USING ( true );

CREATE POLICY "Franchise admins can manage assigned franchise"
  ON franchises FOR ALL TO authenticated
  USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' OR admin_id = auth.uid() );

-- 4c. Businesses Policies (The Core)
CREATE POLICY "Public read access for V-Cards"
  ON businesses FOR SELECT TO anon, authenticated
  USING ( true );

CREATE POLICY "Owners can manage own business"
  ON businesses FOR ALL TO authenticated
  USING ( 
    auth.uid() = owner_id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' OR
    (SELECT franchise_id FROM profiles WHERE id = auth.uid()) = franchise_id
  );

-- 4d. Social Links Policies
CREATE POLICY "Public read access for social links"
  ON social_links FOR SELECT TO anon, authenticated
  USING ( true );

CREATE POLICY "Owners can manage social links"
  ON social_links FOR ALL TO authenticated
  USING ( 
    EXISTS (
      SELECT 1 FROM businesses b 
      WHERE b.id = social_links.business_id 
      AND (b.owner_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin')
    )
  );

-- 5. FUNCTIONS & TRIGGERS
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'business_owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
