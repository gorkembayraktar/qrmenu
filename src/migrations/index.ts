import * as createAdminUser from './01_create_admin_user';

const migrations = [
    createAdminUser,
];

async function runMigrations(isReset: boolean = false) {
    console.log(`Starting migrations... (Mode: ${isReset ? 'RESET' : 'UP'})`);

    if (isReset) {
        // Migrations'ı tersten çalıştır (down)
        for (let i = migrations.length - 1; i >= 0; i--) {
            const migration = migrations[i];
            try {
                await migration.down();
            } catch (error) {
                console.error(`Migration down failed:`, error);
                process.exit(1);
            }
        }
        console.log('All migrations have been reset successfully');

        // Sonra yeniden yükle (up)
        console.log('Re-applying migrations...');
    }

    // Normal migration işlemi (up)
    for (const migration of migrations) {
        try {
            await migration.up();
        } catch (error) {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    }

    console.log('All migrations completed successfully');
}

// Komut satırı argümanlarını kontrol et
const isReset = process.argv.includes('--reset');
runMigrations(isReset); 