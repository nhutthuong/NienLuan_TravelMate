const { pool, query } = require('../config/db');

const findByEmail = async (email) => {
  const text = `
    SELECT manguoidung, hoten, email, matkhau_hash, google_id, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at
    FROM NguoiDung
    WHERE LOWER(email) = LOWER($1)
  `;
  const result = await query(text, [email]);
  return result.rows[0] || null;
};

const findByGoogleId = async (googleId) => {
  const text = `
    SELECT manguoidung, hoten, email, matkhau_hash, google_id, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at
    FROM NguoiDung
    WHERE google_id = $1
  `;
  const result = await query(text, [googleId]);
  return result.rows[0] || null;
};

let isMigrationChecked = false;
const ensureNgaySinhColumn = async () => {
  if (isMigrationChecked) return;
  try {
    await query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'nguoidung' AND column_name = 'ngaysinh'
        ) THEN
          ALTER TABLE NguoiDung ADD COLUMN NgaySinh DATE;
        END IF;
      END $$;
    `);
    isMigrationChecked = true;
  } catch (_) {}
};

const findById = async (maNguoiDung) => {
  await ensureNgaySinhColumn();
  const text = `
    SELECT manguoidung, hoten, email, matkhau_hash, google_id, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at,
           TO_CHAR(ngaysinh, 'YYYY-MM-DD') AS ngaysinh
    FROM NguoiDung
    WHERE manguoidung = $1
  `;
  try {
    const result = await query(text, [maNguoiDung]);
    return result.rows[0] || null;
  } catch (_err) {
    const fallbackText = `
      SELECT manguoidung, hoten, email, matkhau_hash, google_id, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at, NULL AS ngaysinh
      FROM NguoiDung
      WHERE manguoidung = $1
    `;
    const fallbackResult = await query(fallbackText, [maNguoiDung]);
    return fallbackResult.rows[0] || null;
  }
};

const createLocal = async ({ hoTen, email, matKhauHash }, maLoaiHinhList = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertUserText = `
      INSERT INTO NguoiDung (hoten, email, matkhau_hash, phuongthucxacthuc, vaitro, trangthai)
      VALUES ($1, $2, $3, 'local', 'Member', 'Active')
      RETURNING manguoidung, hoten, email, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at
    `;
    const userRes = await client.query(insertUserText, [hoTen, email, matKhauHash]);
    const newUser = userRes.rows[0];

    if (Array.isArray(maLoaiHinhList) && maLoaiHinhList.length > 0) {
      for (const maLoaiHinh of maLoaiHinhList) {
        await client.query(
          'INSERT INTO SoThichNguoiDung (manguoidung, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [newUser.manguoidung, maLoaiHinh]
        );
      }
    }

    await client.query('COMMIT');
    return newUser;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const createGoogle = async ({ hoTen, email, googleId, avatarUrl }) => {
  const text = `
    INSERT INTO NguoiDung (hoten, email, google_id, phuongthucxacthuc, matkhau_hash, avatar_url, vaitro, trangthai)
    VALUES ($1, $2, $3, 'google', NULL, $4, 'Member', 'Active')
    RETURNING manguoidung, hoten, email, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at
  `;
  const result = await query(text, [hoTen, email, googleId, avatarUrl]);
  return result.rows[0];
};

const linkGoogleAccount = async (maNguoiDung, googleId, avatarUrl) => {
  const text = `
    UPDATE NguoiDung
    SET google_id = $2,
        phuongthucxacthuc = 'google',
        matkhau_hash = NULL,
        avatar_url = COALESCE(avatar_url, $3)
    WHERE manguoidung = $1
    RETURNING manguoidung, hoten, email, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at
  `;
  const result = await query(text, [maNguoiDung, googleId, avatarUrl]);
  return result.rows[0];
};

const getPreferences = async (maNguoiDung) => {
  const text = `
    SELECT st.maloaihinh, lh.ten, lh.mota
    FROM SoThichNguoiDung st
    JOIN LoaiHinhDuLich lh ON st.maloaihinh = lh.maloaihinh
    WHERE st.manguoidung = $1
    ORDER BY st.maloaihinh ASC
  `;
  const result = await query(text, [maNguoiDung]);
  return result.rows;
};

const updatePreferences = async (maNguoiDung, maLoaiHinhList = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM SoThichNguoiDung WHERE manguoidung = $1', [maNguoiDung]);

    if (Array.isArray(maLoaiHinhList) && maLoaiHinhList.length > 0) {
      for (const maLoaiHinh of maLoaiHinhList) {
        await client.query(
          'INSERT INTO SoThichNguoiDung (manguoidung, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [maNguoiDung, maLoaiHinh]
        );
      }
    }

    await client.query('COMMIT');
    return maLoaiHinhList;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getAllUsers = async ({ search = '', trangThai = '', page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    conditions.push(`(LOWER(hoten) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`);
  }

  if (trangThai && ['Active', 'Banned'].includes(trangThai)) {
    params.push(trangThai);
    conditions.push(`trangthai = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*)::INT AS total FROM NguoiDung ${whereClause}`;
  const countRes = await query(countQuery, params);
  const total = countRes.rows[0].total;

  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const listQuery = `
    SELECT manguoidung, hoten, email, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at
    FROM NguoiDung
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `;
  const listRes = await query(listQuery, params);

  return {
    users: listRes.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const updateStatus = async (maNguoiDung, trangThai) => {
  const text = `
    UPDATE NguoiDung
    SET trangthai = $2
    WHERE manguoidung = $1
    RETURNING manguoidung, hoten, email, vaitro, trangthai
  `;
  const result = await query(text, [maNguoiDung, trangThai]);
  return result.rows[0] || null;
};

const getAdminStats = async () => {
  const usersRes = await query('SELECT COUNT(*)::INT AS total FROM NguoiDung');
  const hotelsRes = await query('SELECT COUNT(*)::INT AS total FROM KhachSan');
  const attractionsRes = await query('SELECT COUNT(*)::INT AS total FROM DiemThamQuan');
  const scansRes = await query('SELECT COUNT(*)::INT AS total FROM LichSuTimKiem');
  const reviewsKsRes = await query("SELECT COUNT(*)::INT AS total FROM DanhGiaKhachSan WHERE trangthai = 'Flagged'");
  const reviewsDtqRes = await query("SELECT COUNT(*)::INT AS total FROM DanhGiaDiemTQ WHERE trangthai = 'Flagged'");
  const locationScansRes = await query(`
    SELECT d.madiadiem, d.ten, COUNT(ls.madiadiem)::INT AS count
    FROM DiaDiem d
    LEFT JOIN LichSuTimKiem ls ON d.madiadiem = ls.madiadiem
    GROUP BY d.madiadiem, d.ten
    ORDER BY count DESC, d.madiadiem ASC
  `);

  return {
    totalUsers: usersRes.rows[0].total,
    totalHotels: hotelsRes.rows[0].total,
    totalAttractions: attractionsRes.rows[0].total,
    totalScans: scansRes.rows[0].total,
    flaggedReviewsCount: reviewsKsRes.rows[0].total + reviewsDtqRes.rows[0].total,
    locationScans: locationScansRes.rows,
  };
};

const updateProfile = async (maNguoiDung, { hoTen, avatarUrl, ngaySinh }) => {
  await ensureNgaySinhColumn();
  const fields = [];
  const params = [];

  if (hoTen !== undefined && hoTen.trim()) {
    params.push(hoTen.trim());
    fields.push(`hoten = $${params.length}`);
  }

  if (avatarUrl !== undefined) {
    params.push(avatarUrl);
    fields.push(`avatar_url = $${params.length}`);
  }

  if (ngaySinh !== undefined) {
    params.push(ngaySinh && ngaySinh.trim() ? ngaySinh.trim() : null);
    fields.push(`ngaysinh = $${params.length}`);
  }

  if (fields.length === 0) {
    return findById(maNguoiDung);
  }

  params.push(maNguoiDung);
  const text = `
    UPDATE NguoiDung
    SET ${fields.join(', ')}
    WHERE manguoidung = $${params.length}
    RETURNING manguoidung, hoten, email, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at,
              TO_CHAR(ngaysinh, 'YYYY-MM-DD') AS ngaysinh
  `;

  try {
    const result = await query(text, params);
    return result.rows[0] || null;
  } catch (_err) {
    // Neu loi do ngaysinh chua ton tai tren DB, fallback khong cap nhat/select ngaysinh
    const fallbackFields = fields.filter((f) => !f.startsWith('ngaysinh'));
    if (fallbackFields.length === 0) {
      return findById(maNguoiDung);
    }
    const fallbackParams = [];
    if (hoTen !== undefined && hoTen.trim()) fallbackParams.push(hoTen.trim());
    if (avatarUrl !== undefined) fallbackParams.push(avatarUrl);
    fallbackParams.push(maNguoiDung);

    const fallbackSql = `
      UPDATE NguoiDung
      SET ${fallbackFields.map((f, idx) => f.replace(/\$\d+/, `$${idx + 1}`)).join(', ')}
      WHERE manguoidung = $${fallbackParams.length}
      RETURNING manguoidung, hoten, email, phuongthucxacthuc, avatar_url, vaitro, trangthai, created_at, NULL AS ngaysinh
    `;
    const fallbackRes = await query(fallbackSql, fallbackParams);
    return fallbackRes.rows[0] || null;
  }
};

const updatePassword = async (maNguoiDung, newPasswordHash) => {
  const text = `
    UPDATE NguoiDung
    SET matkhau_hash = $2
    WHERE manguoidung = $1
    RETURNING manguoidung, email
  `;
  const result = await query(text, [maNguoiDung, newPasswordHash]);
  return result.rows[0] || null;
};

module.exports = {
  findByEmail,
  findByGoogleId,
  findById,
  createLocal,
  createGoogle,
  linkGoogleAccount,
  getPreferences,
  updatePreferences,
  getAllUsers,
  updateStatus,
  getAdminStats,
  updateProfile,
  updatePassword,
};

