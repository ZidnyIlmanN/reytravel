import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  features: string[];
}

export interface AvailableCar {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price_per_day: number;
  image_url: string;
  is_available: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BookingInput {
  name: string;
  phone: string;
  email?: string;
  pickup_point: string;
  destination: string;
  travel_date: string;
  package_id?: string | null;
  car_id?: string | null;
  message?: string;
}

export async function getTravelPackages(): Promise<TravelPackage[]> {
  if (!isConfigured || !supabase) {
    console.warn('Supabase is not configured yet or has placeholder values. Using fallback mock data.');
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('price', { ascending: true });
    if (error) {
      console.error('Supabase query error (travel_packages):', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch travel packages:', err);
    return [];
  }
}

export async function getAvailableCars(): Promise<AvailableCar[]> {
  if (!isConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('available_cars')
      .select('*')
      .order('price_per_day', { ascending: true });
    if (error) {
      console.error('Supabase query error (available_cars):', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch available cars:', err);
    return [];
  }
}

export async function getFAQs(): Promise<FAQ[]> {
  if (!isConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Supabase query error (faqs):', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch FAQs:', err);
    return [];
  }
}

export async function createBooking(booking: BookingInput) {
  if (!isConfigured || !supabase) {
    return { success: false, error: 'Database belum terhubung. Silakan konfigurasi file .env.local.' };
  }
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan booking.' };
  }
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
}

export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  if (!isConfigured || !supabase) return [];
  try {
    let query = supabase
      .from('articles')
      .select('id, title, slug, excerpt, thumbnail_url, status, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error (articles):', error);
      return [];
    }
    return (data as Article[]) || [];
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    return [];
  }
}
