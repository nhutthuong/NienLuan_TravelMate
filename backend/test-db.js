const { pool } = require('./config/db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log('Ket noi PostgreSQL thanh cong.');
    console.log('Database:', res.rows[0].db_name);
    console.log('Server Time:', res.rows[0].current_time);

    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log(`Tim thay ${tablesRes.rows.length} bang trong schema public.`);

    try {
      const ddRes = await pool.query('SELECT COUNT(*) FROM DiaDiem');
      console.log(`So dia diem trong DiaDiem: ${ddRes.rows[0].count}`);
    } catch {
      console.log('Bang DiaDiem chua co du lieu hoac chua tao.');
    }

    try {
      const lhRes = await pool.query('SELECT COUNT(*) FROM LoaiHinhDuLich');
      console.log(`So loai hinh du lich trong LoaiHinhDuLich: ${lhRes.rows[0].count}`);
    } catch {
      console.log('Bang LoaiHinhDuLich chua co du lieu hoac chua tao.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Loi ket noi PostgreSQL:', err.message);
    console.log('Kiem tra lai DB_PASSWORD, DB_PORT hoac DB_USER trong file backend/.env');
    process.exit(1);
  }
}

testConnection();
