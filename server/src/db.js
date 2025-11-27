const sql = require('mssql');

let pool = null;

async function getPool() {
  if (pool) {
    return pool;
  }
  const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || '',
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_NAME || 'bvc_registrations',
    options: {
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
  pool = await sql.connect(config);
  return pool;
}

module.exports = { getPool, sql };
