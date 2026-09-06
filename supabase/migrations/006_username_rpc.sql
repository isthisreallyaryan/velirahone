-- migrations/006_username_rpc.sql

-- Securely checks pseudonym availability without exposing row data
CREATE OR REPLACE FUNCTION check_username_available(requested_username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_available boolean;
BEGIN
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE lower(pseudonym) = lower(requested_username)
  ) INTO is_available;
  
  RETURN is_available;
END;
$$;

