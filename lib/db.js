import { neon } from '@neondatabase/serverless';

function getSQL() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// Initialize the table if it doesn't exist
export async function initDB() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS dashboard_data (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

// Load all data for a user
export async function loadData(userId = 'paige') {
  const sql = getSQL();
  await initDB();
  const rows = await sql`
    SELECT data FROM dashboard_data WHERE id = ${userId}
  `;
  if (rows.length === 0) {
    return {};
  }
  return rows[0].data;
}

// Save data for a user (merges with existing)
export async function saveData(userId = 'paige', data) {
  const sql = getSQL();
  await initDB();
  await sql`
    INSERT INTO dashboard_data (id, data, updated_at)
    VALUES (${userId}, ${JSON.stringify(data)}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET data = ${JSON.stringify(data)}, updated_at = NOW()
  `;
  return { success: true };
}
