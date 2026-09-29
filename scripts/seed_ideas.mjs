import { config } from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env'), quiet: true });

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_POOLER_URL,
  ssl: { rejectUnauthorized: false }
});

await client.connect();

const seedIdeas = [
  {
    public_id: 'VFI-IDEA-0001',
    student_name: 'Lucas Lindqvist',
    student_age: 12,
    student_grade: 'Grade 6',
    contact_email: 'lucas@example.se',
    contact_phone: '+46 70 123 4567',
    school_name: 'Viksängsskolan',
    country_slug: 'sweden',
    city_slug: 'vasteras',
    idea_title: 'Solar-Powered Eco Cleaner Robot',
    idea_description: 'An autonomous rover equipped with solar panels and micro-sweeping brushes designed to clean school playgrounds and collect recyclable plastic litter automatically.',
    photo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    voice_note_url: null,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_type: 'link',
    category: 'Sustainability & Green Tech',
    status: 'approved',
    votes_count: 42
  },
  {
    public_id: 'VFI-IDEA-0002',
    student_name: 'Emma Bergström',
    student_age: 14,
    student_grade: 'Grade 8',
    contact_email: 'emma@example.se',
    contact_phone: '+46 70 987 6543',
    school_name: 'Mälardalen International School (MISV)',
    country_slug: 'sweden',
    city_slug: 'vasteras',
    idea_title: 'Smart Classroom Air Quality & Noise Monitor',
    idea_description: 'A friendly robot mascot on the teacher desk that measures CO2 levels, temperature, and decibel noise, alerting students with gentle colored LEDs to open windows and maintain focus.',
    photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    voice_note_url: null,
    video_url: null,
    video_type: 'none',
    category: 'Smart Schools & Health',
    status: 'approved',
    votes_count: 35
  },
  {
    public_id: 'VFI-IDEA-0003',
    student_name: 'Alexander Holm',
    student_age: 15,
    student_grade: 'Grade 9',
    contact_email: 'alex@example.se',
    contact_phone: '+46 72 345 6789',
    school_name: 'Hydro Skola',
    country_slug: 'sweden',
    city_slug: 'vasteras',
    idea_title: 'Autonomous Waterway Debris Interceptor',
    idea_description: 'A modular dual-hull catamaran robot that traverses Lake Mälaren shorelines to capture microplastics and floating debris before entering municipal filtration systems.',
    photo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    voice_note_url: null,
    video_url: null,
    video_type: 'none',
    category: 'Clean Energy & Water',
    status: 'pending',
    votes_count: 0
  }
];

try {
  for (const idea of seedIdeas) {
    await client.query(`
      INSERT INTO idea_submissions (
        public_id, student_name, student_age, student_grade,
        contact_email, contact_phone, school_name, country_slug, city_slug,
        idea_title, idea_description, photo_url, voice_note_url,
        video_url, video_type, category, status, votes_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) ON CONFLICT (public_id) DO NOTHING;
    `, [
      idea.public_id, idea.student_name, idea.student_age, idea.student_grade,
      idea.contact_email, idea.contact_phone, idea.school_name, idea.country_slug, idea.city_slug,
      idea.idea_title, idea.idea_description, idea.photo_url, idea.voice_note_url,
      idea.video_url, idea.video_type, idea.category, idea.status, idea.votes_count
    ]);
  }
  console.log('Seed ideas added successfully!');
} finally {
  await client.end();
}
