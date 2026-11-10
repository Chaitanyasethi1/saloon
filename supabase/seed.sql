-- ============================================================================
-- QueueWise Complete Production Database Schema & Seed Data
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lucoqxsoxccumftdtoge/sql
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enum Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'salon_owner', 'staff', 'super_admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE token_type AS ENUM ('online', 'walk_in', 'priority');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE token_status AS ENUM (
    'booked',
    'checked_in',
    'in_service',
    'completed',
    'cancelled',
    'no_show',
    'skipped'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE salon_status AS ENUM ('pending', 'approved', 'suspended');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_category AS ENUM ('unisex', 'men', 'women');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Salons Table
CREATE TABLE IF NOT EXISTS public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'India',
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  gender_type gender_category NOT NULL DEFAULT 'unisex',
  cover_url TEXT NOT NULL,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating_avg NUMERIC(3, 2) DEFAULT 4.9,
  rating_count INT DEFAULT 120,
  chairs_count INT DEFAULT 4,
  status salon_status NOT NULL DEFAULT 'approved',
  settings JSONB DEFAULT '{
    "auto_call_next": false,
    "cancellation_grace_mins": 30,
    "no_show_grace_mins": 15,
    "delay_notice_mins": 0,
    "allow_walk_ins": true,
    "sound_chime": true,
    "max_daily_capacity": 60
  }'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Salon Branches
CREATE TABLE IF NOT EXISTS public.salon_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  chairs_count INT DEFAULT 4,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Salon Operating Hours
CREATE TABLE IF NOT EXISTS public.salon_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  weekday INT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  open_time TIME NOT NULL DEFAULT '09:00:00',
  close_time TIME NOT NULL DEFAULT '21:00:00',
  break_start TIME,
  break_end TIME,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(salon_id, weekday)
);

-- 7. Chairs Table
CREATE TABLE IF NOT EXISTS public.chairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  chair_number INT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(salon_id, chair_number)
);

-- 8. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_min INT NOT NULL DEFAULT 30,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role_title TEXT DEFAULT 'Master Stylist',
  specialties TEXT[] DEFAULT ARRAY['Haircut', 'Color']::TEXT[],
  chair_id UUID REFERENCES public.chairs(id) ON DELETE SET NULL,
  avatar_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Tokens Table
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  token_no INT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  slot_start TIME,
  slot_end TIME,
  type token_type NOT NULL DEFAULT 'online',
  status token_status NOT NULL DEFAULT 'booked',
  chair_id UUID REFERENCES public.chairs(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  est_wait_min INT NOT NULL DEFAULT 15,
  qr_code TEXT,
  notes TEXT,
  checked_in_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_salon_date_token UNIQUE (salon_id, date, token_no)
);

-- 11. Token Services
CREATE TABLE IF NOT EXISTS public.token_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  service_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  duration_min INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token_id UUID REFERENCES public.tokens(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  owner_reply TEXT,
  owner_replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, salon_id)
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'queue_update',
  read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Loyalty Points Table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 50,
  history JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, salon_id)
);

-- 16. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Atomic Token Generator Function with Row Locking
CREATE OR REPLACE FUNCTION public.generate_next_token_no(
  p_salon_id UUID,
  p_date DATE
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_next_no INT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_salon_id::TEXT || p_date::TEXT));
  
  SELECT COALESCE(MAX(token_no), 0) + 1
  INTO v_next_no
  FROM public.tokens
  WHERE salon_id = p_salon_id AND date = p_date;

  RETURN v_next_no;
END;
$$;

-- 18. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 19. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 20. Public Read Policies
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Approved salons readable by all" ON public.salons FOR SELECT USING (status = 'approved');
CREATE POLICY "Active services readable by all" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Staff profiles readable by all" ON public.staff FOR SELECT USING (is_active = true);
CREATE POLICY "Tokens readable by participants" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "Token creation permitted" ON public.tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Token updates permitted" ON public.tokens FOR UPDATE USING (true);
CREATE POLICY "Reviews readable by all" ON public.reviews FOR SELECT USING (true);

