/*
  # InnovBridge Database Schema

  ## Overview
  Creates the complete database structure for InnovBridge.tech platform including:
  - Tech news and updates management
  - Career opportunities and internships
  - Newsletter subscriptions
  - Contact form submissions
  - Services showcase

  ## New Tables

  ### 1. tech_updates
  Stores daily tech news, AI updates, and innovation stories
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Update headline
  - `content` (text) - Full article content
  - `excerpt` (text) - Short summary for previews
  - `category` (text) - Type: AI, Web3, Tech News, etc.
  - `image_url` (text) - Featured image URL
  - `published` (boolean) - Publication status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. opportunities
  Lists internships, projects, and career opportunities
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Opportunity title
  - `description` (text) - Full description
  - `type` (text) - internship, job, project, collaboration
  - `location` (text) - Remote, city, or hybrid
  - `company` (text) - Company or organization name
  - `apply_url` (text) - Application link
  - `active` (boolean) - Whether opportunity is still available
  - `created_at` (timestamptz) - Creation timestamp
  - `expires_at` (timestamptz) - Expiration date

  ### 3. newsletter_subscribers
  Manages email subscriptions for daily/weekly newsletters
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text, unique) - Subscriber email address
  - `frequency` (text) - daily or weekly
  - `subscribed_at` (timestamptz) - Subscription timestamp
  - `verified` (boolean) - Email verification status
  - `active` (boolean) - Subscription active status

  ### 4. contact_submissions
  Stores contact form messages
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `read` (boolean) - Whether message has been read
  - `created_at` (timestamptz) - Submission timestamp

  ### 5. services
  Showcase of services offered by InnovBridge
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Service name
  - `description` (text) - Service description
  - `icon` (text) - Icon identifier
  - `features` (jsonb) - Array of feature points
  - `active` (boolean) - Display status
  - `order_index` (integer) - Display order

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for published content
  - Admin-only write access (managed via future auth system)

  ## Important Notes
  - All timestamps use UTC timezone
  - Indexes added for performance on frequently queried columns
  - Email addresses are unique and validated
  - Content is sanitized on the frontend before display
*/

-- Create tech_updates table
CREATE TABLE IF NOT EXISTS tech_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL DEFAULT 'Tech News',
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL DEFAULT 'internship',
  location text NOT NULL DEFAULT 'Remote',
  company text NOT NULL,
  apply_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  subscribed_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  active boolean DEFAULT true
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE tech_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published tech updates"
  ON tech_updates FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view active opportunities"
  ON opportunities FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (active = true);

-- Public can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Public can submit contact forms
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tech_updates_published ON tech_updates(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tech_updates_category ON tech_updates(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index, active);

-- Insert sample services
INSERT INTO services (title, description, icon, features, active, order_index)
VALUES 
  (
    'AI Integration & Automation',
    'Transform your business with cutting-edge AI solutions. We implement custom AI tools, chatbots, and automation systems tailored to your needs.',
    'Brain',
    '["Custom AI chatbot development", "Process automation", "Machine learning integration", "AI-powered analytics"]'::jsonb,
    true,
    1
  ),
  (
    'Web Development',
    'Build stunning, high-performance websites and web applications. From landing pages to complex platforms, we deliver production-ready solutions.',
    'Code',
    '["Responsive web design", "Full-stack development", "Progressive web apps", "E-commerce solutions"]'::jsonb,
    true,
    2
  ),
  (
    'Digital Consulting',
    'Strategic guidance for your digital transformation journey. We help you navigate the tech landscape and make informed decisions.',
    'Lightbulb',
    '["Technology strategy", "Digital transformation roadmap", "Tech stack consultation", "Innovation workshops"]'::jsonb,
    true,
    3
  ),
  (
    'Tech Training & Workshops',
    'Empower your team with the latest tech skills. Customized training programs in AI, web development, and emerging technologies.',
    'GraduationCap',
    '["AI & ML workshops", "Web development bootcamps", "Corporate training", "Hands-on projects"]'::jsonb,
    true,
    4
  )
ON CONFLICT DO NOTHING;

-- Insert sample tech update
INSERT INTO tech_updates (title, content, excerpt, category, published)
VALUES 
  (
    'Welcome to InnovBridge',
    'InnovBridge is launching as your premier destination for tech innovation, AI updates, and digital opportunities. Stay tuned for daily updates on the technologies shaping our future.',
    'Your new hub for tech innovation and AI updates is here. Discover the future of technology with InnovBridge.',
    'Platform News',
    true
  )
ON CONFLICT DO NOTHING;