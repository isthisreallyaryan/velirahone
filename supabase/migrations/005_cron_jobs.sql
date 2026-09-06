-- migrations/005_cron_jobs.sql

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Automatically transition expired pods into the 'sunset' state every 5 minutes
SELECT cron.schedule(
  'sunset_expired_pods',
  '*/5 * * * *',
  $$
    UPDATE public.pods 
    SET status = 'sunset' 
    WHERE status = 'active' AND expires_at <= NOW();
  $$
);

-- Replenish the daily 5 fact-check tokens for all users exactly at midnight
SELECT cron.schedule(
  'replenish_fact_check_tokens',
  '0 0 * * *',
  $$
    UPDATE public.profiles 
    SET fact_check_tokens = 5;
  $$
);

