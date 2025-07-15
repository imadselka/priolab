
-- Update github_id columns to use bigint instead of integer to handle large GitHub IDs
ALTER TABLE public.repositories ALTER COLUMN github_id TYPE bigint;
ALTER TABLE public.issues ALTER COLUMN github_id TYPE bigint;
ALTER TABLE public.github_comments ALTER COLUMN github_id TYPE bigint;
ALTER TABLE public.profiles ALTER COLUMN github_id TYPE bigint;
