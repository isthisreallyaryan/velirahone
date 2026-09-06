-- supabase/seed.sql

-- 1. Enable pgvector for high-performance ideological alignment calculations
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- 2. Clear existing local state for clean seeding
TRUNCATE TABLE public.citations, public.handshakes, public.messages, public.pods, public.profiles RESTART IDENTITY CASCADE;

-- 3. Seed High-Integrity Profiles
INSERT INTO public.profiles (id, pseudonym, real_name, location, is_kyc_verified, ideological_vector, fact_check_tokens, created_at, updated_at)
VALUES
  (
    'usr_9x8a7b6c5', 
    'NeonMango', 
    'Vijender Singh', 
    'Hyderabad', 
    true, 
    '[0.51, 0.73, 0.42, 0.65]', 
    5, 
    NOW(), 
    NOW()
  ),
  (
    'usr_8x7b', 
    'CipherWeaver', 
    'System Actor', 
    'Network Node', 
    true, 
    '[0.80, 0.20, 0.60, 0.30]', 
    5, 
    NOW(), 
    NOW()
  ),
  (
    'usr_9x2c', 
    'Komal', 
    'Komal Singh', 
    'Hyderabad', 
    true, 
    '[0.55, 0.70, 0.45, 0.60]', 
    5, 
    NOW(), 
    NOW()
  );

-- 4. Seed the Active Debate Pod
INSERT INTO public.pods (id, topic, heat_level, status, expires_at, created_by, created_at)
VALUES
  (
    'pod_1',
    'Universal Basic Income is structurally unsustainable.',
    85,
    'active',
    NOW() + INTERVAL '14 hours',
    'usr_8x7b',
    NOW()
  );

-- 5. Seed Initial Pod Messages
INSERT INTO public.messages (id, pod_id, sender_id, content, type, status, created_at)
VALUES
  (
    'msg_1',
    'pod_1',
    'usr_8x7b',
    'UBI fundamentally removes the market incentive for baseline labor.',
    'text',
    'none',
    NOW() - INTERVAL '10 minutes'
  );

-- 6. Seed Trust Network (Handshakes)
INSERT INTO public.handshakes (initiator_id, receiver_id, status, alignment_score, created_at)
VALUES
  (
    'usr_9x8a7b6c5',
    'usr_9x2c',
    'accepted',
    94,
    NOW() - INTERVAL '30 days'
  ),
  (
    'usr_9x8a7b6c5',
    'usr_8x7b',
    'accepted',
    82,
    NOW() - INTERVAL '15 days'
  );

