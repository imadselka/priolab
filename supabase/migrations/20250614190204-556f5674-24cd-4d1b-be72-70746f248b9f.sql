
-- Update RLS policies for repositories to allow public access
DROP POLICY IF EXISTS "Anyone can view repositories" ON public.repositories;
CREATE POLICY "Anyone can view repositories" ON public.repositories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert repositories" ON public.repositories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update repositories" ON public.repositories FOR UPDATE USING (true);

-- Update RLS policies for issues to allow public access  
DROP POLICY IF EXISTS "Anyone can view issues" ON public.issues;
CREATE POLICY "Anyone can view issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Anyone can insert issues" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update issues" ON public.issues FOR UPDATE USING (true);
