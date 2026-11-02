const { pool, query } = require('../config/db');
const { buildAttractionMatchScoreSql } = require('../utils/recommendation');

const getAllAttractions = async (
  { maDiaDiem = '', maLoaiHinh = '', search = '' } = {},
  currentUserId = null
) => {
  const conditions = [];
  const params = [];

  let userParamIdx = null;
  if (currentUserId) {
    params.push(currentUserId);
    userParamIdx = params.length;
  }

  const { selectFields } = buildAttractionMatchScoreSql(userParamIdx, 'tq');

  if (maDiaDiem) {
    params.push(maDiaDiem);
    conditions.push(`tq.madiadiem = $${params.length}`);
  }

  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const pIdx = params.length;
    conditions.push(`(LOWER(tq.ten) LIKE $${pIdx} OR LOWER(COALESCE(tq.diachi, '')) LIKE $${pIdx})`);
  }

  if (maLoaiHinh) {
    const categories = maLoaiHinh.split(',').map((c) => c.trim()).filter(Boolean);
    if (categories.length > 0) {
      params.push(categories);
      const pIdx = params.length;
      conditions.push(`
        EXISTS (
          SELECT 1 FROM DiemThamQuan_LoaiHinh tl2
          WHERE tl2.madiemtq = tq.madiemtq AND tl2.maloaihinh = ANY($${pIdx})
        )
      `);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      tq.madiemtq,
      tq.madiadiem,
      tq.ten,
      tq.mota,
      tq.vido,
      tq.kinhdo,
      tq.diachi,
      tq.giave,
      tq.giomocua,
      tq.diemnoibat,
      d.ten AS ten_dia_diem,
      d.tinhthanh,
      (
        SELECT media_url 
        FROM MediaDiemThamQuan 
        WHERE madiemtq = tq.madiemtq AND media_type = 'image' 
        ORDER BY thutu ASC LIMIT 1
      ) AS anh_dai_dien,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      COALESCE(
        (SELECT ROUND(AVG(danhgia), 1) FROM DanhGiaDiemTQ WHERE madiemtq = tq.madiemtq AND trangthai = 'Approved'),
        5.0
      ) AS diem_danh_gia,
      COALESCE(
        (SELECT COUNT(*)::INT FROM DanhGiaDiemTQ WHERE madiemtq = tq.madiemtq AND trangthai = 'Approved'),
        0
      ) AS so_danh_gia,
      ${userParamIdx ? `EXISTS (SELECT 1 FROM YeuThich yt WHERE yt.manguoidung = $${userParamIdx} AND yt.madiemtq = tq.madiemtq) AS is_favorited,` : 'FALSE AS is_favorited,'}
      ${selectFields}
    FROM DiemThamQuan tq
    JOIN DiaDiem d ON tq.madiadiem = d.madiadiem
    LEFT JOIN DiemThamQuan_LoaiHinh tl ON tq.madiemtq = tl.madiemtq
    LEFT JOIN LoaiHinhDuLich lh ON tl.maloaihinh = lh.maloaihinh
    ${whereClause}
    GROUP BY tq.madiemtq, d.ten, d.tinhthanh
    ORDER BY ${userParamIdx ? 'match_score DESC,' : ''} diem_danh_gia DESC, tq.madiemtq ASC
  `;

  const result = await query(sql, params);
  return result.rows.map((row) => ({
    maDiemTQ: row.madiemtq,
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    moTa: row.mota,
    viDo: parseFloat(row.vido),
    kinhDo: parseFloat(row.kinhdo),
    diaChi: row.diachi,
    giaVe: row.giave,
    gioMoCua: row.giomocua,
    diemNoiBat: row.diemnoibat,
    tenDiaDiem: row.ten_dia_diem,
    tinhThanh: row.tinhthanh,
    anhDaiDien: row.anh_dai_dien || '/images/cau_vang.jpg',
    loaiHinh: row.loai_hinh,
    diemDanhGia: parseFloat(row.diem_danh_gia),
    soDanhGia: row.so_danh_gia,
    isFavorited: row.is_favorited,
    matchScore: parseInt(row.match_score || 0, 10),
    matchedLoaiHinh: row.matched_loai_hinh || [],
  }));
};

const getById = async (maDiemTQ, currentUserId = null) => {
  const params = [maDiemTQ];
  let userParamIdx = null;
  if (currentUserId) {
    params.push(currentUserId);
    userParamIdx = params.length;
  }

  const { selectFields } = buildAttractionMatchScoreSql(userParamIdx, 'tq');

  const mainSql = `
    SELECT 
      tq.madiemtq,
      tq.madiadiem,
      tq.ten,
      tq.mota,
      tq.vido,
      tq.kinhdo,
      tq.diachi,
      tq.giave,
      tq.giomocua,
      tq.diemnoibat,
      d.ten AS ten_dia_diem,
      d.tinhthanh,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      COALESCE(
        (SELECT ROUND(AVG(danhgia), 1) FROM DanhGiaDiemTQ WHERE madiemtq = tq.madiemtq AND trangthai = 'Approved'),
        5.0
      ) AS diem_danh_gia,
      COALESCE(
        (SELECT COUNT(*)::INT FROM DanhGiaDiemTQ WHERE madiemtq = tq.madiemtq AND trangthai = 'Approved'),
        0
      ) AS so_danh_gia,
      ${userParamIdx ? `EXISTS (SELECT 1 FROM YeuThich yt WHERE yt.manguoidung = $${userParamIdx} AND yt.madiemtq = tq.madiemtq) AS is_favorited,` : 'FALSE AS is_favorited,'}
      ${selectFields}
    FROM DiemThamQuan tq
    JOIN DiaDiem d ON tq.madiadiem = d.madiadiem
    LEFT JOIN DiemThamQuan_LoaiHinh tl ON tq.madiemtq = tl.madiemtq
    LEFT JOIN LoaiHinhDuLich lh ON tl.maloaihinh = lh.maloaihinh
    WHERE tq.madiemtq = $1
    GROUP BY tq.madiemtq, d.ten, d.tinhthanh
  `;

  const mainRes = await query(mainSql, params);
  if (mainRes.rows.length === 0) return null;
  const row = mainRes.rows[0];

  const mediaRes = await query(
    'SELECT mamediadtq, thutu, media_url, media_type FROM MediaDiemThamQuan WHERE madiemtq = $1 ORDER BY thutu ASC',
    [maDiemTQ]
  );

  const activitiesRes = await query(
    `SELECT hd.mahoatdong, hd.ten, hd.icon, th.ghichu, th.thutu
     FROM DiemThamQuan_HoatDong th
     JOIN HoatDong hd ON th.mahoatdong = hd.mahoatdong
     WHERE th.madiemtq = $1
     ORDER BY th.thutu ASC`,
    [maDiemTQ]
  );

  const reviewsRes = await query(
    `SELECT dg.madanhgiadtq, dg.manguoidung, u.hoten, u.avatar_url, dg.danhgia, dg.binhluan, dg.created_at
     FROM DanhGiaDiemTQ dg
     JOIN NguoiDung u ON dg.manguoidung = u.manguoidung
     WHERE dg.madiemtq = $1 AND dg.trangthai = 'Approved'
     ORDER BY dg.created_at DESC`,
    [maDiemTQ]
  );

  return {
    maDiemTQ: row.madiemtq,
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    moTa: row.mota,
    viDo: parseFloat(row.vido),
    kinhDo: parseFloat(row.kinhdo),
    diaChi: row.diachi,
    giaVe: row.giave,
    gioMoCua: row.giomocua,
    diemNoiBat: row.diemnoibat,
    tenDiaDiem: row.ten_dia_diem,
    tinhThanh: row.tinhthanh,
    loaiHinh: row.loai_hinh,
    diemDanhGia: parseFloat(row.diem_danh_gia),
    soDanhGia: row.so_danh_gia,
    isFavorited: row.is_favorited,
    matchScore: parseInt(row.match_score || 0, 10),
    matchedLoaiHinh: row.matched_loai_hinh || [],
    media: mediaRes.rows.map((m) => ({
      maMedia: m.mamediadtq,
      thuTu: m.thutu,
      url: m.media_url,
      type: m.media_type,
    })),
    hoatDong: activitiesRes.rows.map((a) => ({
      maHoatDong: a.mahoatdong,
      ten: a.ten,
      icon: a.icon,
      ghiChu: a.ghichu,
    })),
    danhGia: reviewsRes.rows.map((r) => ({
      maDanhGia: r.madanhgiadtq,
      maNguoiDung: r.manguoidung,
      hoTen: r.hoten,
      avatarUrl: r.avatar_url,
      danhGia: parseFloat(r.danhgia),
      binhLuan: r.binhluan,
      createdAt: r.created_at,
    })),
  };
};

const getSuggestedAttractions = async (maDiaDiem, currentUserId = null, limit = 6) => {
  return getAllAttractions({ maDiaDiem }, currentUserId).then((list) => list.slice(0, limit));
};

const upsertReview = async (maNguoiDung, maDiemTQ, danhGia, binhLuan) => {
  const checkSql = 'SELECT madanhgiadtq FROM DanhGiaDiemTQ WHERE manguoidung = $1 AND madiemtq = $2';
  const checkRes = await query(checkSql, [maNguoiDung, maDiemTQ]);

  if (checkRes.rows.length > 0) {
    const updateSql = `
      UPDATE DanhGiaDiemTQ
      SET danhgia = $1, binhluan = $2, trangthai = 'Approved', created_at = CURRENT_TIMESTAMP
      WHERE manguoidung = $3 AND madiemtq = $4
      RETURNING *
    `;
    const res = await query(updateSql, [danhGia, binhLuan, maNguoiDung, maDiemTQ]);
    return res.rows[0];
  }

  const insertSql = `
    INSERT INTO DanhGiaDiemTQ (manguoidung, madiemtq, danhgia, binhluan, trangthai)
    VALUES ($1, $2, $3, $4, 'Approved')
    RETURNING *
  `;
  const res = await query(insertSql, [maNguoiDung, maDiemTQ, danhGia, binhLuan]);
  return res.rows[0];
};

const createAttraction = async (data, loaiHinhList = [], hoatDongList = [], mediaList = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO DiemThamQuan (madiadiem, ten, mota, vido, kinhdo, diachi, giave, giomocua, diemnoibat)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const res = await client.query(insertSql, [
      data.maDiaDiem,
      data.ten,
      data.moTa || null,
      data.viDo || null,
      data.kinhDo || null,
      data.diaChi || null,
      data.giaVe || null,
      data.gioMoCua || null,
      data.diemNoiBat || null,
    ]);

    const newDtq = res.rows[0];

    if (Array.isArray(loaiHinhList)) {
      for (const lh of loaiHinhList) {
        await client.query(
          'INSERT INTO DiemThamQuan_LoaiHinh (madiemtq, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [newDtq.madiemtq, lh]
        );
      }
    }

    if (Array.isArray(hoatDongList)) {
      for (const hd of hoatDongList) {
        await client.query(
          'INSERT INTO DiemThamQuan_HoatDong (madiemtq, mahoatdong, thutu, ghichu) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [newDtq.madiemtq, hd.maHoatDong, hd.thuTu || 1, hd.ghiChu || null]
        );
      }
    }

    if (Array.isArray(mediaList)) {
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        await client.query(
          'INSERT INTO MediaDiemThamQuan (madiemtq, thutu, media_url, media_type) VALUES ($1, $2, $3, $4)',
          [newDtq.madiemtq, m.thuTu || i + 1, m.url || m, m.type || 'image']
        );
      }
    }

    await client.query('COMMIT');
    return getById(newDtq.madiemtq);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateAttraction = async (maDiemTQ, data, loaiHinhList = null, hoatDongList = null, mediaList = null) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateSql = `
      UPDATE DiemThamQuan
      SET madiadiem = COALESCE($1, madiadiem),
          ten = COALESCE($2, ten),
          mota = COALESCE($3, mota),
          vido = COALESCE($4, vido),
          kinhdo = COALESCE($5, kinhdo),
          diachi = COALESCE($6, diachi),
          giave = COALESCE($7, giave),
          giomocua = COALESCE($8, giomocua),
          diemnoibat = COALESCE($9, diemnoibat)
      WHERE madiemtq = $10
      RETURNING *
    `;
    const res = await client.query(updateSql, [
      data.maDiaDiem,
      data.ten,
      data.moTa,
      data.viDo,
      data.kinhDo,
      data.diaChi,
      data.giaVe,
      data.gioMoCua,
      data.diemNoiBat,
      maDiemTQ,
    ]);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    if (Array.isArray(loaiHinhList)) {
      await client.query('DELETE FROM DiemThamQuan_LoaiHinh WHERE madiemtq = $1', [maDiemTQ]);
      for (const lh of loaiHinhList) {
        await client.query(
          'INSERT INTO DiemThamQuan_LoaiHinh (madiemtq, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [maDiemTQ, lh]
        );
      }
    }

    if (Array.isArray(hoatDongList)) {
      await client.query('DELETE FROM DiemThamQuan_HoatDong WHERE madiemtq = $1', [maDiemTQ]);
      for (const hd of hoatDongList) {
        await client.query(
          'INSERT INTO DiemThamQuan_HoatDong (madiemtq, mahoatdong, thutu, ghichu) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [maDiemTQ, hd.maHoatDong, hd.thuTu || 1, hd.ghiChu || null]
        );
      }
    }

    if (Array.isArray(mediaList)) {
      await client.query('DELETE FROM MediaDiemThamQuan WHERE madiemtq = $1', [maDiemTQ]);
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        await client.query(
          'INSERT INTO MediaDiemThamQuan (madiemtq, thutu, media_url, media_type) VALUES ($1, $2, $3, $4)',
          [maDiemTQ, m.thuTu || i + 1, m.url || m, m.type || 'image']
        );
      }
    }

    await client.query('COMMIT');
    return getById(maDiemTQ);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const deleteAttraction = async (maDiemTQ) => {
  const result = await query('DELETE FROM DiemThamQuan WHERE madiemtq = $1 RETURNING madiemtq', [maDiemTQ]);
  return result.rows.length > 0;
};

module.exports = {
  getAllAttractions,
  getById,
  getSuggestedAttractions,
  upsertReview,
  createAttraction,
  updateAttraction,
  deleteAttraction,
};

