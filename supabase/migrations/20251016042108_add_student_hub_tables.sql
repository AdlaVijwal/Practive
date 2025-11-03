-- Create learning_resources table
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  link TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  type TEXT NOT NULL CHECK (type IN ('Course', 'Workshop', 'Project', 'Guide')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for learning_resources
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_resources
CREATE POLICY "Enable read access for all users" ON learning_resources
  FOR SELECT USING (active = true);

CREATE POLICY "Enable insert for authenticated users with admin role" ON learning_resources
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.email() IN (SELECT unnest(current_setting('app.admin_emails')::text[]))
    )
  );

CREATE POLICY "Enable update for authenticated users with admin role" ON learning_resources
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.email() IN (SELECT unnest(current_setting('app.admin_emails')::text[]))
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_learning_resources_updated_at
  BEFORE UPDATE ON learning_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();