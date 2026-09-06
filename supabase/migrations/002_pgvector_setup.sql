-- migrations/002_pgvector_setup.sql

-- Enable the pgvector extension for high-performance similarity search
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Add the 4-dimensional ideological vector column (Fiscal, Social, Authority, Welfare)
ALTER TABLE public.profiles ADD COLUMN ideological_vector vector(4);

-- Create an HNSW index for lightning-fast vector similarity queries at scale
CREATE INDEX ON public.profiles USING hnsw (ideological_vector vector_cosine_ops);

