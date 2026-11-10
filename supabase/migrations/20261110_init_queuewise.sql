-- ============================================================================
-- QueueWise Complete Database Schema & Migration
-- Production-grade PostgreSQL Schema with Atomic Token RPC & RLS Policies
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enum Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'salon_owner', 'staff', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE token_type AS ENUM ('online', 'walk_in', 'priority');
EXCEPTION
  WHEN duplicate_object THEN null;
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
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE salon_status AS ENUM ('pending', 'approved', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_category AS ENUM ('unisex', 'men', 'women');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table (Linked to auth.users or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE, -- references auth.users(id) in Supabase
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

-- 2. Salons Table
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

-- 3. Salon Branches (Multi-Branch Support)
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

-- 4. Salon Operating Hours (Per Weekday)
CREATE TABLE IF NOT EXISTS public.salon_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  weekday INT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  open_time TIME NOT NULL DEFAULT '09:00:00',
  close_time TIME NOT NULL DEFAULT '21:00:00',
  break_start TIME,
  break_end TIME,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(salon_id, weekday)
);

-- 5. Salon Holidays / Off Days
CREATE TABLE IF NOT EXISTS public.salon_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  holiday_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(salon_id, holiday_date)
);

-- 6. Chairs Table
CREATE TABLE IF NOT EXISTS public.chairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  chair_number INT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(salon_id, chair_number)
);

-- 7. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Hair', 'Color', 'Spa', 'Beard', 'Bridal', 'Nails', 'Grooming'
  duration_min INT NOT NULL DEFAULT 30,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Staff Table
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

-- 9. Tokens Table (Live Queue Core)
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

-- 10. Token Services Junction Table (Multi-Service Support)
CREATE TABLE IF NOT EXISTS public.token_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  service_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  duration_min INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Customer Reviews Table
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

-- 12. Customer Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, salon_id)
);

-- 13. Notifications Table
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

-- 14. Loyalty Points Table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 50,
  history JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, salon_id)
);

-- 15. Audit Logs Table
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

-- ============================================================================
-- Atomic Token Number Generator Function (with Row-Level Locking)
-- ============================================================================
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
  -- Acquire an advisory lock or lock existing tokens for this salon and date
  PERFORM pg_advisory_xact_lock(hashtext(p_salon_id::TEXT || p_date::TEXT));
  
  SELECT COALESCE(MAX(token_no), 0) + 1
  INTO v_next_no
  FROM public.tokens
  WHERE salon_id = p_salon_id AND date = p_date;

  RETURN v_next_no;
END;
$$;

-- ============================================================================
-- Realtime Enablement
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. Salons Policies
CREATE POLICY "Salons readable by anyone if approved"
  ON public.salons FOR SELECT
  USING (status = 'approved' OR owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can update own salon"
  ON public.salons FOR UPDATE
  USING (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- 3. Tokens Policies
CREATE POLICY "Customers can view their own tokens"
  ON public.tokens FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR salon_id IN (SELECT id FROM public.salons WHERE owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  );

CREATE POLICY "Customers can insert their own token"
  ON public.tokens FOR INSERT
  WITH CHECK (
    customer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR customer_id IS NULL
  );

CREATE POLICY "Owners and Staff can update salon tokens"
  ON public.tokens FOR UPDATE
  USING (
    salon_id IN (SELECT id FROM public.salons WHERE owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
    OR salon_id IN (SELECT salon_id FROM public.staff WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
    OR customer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

