const { pool, query } = require('../config/db');
const { buildLocationMatchScoreSql } = require('../utils/recommendation');

const getAllLocations = async ({ search = '', maLoaiHinh = '' } = {}, currentUserId = null) => {
  const conditions = [];
  const params = [];

  let userParamIdx = null;
  if (currentUserId) {
    params.push(currentUserId);
    userParamIdx = params.length;
  }

  const { selectFields } = buildLocationMatchScoreSql(userParamIdx);

  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const pIdx = params.length;
    conditions.push(`(LOWER(d.ten) LIKE $${pIdx} OR LOWER(d.tinhthanh) LIKE $${pIdx})`);
  }

  if (maLoaiHinh) {
    const categories = maLoaiHinh.split(',').map((c) => c.trim()).filter(Boolean);
    if (categories.length > 0) {
      params.push(categories);
      const pIdx = params.length;
      conditions.push(`
        EXISTS (
          SELECT 1 FROM DiaDiem_LoaiHinh dl2 
          WHERE dl2.madiadiem = d.madiadiem AND dl2.maloaihinh = ANY($${pIdx})
        )
      `);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      d.madiadiem,
      d.ten,
      d.tinhthanh,
      d.danhhieu,
      d.mota,
      d.vido,
      d.kinhdo,
      d.quymo,
      d.thoidiemlytuong,
      d.anh_url,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      COALESCE(ARRAY_AGG(DISTINCT lh.maloaihinh) FILTER (WHERE lh.maloaihinh IS NOT NULL), ARRAY[]::VARCHAR[]) AS ma_loai_hinh,
      (SELECT COUNT(*)::INT FROM KhachSan WHERE madiadiem = d.madiadiem) AS total_hotels,
      (SELECT COUNT(*)::INT FROM DiemThamQuan WHERE madiadiem = d.madiadiem) AS total_attractions,
      ${selectFields}
    FROM DiaDiem d
    LEFT JOIN DiaDiem_LoaiHinh dl ON d.madiadiem = dl.madiadiem
    LEFT JOIN LoaiHinhDuLich lh ON dl.maloaihinh = lh.maloaihinh
    ${whereClause}
    GROUP BY d.madiadiem
    ORDER BY ${userParamIdx ? 'match_score DESC,' : ''} d.madiadiem ASC
  `;

  const result = await query(sql, params);
  return result.rows.map((row) => ({
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    tinhThanh: row.tinhthanh,
    danhHieu: row.danhhieu,
    moTa: row.mota,
    viDo: parseFloat(row.vido),
    kinhDo: parseFloat(row.kinhdo),
    quyMo: row.quymo,
    thoiDiemLyTuong: row.thoidiemlytuong,
    anhUrl: row.anh_url,
    loaiHinh: row.loai_hinh,
    maLoaiHinh: row.ma_loai_hinh,
    totalHotels: row.total_hotels,
    totalAttractions: row.total_attractions,
    matchScore: parseInt(row.match_score || 0, 10),
    matchedLoaiHinh: row.matched_loai_hinh || [],
  }));
};

const getById = async (maDiaDiem, currentUserId = null) => {
  const params = [maDiaDiem];
  let userParamIdx = null;
  if (currentUserId) {
    params.push(currentUserId);
    userParamIdx = params.length;
  }

  const { selectFields } = buildLocationMatchScoreSql(userParamIdx);

  const sql = `
    SELECT 
      d.madiadiem,
      d.ten,
      d.tinhthanh,
      d.danhhieu,
      d.mota,
      d.vido,
      d.kinhdo,
      d.quymo,
      d.thoidiemlytuong,
      d.anh_url,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      COALESCE(ARRAY_AGG(DISTINCT lh.maloaihinh) FILTER (WHERE lh.maloaihinh IS NOT NULL), ARRAY[]::VARCHAR[]) AS ma_loai_hinh,
      ${userParamIdx ? `EXISTS (SELECT 1 FROM YeuThich yt WHERE yt.manguoidung = $${userParamIdx} AND yt.madiadiem = d.madiadiem) AS is_favorited,` : 'FALSE AS is_favorited,'}
      ${selectFields}
    FROM DiaDiem d
    LEFT JOIN DiaDiem_LoaiHinh dl ON d.madiadiem = dl.madiadiem
    LEFT JOIN LoaiHinhDuLich lh ON dl.maloaihinh = lh.maloaihinh
    WHERE d.madiadiem = $1
    GROUP BY d.madiadiem
  `;

  const result = await query(sql, params);
  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    tinhThanh: row.tinhthanh,
    danhHieu: row.danhhieu,
    moTa: row.mota,
    viDo: parseFloat(row.vido),
    kinhDo: parseFloat(row.kinhdo),
    quyMo: row.quymo,
    thoiDiemLyTuong: row.thoidiemlytuong,
    anhUrl: row.anh_url,
    loaiHinh: row.loai_hinh,
    maLoaiHinh: row.ma_loai_hinh,
    isFavorited: row.is_favorited,
    matchScore: parseInt(row.match_score || 0, 10),
    matchedLoaiHinh: row.matched_loai_hinh || [],
  };
};

const getMultipleByIds = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const sql = `
    SELECT madiadiem, ten, tinhthanh, danhhieu, anh_url
    FROM DiaDiem
    WHERE madiadiem = ANY($1)
  `;
  const res = await query(sql, [ids]);
  return res.rows.map((row) => ({
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    tinhThanh: row.tinhthanh,
    danhHieu: row.danhhieu,
    anhUrl: row.anh_url,
  }));
};

const getRelatedLocations = async (maDiaDiem, limit = 6) => {
  const sql = `
    SELECT 
      d.madiadiem,
      d.ten,
      d.tinhthanh,
      d.danhhieu,
      d.anh_url,
      COUNT(dl.maloaihinh) AS shared_categories,
      ARRAY_AGG(lh.ten) AS loai_hinh
    FROM DiaDiem d
    JOIN DiaDiem_LoaiHinh dl ON d.madiadiem = dl.madiadiem
    JOIN LoaiHinhDuLich lh ON dl.maloaihinh = lh.maloaihinh
    WHERE dl.maloaihinh IN (
      SELECT maloaihinh FROM DiaDiem_LoaiHinh WHERE madiadiem = $1
    )
    AND d.madiadiem <> $1
    GROUP BY d.madiadiem
    ORDER BY shared_categories DESC, d.madiadiem ASC
    LIMIT $2
  `;
  const result = await query(sql, [maDiaDiem, limit]);
  return result.rows.map((row) => ({
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    tinhThanh: row.tinhthanh,
    danhHieu: row.danhhieu,
    anhUrl: row.anh_url,
    sharedCategories: parseInt(row.shared_categories, 10),
    loaiHinh: row.loai_hinh,
  }));
};

const getAllCategories = async () => {
  const result = await query('SELECT maloaihinh, ten, mota FROM LoaiHinhDuLich ORDER BY maloaihinh ASC');
  return result.rows.map((r) => ({
    maLoaiHinh: r.maloaihinh,
    ten: r.ten,
    moTa: r.mota,
  }));
};

const getAllAmenities = async () => {
  const result = await query('SELECT matiennghi, ten, icon FROM TienNghi ORDER BY matiennghi ASC');
  return result.rows.map((r) => ({
    maTienNghi: r.matiennghi,
    ten: r.ten,
    icon: r.icon,
  }));
};

const getAllActivities = async () => {
  const result = await query('SELECT mahoatdong, ten, icon FROM HoatDong ORDER BY mahoatdong ASC');
  return result.rows.map((r) => ({
    maHoatDong: r.mahoatdong,
    ten: r.ten,
    icon: r.icon,
  }));
};

const createLocation = async (data, maLoaiHinhList = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO DiaDiem (ten, tinhthanh, danhhieu, mota, vido, kinhdo, quymo, thoidiemlytuong, anh_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const res = await client.query(insertSql, [
      data.ten,
      data.tinhThanh,
      data.danhHieu || null,
      data.moTa || null,
      data.viDo || null,
      data.kinhDo || null,
      data.quyMo || null,
      data.thoiDiemLyTuong || null,
      data.anhUrl,
    ]);

    const newLoc = res.rows[0];

    if (Array.isArray(maLoaiHinhList) && maLoaiHinhList.length > 0) {
      for (const lh of maLoaiHinhList) {
        await client.query(
          'INSERT INTO DiaDiem_LoaiHinh (madiadiem, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [newLoc.madiadiem, lh]
        );
      }
    }

    await client.query('COMMIT');
    return getById(newLoc.madiadiem);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateLocation = async (maDiaDiem, data, maLoaiHinhList = null) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateSql = `
      UPDATE DiaDiem
      SET ten = COALESCE($1, ten),
          tinhthanh = COALESCE($2, tinhthanh),
          danhhieu = COALESCE($3, danhhieu),
          mota = COALESCE($4, mota),
          vido = COALESCE($5, vido),
          kinhdo = COALESCE($6, kinhdo),
          quymo = COALESCE($7, quymo),
          thoidiemlytuong = COALESCE($8, thoidiemlytuong),
          anh_url = COALESCE($9, anh_url)
      WHERE madiadiem = $10
      RETURNING *
    `;
    const res = await client.query(updateSql, [
      data.ten,
      data.tinhThanh,
      data.danhHieu,
      data.moTa,
      data.viDo,
      data.kinhDo,
      data.quyMo,
      data.thoiDiemLyTuong,
      data.anhUrl,
      maDiaDiem,
    ]);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    if (Array.isArray(maLoaiHinhList)) {
      await client.query('DELETE FROM DiaDiem_LoaiHinh WHERE madiadiem = $1', [maDiaDiem]);
      for (const lh of maLoaiHinhList) {
        await client.query(
          'INSERT INTO DiaDiem_LoaiHinh (madiadiem, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [maDiaDiem, lh]
        );
      }
    }

    await client.query('COMMIT');
    return getById(maDiaDiem);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const deleteLocation = async (maDiaDiem) => {
  // Chặn xóa các địa điểm gắn liền với mô hình AI
  const protectedIds = [
    'DD0001', 'DD0002', 'DD0003', 'DD0004', 'DD0005',
    'DD0006', 'DD0007', 'DD0008', 'DD0009', 'DD0010'
  ];
  if (protectedIds.includes(maDiaDiem)) {
    const error = new Error('Khong the xoa dia diem gan voi mo hinh AI');
    error.statusCode = 409;
    throw error;
  }

  const result = await query('DELETE FROM DiaDiem WHERE madiadiem = $1 RETURNING madiadiem', [maDiaDiem]);
  return result.rows.length > 0;
};

const createAmenity = async ({ ten, icon = 'check' }) => {
  const result = await query(
    'INSERT INTO TienNghi (ten, icon) VALUES ($1, $2) RETURNING matiennghi, ten, icon',
    [ten, icon]
  );
  return result.rows[0];
};

const updateAmenity = async (maTienNghi, { ten, icon }) => {
  const result = await query(
    'UPDATE TienNghi SET ten = COALESCE($1, ten), icon = COALESCE($2, icon) WHERE matiennghi = $3 RETURNING matiennghi, ten, icon',
    [ten, icon, maTienNghi]
  );
  return result.rows[0] || null;
};

const deleteAmenity = async (maTienNghi) => {
  const result = await query('DELETE FROM TienNghi WHERE matiennghi = $1 RETURNING matiennghi', [maTienNghi]);
  return result.rows.length > 0;
};

const createActivity = async ({ ten, icon = 'sparkles' }) => {
  const result = await query(
    'INSERT INTO HoatDong (ten, icon) VALUES ($1, $2) RETURNING mahoatdong, ten, icon',
    [ten, icon]
  );
  return result.rows[0];
};

const updateActivity = async (maHoatDong, { ten, icon }) => {
  const result = await query(
    'UPDATE HoatDong SET ten = COALESCE($1, ten), icon = COALESCE($2, icon) WHERE mahoatdong = $3 RETURNING mahoatdong, ten, icon',
    [ten, icon, maHoatDong]
  );
  return result.rows[0] || null;
};

const deleteActivity = async (maHoatDong) => {
  const result = await query('DELETE FROM HoatDong WHERE mahoatdong = $1 RETURNING mahoatdong', [maHoatDong]);
  return result.rows.length > 0;
};

module.exports = {
  getAllLocations,
  getById,
  getMultipleByIds,
  getRelatedLocations,
  getAllCategories,
  getAllAmenities,
  getAllActivities,
  createLocation,
  updateLocation,
  deleteLocation,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  createActivity,
  updateActivity,
  deleteActivity,
};