-- ============================================================================
-- SEED DATA: Premier Salons & Services
-- ============================================================================

-- Seed Demo Users
INSERT INTO public.profiles (id, role, full_name, username, email, phone, avatar_url, status)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'super_admin', 'Aryan Malhotra (Super Admin)', 'admin_aryan', 'admin@queuewise.app', '+91 98110 00001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'active'),
  ('a0000000-0000-0000-0000-000000000002', 'salon_owner', 'Kabir Sen (Salon Owner)', 'kabir_sen', 'owner@demo.com', '+91 98200 11223', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'active'),
  ('a0000000-0000-0000-0000-000000000003', 'staff', 'Rohan Varma (Senior Stylist)', 'rohan_stylist', 'staff@demo.com', '+91 98100 44556', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'active'),
  ('a0000000-0000-0000-0000-000000000004', 'customer', 'Ananya Sharma', 'ananya_s', 'customer@demo.com', '+91 99887 66554', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed Salons
INSERT INTO public.salons (id, owner_id, name, slug, tagline, description, address, city, state, lat, lng, gender_type, cover_url, rating_avg, rating_count, chairs_count, status)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'L''Étoile Atelier de Beauté',
    'letoile-atelier-mumbai',
    'Haute Coiffure & Bespoke Grooming in Bandra',
    'A sanctuary of contemporary elegance where master artisans tailor bespoke hairstyles, Balayage color artistry, and Japanese hair spas in an acoustic-treated dark luxury lounge.',
    'Plot 42, Waterfield Road, Bandra West',
    'Mumbai',
    'Maharashtra',
    19.0596,
    72.8295,
    'unisex',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    4.96,
    348,
    5,
    'approved'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'The Obsidian Grooming Parlour',
    'obsidian-parlour-delhi',
    'Ultra-Premium Gentlemen''s Sanctuary in Connaught Place',
    'Handcrafted Italian leather chairs, single malt refreshments, and timeless British gentleman barbering standards right in the heart of Delhi.',
    'Inner Circle, Block C, Connaught Place',
    'Delhi',
    'Delhi',
    28.6328,
    77.2197,
    'men',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85',
    4.93,
    289,
    4,
    'approved'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000002',
    'Aura Botanical & Silk Salon',
    'aura-botanical-bangalore',
    'Eco-Luxe Organic Hair Care & Ayurvedic Rituals in Indiranagar',
    'Infusing certified organic bio-botanicals with state-of-the-art European salon technologies. Zero ammonia, cruelty-free, and serene garden aesthetics.',
    '100 Feet Road, 12th Main, Indiranagar',
    'Bangalore',
    'Karnataka',
    12.9784,
    77.6408,
    'unisex',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    4.97,
    412,
    6,
    'approved'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Services for L'Étoile Atelier
INSERT INTO public.services (salon_id, name, category, duration_min, price, description, is_active)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Artisan Haircut & Blowout', 'Hair', 45, 1800.00, 'Signature precision scissoring and scalp massage', true),
  ('b0000000-0000-0000-0000-000000000001', 'French Balayage & Gloss', 'Color', 120, 6500.00, 'Hand-painted sunlit dimension with ammonia-free glaze', true),
  ('b0000000-0000-0000-0000-000000000001', 'Tokyo Head Spa & Scalp Detox', 'Spa', 60, 3200.00, 'Deep micro-mist scalp exfoliation and meridian pressure massage', true),
  ('b0000000-0000-0000-0000-000000000001', 'Imperial Hot Towel Beard Sculpt', 'Beard', 35, 950.00, 'Straight razor shave and sandalwood oil compression', true),
  ('b0000000-0000-0000-0000-000000000001', 'Brazilian Keratin Luxe Infusion', 'Keratin', 90, 5500.00, 'Zero-frizz smoothing treatment with mirror gloss finish', true)
ON CONFLICT DO NOTHING;

