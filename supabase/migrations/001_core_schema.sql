-- migrations/001_core_schema.sql

-- Enums for strict state management
CREATE TYPE pod_status AS ENUM ('active', 'sunset', 'archived');
CREATE TYPE message_type AS ENUM ('text', 'voice', 'dilemma_reference');
CREATE TYPE fact_status AS ENUM ('none', 'verified', 'challenged', 'debunked');
CREATE TYPE handshake_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE citation_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  pseudonym TEXT UNIQUE NOT NULL,
  real_name TEXT,
  location TEXT,
  is_kyc_verified BOOLEAN DEFAULT false,
  fact_check_tokens INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  heat_level INTEGER DEFAULT 0,
  status pod_status DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID REFERENCES public.pods(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  type message_type DEFAULT 'text',
  status fact_status DEFAULT 'none',
  audio_duration INTEGER,
  audio_pins INTEGER[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.handshakes (
  initiator_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  status handshake_status DEFAULT 'pending',
  alignment_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (initiator_id, receiver_id)
);

CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  challenger_id UUID REFERENCES public.profiles(id),
  source_url TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  status citation_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

