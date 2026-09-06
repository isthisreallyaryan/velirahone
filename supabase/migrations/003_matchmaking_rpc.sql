-- migrations/003_matchmaking_rpc.sql

-- Calculates ideological alignment using cosine distance
CREATE OR REPLACE FUNCTION match_profiles_by_vector(
  query_vector vector(4),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  pseudonym TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.pseudonym,
    1 - (p.ideological_vector <=> query_vector) AS similarity
  FROM public.profiles p
  WHERE 1 - (p.ideological_vector <=> query_vector) > match_threshold
  ORDER BY p.ideological_vector <=> query_vector
  LIMIT match_count;
END;
$$;

