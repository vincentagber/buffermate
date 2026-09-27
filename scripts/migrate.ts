import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Extract credentials
const password = process.env.DB_PASSWORD || 'Ebuka123@$!';
const host = 'db.sgsmadjmfwgvtbqrmbhw.supabase.co';
const port = 5432;
const database = 'postgres';
const user = 'postgres';

async function runMigrations() {
  console.log('Connecting to PostgreSQL database at', host);
  const client = new Client({
    user,
    host,
    database,
    password,
    port,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log(' Connected to PostgreSQL successfully.');

    const migrationFiles = [
      'migrations/init.sql',
      'migrations/002_socialflow_automations.sql',
      'migrations/003_buffermate_ai_content_and_campaigns.sql'
    ];

    for (const file of migrationFiles) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        console.log(`Executing ${file}...`);
        const sql = fs.readFileSync(fullPath, 'utf8');
        await client.query(sql);
        console.log(` ${file} applied successfully.`);
      }
    }

    console.log(' All database migrations executed.');
  } catch (err: any) {
    console.error(' Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigrations();
