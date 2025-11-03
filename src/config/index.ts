/**
 * InnovBridge - Core Configuration
 * 
 * This file centralizes all environment variables and database schemas.
 * Environment variables should be set in .env files or deployment platforms.
 */

// Environment Variable Types
export interface EnvConfig {
  // Frontend (Vite) Environment
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_APP_URL?: string;

  // Backend (Supabase Functions) Environment
  STRIPE_SECRET_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
}

// Database Schema Types
export interface StudentRequest {
  id: string;
  request_type: 'resume' | 'project' | 'ppt';
  email: string;
  data: Record<string, unknown>;
  paid: boolean;
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TechUpdate {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  description?: string;
  category: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  company: string;
  link?: string;
  status?: string;
  active: boolean;
  created_at: string;
  expires_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  active: boolean;
  order_index: number;
  learn_more_link?: string;
  icon_url?: string;
}

// Constants
export const ENV_FILES = {
  development: '.env.development',
  production: '.env.production',
  test: '.env.test',
};

// Stripe test card: 4242 4242 4242 4242
export const STRIPE_TEST_PRICE = 200; // $2.00 USD

// Database table names
export const DB_TABLES = {
  STUDENT_REQUESTS: 'student_requests',
  TECH_UPDATES: 'tech_updates',
  OPPORTUNITIES: 'opportunities',
  SERVICES: 'services',
} as const;