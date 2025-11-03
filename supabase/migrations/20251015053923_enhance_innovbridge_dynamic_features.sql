
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tech_updates' AND column_name = 'description'
  ) THEN
    ALTER TABLE tech_updates ADD COLUMN description text;
  END IF;
END $$;

UPDATE tech_updates SET description = excerpt WHERE description IS NULL;

-- Update opportunities table (add link column)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'opportunities' AND column_name = 'status'
  ) THEN
    ALTER TABLE opportunities ADD COLUMN status text DEFAULT 'open';
  END IF;
END $$;

ALTER TABLE opportunities ALTER COLUMN apply_url DROP NOT NULL;
ALTER TABLE opportunities RENAME COLUMN apply_url TO link;

-- Update services table (add learn_more_link and icon_url)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'learn_more_link'
  ) THEN
    ALTER TABLE services ADD COLUMN learn_more_link text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'icon_url'
  ) THEN
    ALTER TABLE services ADD COLUMN icon_url text;
  END IF;
END $$;

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  joined_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  date timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  responded boolean DEFAULT false
);

-- Enable RLS on new tables
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_members
CREATE POLICY "Anyone can join community"
  ON community_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view community members"
  ON community_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update community members"
  ON community_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete community members"
  ON community_members FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can submit contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- Update RLS policies for admin CRUD operations
DROP POLICY IF EXISTS "Public can view published tech updates" ON tech_updates;
DROP POLICY IF EXISTS "Public can view active opportunities" ON opportunities;
DROP POLICY IF EXISTS "Public can view active services" ON services;

CREATE POLICY "Anyone can view published tech updates"
  ON tech_updates FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage tech updates"
  ON tech_updates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view active opportunities"
  ON opportunities FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage opportunities"
  ON opportunities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage newsletter subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_members_email ON community_members(email);
CREATE INDEX IF NOT EXISTS idx_community_members_active ON community_members(active, joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_date ON contact_messages(date DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read, date DESC);

-- Update existing services with learn_more_link
UPDATE services 
SET learn_more_link = '#contact' 
WHERE learn_more_link IS NULL;
