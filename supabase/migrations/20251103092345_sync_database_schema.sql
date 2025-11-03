-- First, drop dependent tables and policies
DROP TABLE IF EXISTS student_request_history;

-- Drop tables we no longer need
DROP TABLE IF EXISTS tech_updates;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS community_members;

-- Drop and recreate student_requests table
DROP TABLE IF EXISTS student_requests;
CREATE TABLE student_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type TEXT NOT NULL CHECK (request_type IN ('resume', 'project', 'ppt')),
    email TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    paid BOOLEAN NOT NULL DEFAULT false,
    stripe_session_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for student_requests
ALTER TABLE student_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new requests (when creating checkout session)
CREATE POLICY "Allow anonymous insert" ON student_requests
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow reading own requests by email
CREATE POLICY "Allow users to read own requests" ON student_requests
    FOR SELECT
    USING (auth.jwt() IS NULL OR email = current_user);

-- Only allow service role to update (for payment confirmation)
CREATE POLICY "Allow service role to update" ON student_requests
    FOR UPDATE
    USING (auth.jwt() IS NULL);

-- Recreate student_request_history table for tracking request updates
CREATE TABLE student_request_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES student_requests(id),
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT
);

-- Add RLS policies for history table
ALTER TABLE student_request_history ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own request history
CREATE POLICY "view_own_request_history" ON student_request_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_requests sr
            WHERE sr.id = student_request_history.request_id
            AND (sr.email = current_user OR auth.jwt() IS NULL)
        )
    );

-- Allow staff to insert history records
CREATE POLICY "staff_insert_history" ON student_request_history
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM student_requests sr
            WHERE sr.id = request_id
        )
    );

-- Add trigger for updated_at on student_requests
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_student_requests_updated_at
    BEFORE UPDATE ON student_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();