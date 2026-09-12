import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('🌱 Seeding Buffermate database...');

    // Create test users
    const testUsers = [
        { email: 'demo@buffermate.app', password: 'Demo@12345' },
        { email: 'test@buffermate.app', password: 'Test@12345' },
    ];

    for (const testUser of testUsers) {
        try {
            const { data: user, error: userError } = await supabase.auth.admin.createUser({
                email: testUser.email,
                password: testUser.password,
                email_confirm: true,
            });

            if (userError) {
                if (userError.message.includes('already exists')) {
                    console.log(`✓ User ${testUser.email} already exists`);
                } else {
                    console.log(`✗ User creation failed for ${testUser.email}:`, userError.message);
                }
            } else {
                console.log(`✓ Test user created: ${testUser.email} (ID: ${user.user.id})`);
            }
        } catch (err: any) {
            console.error(`✗ Error creating user ${testUser.email}:`, err.message);
        }
    }

    console.log('\n✅ Seed complete!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: demo@buffermate.app');
    console.log('   Password: Demo@12345');
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
