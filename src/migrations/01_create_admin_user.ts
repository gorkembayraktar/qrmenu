import { SupabaseClient } from '@supabase/supabase-js';

export async function up(supabaseAdmin: SupabaseClient) {
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

export async function down(supabaseAdmin: SupabaseClient) {
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