import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.TIDB_HOST || '127.0.0.1',
  port: Number(process.env.TIDB_PORT || 4000),
  user: process.env.TIDB_USER || 'root',
  password: process.env.TIDB_PASSWORD || '',
  database: process.env.TIDB_DATABASE || 'instaclone',
  ssl: process.env.TIDB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

export const db = pool;

export async function testConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}

export default pool;
