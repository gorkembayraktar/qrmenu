import { SupabaseClient, createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import * as CreateAdminUser from './01_create_admin_user';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase credentials are missing in .env.local file');
    process.exit(1);
}

export const migrations = [
    CreateAdminUser
];

export async function runMigrations(supabase: SupabaseClient, isReset: boolean = false) {
    console.log(`Starting migrations... (Mode: ${isReset ? 'RESET' : 'UP'})`);

    if (isReset) {
        // Run migrations in reverse for reset
        for (let i = migrations.length - 1; i >= 0; i--) {
            try {
                await migrations[i].down(supabase);
                console.log(`✅ Migration reset completed`);
            } catch (error) {
                console.error(`❌ Migration reset failed:`, error);
                throw error;
            }
        }
        console.log('All migrations have been reset successfully');
    }

    // Run migrations up
    for (const migration of migrations) {
        try {
            await migration.up(supabase);
            console.log(`✅ Migration completed`);
        } catch (error) {
            console.error(`❌ Migration failed:`, error);
            throw error;
        }
    }
}

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Check for reset flag
const isReset = process.argv.includes('--reset');

// Run migrations
runMigrations(supabase, isReset);