import { supabase } from '@/utils/supabase';

async function createAdminUser() {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: 'admin@admin.com',
            password: '123456',
        });

        if (error) {
            console.error('Error creating admin user:', error.message);
            return;
        }

        console.log('Admin user created successfully:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

createAdminUser(); 