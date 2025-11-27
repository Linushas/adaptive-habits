ALTER TABLE habits 
ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

ALTER TABLE habit_entries 
ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own habits"
ON habits FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own entries"
ON habit_entries FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
