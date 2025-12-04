import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
    console.error('Could not read .env.local');
    process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
    console.log('Checking for "organizations" or "org" table...');

    // Try selecting from 'orgs'
    const { data: orgs, error: orgsError } = await supabase.from('orgs').select('*').limit(1);
    if (!orgsError) {
        console.log('Found table "orgs"!');
        if (orgs && orgs.length > 0) {
            console.log('Columns:', Object.keys(orgs[0]));
        } else {
            console.log('Table "orgs" is empty.');
        }
        return;
    }

    // Try selecting from 'org'
    const { data: org, error: orgError } = await supabase.from('org').select('*').limit(1);
    if (!orgError) {
        console.log('Found table "org"!');
        if (org && org.length > 0) {
            console.log('Columns:', Object.keys(org[0]));
        } else {
            console.log('Table "org" is empty.');
        }
        return;
    }

    console.log('Could not find "organizations" or "org" table accessible via API.');
    console.log('Organizations Error:', orgsError.message);
    console.log('Org Error:', orgError.message);
}

checkTables();
