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
    console.log('Seeding database...');

    // Create a test user (if not exists)
    // Note: Creating users via API requires admin rights or direct auth.admin usage
    const email = 'test@example.com';
    const password = 'password123';

    const { data: user, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (userError) {
        console.log('User creation failed (might already exist):', userError.message);
    } else {
        console.log('Test user created:', user.user.id);
    }

    // Get the user ID (either from creation or lookup)
    // For simplicity, we'll just log that we need a user ID to seed other tables
    // In a real scenario, we'd fetch the user by email if creation failed.

    console.log('Seed complete.');
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
