require('dotenv').config();
const { getPool, sql } = require('../db');

async function run() {
  const pool = await getPool();
  try {
    console.log('Finding users with NULL studentId...');
    const res = await pool.request().query("SELECT id FROM Users WHERE studentId IS NULL OR studentId = ''");
    const rows = res.recordset;
    console.log(`Found ${rows.length} users to update.`);
    for (const r of rows) {
      const id = r.id;
      const studentId = `BVC${String(id).padStart(6, '0')}`;
      await pool.request().input('studentId', sql.NVarChar, studentId).input('id', sql.Int, id).query('UPDATE Users SET studentId=@studentId WHERE id=@id');
      console.log(`Updated user ${id} -> ${studentId}`);
    }
    console.log('Backfill complete.');
    process.exit(0);
  } catch (err) {
    console.error('Backfill failed:', err);
    process.exit(1);
  }
}

run();
