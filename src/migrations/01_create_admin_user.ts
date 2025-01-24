import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// .env.local dosyasını yükle
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Check .env.local file.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function up() {
    try {
        // Önce admin kullanıcısının var olup olmadığını kontrol et
        const { data: existingUser } = await supabaseAdmin
            .from('auth.users')
            .select('*')
            .eq('email', 'admin@admin.com')
            .single();

        if (existingUser) {
            console.log('Admin user already exists');
            return;
        }

        // Admin kullanıcısını oluştur
        const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
            email: 'admin@admin.com',
            password: '123456',
            email_confirm: true
        });

        if (signUpError) {
            throw signUpError;
        }

        console.log('Admin user created and confirmed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

export async function down() {
    try {
        // Admin kullanıcısını sil
        const { error } = await supabaseAdmin.auth.admin.deleteUser(
            (await supabaseAdmin.auth.admin.listUsers()).data.users.find(u => u.email === 'admin@admin.com')?.id!
        );

        if (error) {
            throw error;
        }

        console.log('Admin user removed successfully');
    } catch (error) {
        console.error('Migration rollback failed:', error);
        throw error;
    }
} 