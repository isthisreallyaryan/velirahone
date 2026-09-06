-- migrations/004_rls_policies.sql

-- Enable Row Level Security across the board
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, only the user can update their own profile
CREATE POLICY "Profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Pods: Anyone can read, authenticated users can create
CREATE POLICY "Pods are viewable by everyone" ON public.pods FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create pods" ON public.pods FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Messages: Viewable by everyone, insertable by authenticated users in active pods
CREATE POLICY "Messages viewable by everyone" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

