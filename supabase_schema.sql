-- ==========================================
-- MediLink AI - Supabase Schema (Hackathon)
-- Includes Real-Time GPS Tracking Support
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to avoid "relation already exists" errors
-- WARNING: This will delete existing data in these tables.
DROP TABLE IF EXISTS public.chat_history CASCADE;
DROP TABLE IF EXISTS public.drone_dispatch CASCADE;
DROP TABLE IF EXISTS public.hospitals CASCADE;
DROP TABLE IF EXISTS public.specialists CASCADE;
DROP TABLE IF EXISTS public.emergency_contacts CASCADE;
DROP TABLE IF EXISTS public.emergency_passports CASCADE;
DROP TABLE IF EXISTS public.biometrics CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Users / Health Twin Profiles
-- Maps to Supabase auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER,
  blood_type TEXT,
  insurance_id TEXT,
  -- Real-Time GPS Tracking Fields
  live_lat NUMERIC,
  live_lng NUMERIC,
  last_location_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Real-Time Biometrics (Health Twin)
CREATE TABLE public.biometrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  heart_rate INTEGER,
  oxygen_level INTEGER,
  stress_index INTEGER,
  hydration_level INTEGER,
  health_score INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Emergency Passport Data
CREATE TABLE public.emergency_passports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL UNIQUE,
  allergies TEXT[], -- Array of strings
  conditions TEXT[],
  medications TEXT[],
  is_organ_donor BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Emergency Contacts & Primary Doctor
CREATE TABLE public.emergency_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  contact_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  relation TEXT,
  is_primary_doctor BOOLEAN DEFAULT false,
  specialty TEXT -- Used if it's a doctor
);

-- 5. Specialists (Multi-Specialist Matching)
CREATE TABLE public.specialists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience_years INTEGER,
  suitability_score INTEGER,
  hospital_name TEXT,
  status TEXT CHECK (status IN ('Available Now', 'High Demand', 'Offline')),
  -- GPS Fields
  location_lat NUMERIC,
  location_lng NUMERIC
);

-- 6. Hospitals & Resources
CREATE TABLE public.hospitals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icu_beds_available INTEGER DEFAULT 0,
  estimated_wait_time_mins INTEGER,
  capabilities TEXT[], -- e.g., ['Trauma', 'Cardiac', 'Neuro']
  -- GPS Fields
  location_lat NUMERIC,
  location_lng NUMERIC
);

-- 7. Drone Dispatch
CREATE TABLE public.drone_dispatch (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  drone_tag TEXT NOT NULL, -- e.g., 'DRN-77'
  payload_type TEXT NOT NULL, -- e.g., 'Defibrillator + First Aid'
  status TEXT CHECK (status IN ('Dispatching', 'In Transit', 'Delivered')),
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  target_user_id UUID REFERENCES public.users(id),
  -- GPS Fields
  current_lat NUMERIC,
  current_lng NUMERIC
);

-- 8. AI Chat History
CREATE TABLE public.chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'ai')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. AI Scanned Medicines Log
CREATE TABLE public.scanned_medicines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_name TEXT,
  medicine_name TEXT NOT NULL,
  brand_name TEXT,
  strength TEXT,
  formulation TEXT,
  batch_number TEXT,
  expiry_date TEXT,
  manufacturer TEXT,
  fda_verified BOOLEAN DEFAULT false,
  accuracy_score NUMERIC,
  warnings TEXT[],
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- Row-Level Security (RLS) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drone_dispatch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scanned_medicines ENABLE ROW LEVEL SECURITY;

-- Allow read and insert for scanned medicines
CREATE POLICY "Allow public insert to scanned_medicines" ON public.scanned_medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on scanned_medicines" ON public.scanned_medicines FOR SELECT USING (true);

-- Users can read and update their own profile (including GPS updates)
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Biometrics & Passports
CREATE POLICY "Users view own biometrics" ON public.biometrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own biometrics" ON public.biometrics FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own passport" ON public.emergency_passports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own passport" ON public.emergency_passports FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- Chat History
CREATE POLICY "Users view own chat" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own chat" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public/Read-Only Resources (Specialists, Hospitals, Drones)
-- In a real app, you might restrict this, but for the hackathon, anyone authenticated can read resources
CREATE POLICY "Anyone can view specialists" ON public.specialists FOR SELECT USING (true);
CREATE POLICY "Anyone can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Users view drone dispatch targeted to them" ON public.drone_dispatch FOR SELECT USING (auth.uid() = target_user_id);
