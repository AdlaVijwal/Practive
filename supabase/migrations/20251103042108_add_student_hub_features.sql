-- Student Hub and Payment Integration
-- Migration: 20251103042108_add_student_hub_features.sql
-- Description: Adds tables and policies for Student Hub services and payment handling

-- Student requests table for service bookings
CREATE TABLE student_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL CHECK (request_type IN ('resume','project','ppt')),
  email TEXT NOT NULL,
  data JSONB NOT NULL,
  paid BOOLEAN NOT NULL DEFAULT false,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users,
  completion_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status history for tracking request progress
CREATE TABLE student_request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES student_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for student hub tables
ALTER TABLE student_requests ENABLE ROW LEVEL SECURITY;

-- Students can view their own requests
CREATE POLICY "users_view_own_requests" ON student_requests
  FOR SELECT USING (email = auth.email());

-- Anyone can insert (payment validation happens in Edge Function)
CREATE POLICY "insert_new_requests" ON student_requests
  FOR INSERT WITH CHECK (true);

-- Only assigned staff can update
CREATE POLICY "staff_update_assigned_requests" ON student_requests
  FOR UPDATE USING (
    assigned_to = auth.uid() OR 
    auth.email() IN (SELECT unnest(current_setting('app.admin_emails')::text[]))
  );

-- History table policies
ALTER TABLE student_request_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_own_request_history" ON student_request_history
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM student_requests WHERE email = auth.email()
    )
  );

CREATE POLICY "staff_insert_history" ON student_request_history
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT assigned_to FROM student_requests WHERE id = request_id
    ) OR
    auth.email() IN (SELECT unnest(current_setting('app.admin_emails')::text[]))
  );

-- Update triggers
CREATE TRIGGER update_student_requests_updated_at
  BEFORE UPDATE ON student_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-insert history on status change
CREATE OR REPLACE FUNCTION log_student_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status != OLD.status THEN
    INSERT INTO student_request_history (request_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_student_request_status
  AFTER INSERT OR UPDATE OF status ON student_requests
  FOR EACH ROW
  EXECUTE FUNCTION log_student_request_status_change();