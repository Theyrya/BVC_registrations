const sql = require('mssql');

let pool = null;

async function getPool() {
  if (pool) {
    return pool;
  }
  const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'bvc_registrations',
    authentication: {
      type: 'default',
    },
    options: {
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true' || true,
      encrypt: true,
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
