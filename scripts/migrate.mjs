// One-off / repeatable migration runner: applies supabase/migrations/*.sql in order.
// Usage: node scripts/migrate.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
// quiet: true suppresses dotenv's stdout "tip" line — without it, anything that
// captures this script's stdout (e.g. `$(node ...)` to extract a var) silently
// picks up that tip text glued onto the real output.
config({ path: join(__dirname, '..', '.env'), quiet: true });

const connectionString = process.env.SUPABASE_DB_POOLER_URL;
if (!connectionString) {
  console.error('Missing SUPABASE_DB_POOLER_URL in .env');
  process.exit(1);
}

const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

await client.connect();
try {
  for (const file of files) {
    console.log(`Applying ${file}...`);
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    await client.query(sql);
    console.log(`  done.`);
  }
  console.log('All migrations applied.');
} finally {
  await client.end();
}
