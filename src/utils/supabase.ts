"use client";

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// .env.local dosyasını yükle
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
    });
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
(async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Supabase connection error:', error);
        } else {
            console.log('Supabase connection successful');
        }
    } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
    }
})(); 