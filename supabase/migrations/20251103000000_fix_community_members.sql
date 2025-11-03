-- Drop existing table if it exists
DROP TABLE IF EXISTS community_members;

-- Create community_members table
CREATE TABLE community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  joined_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous insert" ON community_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON community_members
    FOR SELECT USING (true);

-- Create indices
CREATE INDEX idx_community_members_email ON community_members(email);
CREATE INDEX idx_community_members_active ON community_members(active);

-- Grant permissions
GRANT ALL ON community_members TO authenticated;
GRANT INSERT ON community_members TO anon;