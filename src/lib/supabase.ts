import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  frequency: string;
  subscribed_at?: string;
  verified?: boolean;
  active?: boolean;
}

export interface CommunityMember {
  id?: string;
  email: string;
  frequency: string;
  joined_at?: string;
  active?: boolean;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date?: string;
  read?: boolean;
  responded?: boolean;
}

export async function sendEmail(type: string, to: string, data?: any) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          type,
          to,
          ...data,
        }),
      }
    );

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
