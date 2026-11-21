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
      COALESCE(ARRAY_AGG(DISTINCT lh.maloaihinh) FILTER (WHERE lh.maloaihinh IS NOT NULL), ARRAY[]::VARCHAR[]) AS ma_loai_hinh,
      COALESCE(
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'maHoatDong', hd.mahoatdong,
              'ten', hd.ten,
              'icon', hd.icon,
              'ghiChu', th.ghichu,
              'thuTu', th.thutu
            ) ORDER BY th.thutu
          )
          FROM DiemThamQuan_HoatDong th
          JOIN HoatDong hd ON th.mahoatdong = hd.mahoatdong
          WHERE th.madiemtq = tq.madiemtq
        ),
        '[]'::JSON
      ) AS hoat_dong,
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
    viDo: row.vido !== null && row.vido !== undefined ? parseFloat(row.vido) : null,
    kinhDo: row.kinhdo !== null && row.kinhdo !== undefined ? parseFloat(row.kinhdo) : null,
    diaChi: row.diachi,
    giaVe: row.giave,
    gioMoCua: row.giomocua,
    diemNoiBat: row.diemnoibat,
    tenDiaDiem: row.ten_dia_diem,
    tinhThanh: row.tinhthanh,
    anhDaiDien: row.anh_dai_dien || '/images/cau_vang.jpg',
    loaiHinh: row.loai_hinh,
    maLoaiHinh: row.ma_loai_hinh,
    hoatDong: typeof row.hoat_dong === 'string' ? JSON.parse(row.hoat_dong) : (row.hoat_dong || []),
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
      COALESCE(ARRAY_AGG(DISTINCT tl.maloaihinh) FILTER (WHERE tl.maloaihinh IS NOT NULL), ARRAY[]::VARCHAR[]) AS ma_loai_hinh,
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
    viDo: row.vido !== null && row.vido !== undefined ? parseFloat(row.vido) : null,
    kinhDo: row.kinhdo !== null && row.kinhdo !== undefined ? parseFloat(row.kinhdo) : null,
    diaChi: row.diachi,
    giaVe: row.giave,
    gioMoCua: row.giomocua,
    diemNoiBat: row.diemnoibat,
    tenDiaDiem: row.ten_dia_diem,
    tinhThanh: row.tinhthanh,
    loaiHinh: row.loai_hinh,
    maLoaiHinh: row.ma_loai_hinh,
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

const addReview = async (maNguoiDung, maDiemTQ, danhGia, binhLuan) => {
  const insertSql = `
    INSERT INTO DanhGiaDiemTQ (manguoidung, madiemtq, danhgia, binhluan, trangthai)
    VALUES ($1, $2, $3, $4, 'Approved')
    RETURNING *
  `;
  const res = await query(insertSql, [maNguoiDung, maDiemTQ, danhGia, binhLuan]);
  return res.rows[0];
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

const updateUserReview = async (maNguoiDung, maDiemTQ, danhGia, binhLuan, maDanhGia = null) => {
  let updateSql;
  let params;
  if (maDanhGia) {
    updateSql = `
      UPDATE DanhGiaDiemTQ
      SET danhgia = $1, binhluan = $2, trangthai = 'Approved', created_at = CURRENT_TIMESTAMP
      WHERE manguoidung = $3 AND madanhgiadtq = $4
      RETURNING *
    `;
    params = [danhGia, binhLuan, maNguoiDung, maDanhGia];
  } else {
    updateSql = `
      UPDATE DanhGiaDiemTQ
      SET danhgia = $1, binhluan = $2, trangthai = 'Approved', created_at = CURRENT_TIMESTAMP
      WHERE manguoidung = $3 AND madiemtq = $4
      RETURNING *
    `;
    params = [danhGia, binhLuan, maNguoiDung, maDiemTQ];
  }
  const res = await query(updateSql, params);
  return res.rows[0] || null;
};

const deleteUserReview = async (maNguoiDung, maDiemTQ, maDanhGia = null) => {
  let deleteSql;
  let params;
  if (maDanhGia) {
    deleteSql = 'DELETE FROM DanhGiaDiemTQ WHERE manguoidung = $1 AND madanhgiadtq = $2 RETURNING *';
    params = [maNguoiDung, maDanhGia];
  } else {
    deleteSql = 'DELETE FROM DanhGiaDiemTQ WHERE manguoidung = $1 AND madiemtq = $2 RETURNING *';
    params = [maNguoiDung, maDiemTQ];
  }
  const res = await query(deleteSql, params);
  return res.rows[0] || null;
};

const createAttraction = async (data, loaiHinhList = [], hoatDongList = [], mediaList = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const viDo = (data.viDo !== undefined && data.viDo !== null && data.viDo !== '' && !isNaN(Number(data.viDo)))
      ? parseFloat(data.viDo)
      : null;
    const kinhDo = (data.kinhDo !== undefined && data.kinhDo !== null && data.kinhDo !== '' && !isNaN(Number(data.kinhDo)))
      ? parseFloat(data.kinhDo)
      : null;

    const insertSql = `
      INSERT INTO DiemThamQuan (madiadiem, ten, mota, vido, kinhdo, diachi, giave, giomocua, diemnoibat)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const res = await client.query(insertSql, [
      data.maDiaDiem,
      data.ten,
      data.moTa || null,
      viDo,
      kinhDo,
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
      for (let i = 0; i < hoatDongList.length; i++) {
        const hd = hoatDongList[i];
        const activityText = (typeof hd === 'string' ? hd : (hd?.ten || hd?.maHoatDong || '')).trim();
        const ghiChu = typeof hd === 'object' ? (hd?.ghiChu || null) : null;
        const thuTu = typeof hd === 'object' ? (hd?.thuTu || i + 1) : i + 1;
        const icon = typeof hd === 'object' ? (hd?.icon || 'sparkles') : 'sparkles';

        if (!activityText) continue;

        let activityId = null;
        if (/^HD\d+$/i.test(activityText)) {
          activityId = activityText.toUpperCase();
        } else {
          // Tìm theo tên trong bảng HoatDong
          const findRes = await client.query('SELECT mahoatdong FROM HoatDong WHERE LOWER(ten) = LOWER($1)', [activityText]);
          if (findRes.rows.length > 0) {
            activityId = findRes.rows[0].mahoatdong;
          } else {
            // Tự động tạo mới vào bảng HoatDong nếu chưa có
            const insertHdRes = await client.query(
              'INSERT INTO HoatDong (ten, icon) VALUES ($1, $2) RETURNING mahoatdong',
              [activityText, icon || 'sparkles']
            );
            activityId = insertHdRes.rows[0].mahoatdong;
          }
        }

        if (activityId) {
          await client.query(
            'INSERT INTO DiemThamQuan_HoatDong (madiemtq, mahoatdong, thutu, ghichu) VALUES ($1, $2, $3, $4) ON CONFLICT (madiemtq, mahoatdong) DO NOTHING',
            [newDtq.madiemtq, activityId, thuTu, ghiChu]
          );
        }
      }
    }

    if (Array.isArray(mediaList)) {
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        const mediaUrl = typeof m === 'string' ? m : (m?.url || m?.mediaUrl || m?.media_url);
        const mediaType = typeof m === 'object' ? (m?.type || m?.mediaType || m?.media_type || 'image') : 'image';
        const thuTu = typeof m === 'object' ? (m?.thuTu || i + 1) : i + 1;
        if (mediaUrl) {
          await client.query(
            'INSERT INTO MediaDiemThamQuan (madiemtq, thutu, media_url, media_type) VALUES ($1, $2, $3, $4)',
            [newDtq.madiemtq, thuTu, mediaUrl, mediaType]
          );
        }
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

    const viDo = (data.viDo !== undefined && data.viDo !== null && data.viDo !== '' && !isNaN(Number(data.viDo)))
      ? parseFloat(data.viDo)
      : null;
    const kinhDo = (data.kinhDo !== undefined && data.kinhDo !== null && data.kinhDo !== '' && !isNaN(Number(data.kinhDo)))
      ? parseFloat(data.kinhDo)
      : null;

    const updateSql = `
      UPDATE DiemThamQuan
      SET madiadiem = COALESCE($1, madiadiem),
          ten = COALESCE($2, ten),
          mota = $3,
          vido = $4,
          kinhdo = $5,
          diachi = $6,
          giave = $7,
          giomocua = $8,
          diemnoibat = $9
      WHERE madiemtq = $10
      RETURNING *
    `;
    const res = await client.query(updateSql, [
      data.maDiaDiem,
      data.ten,
      data.moTa,
      viDo,
      kinhDo,
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
      for (let i = 0; i < hoatDongList.length; i++) {
        const hd = hoatDongList[i];
        const activityText = (typeof hd === 'string' ? hd : (hd?.ten || hd?.maHoatDong || '')).trim();
        const ghiChu = typeof hd === 'object' ? (hd?.ghiChu || null) : null;
        const thuTu = typeof hd === 'object' ? (hd?.thuTu || i + 1) : i + 1;
        const icon = typeof hd === 'object' ? (hd?.icon || 'sparkles') : 'sparkles';

        if (!activityText) continue;

        let activityId = null;
        if (/^HD\d+$/i.test(activityText)) {
          activityId = activityText.toUpperCase();
        } else {
          // Tìm theo tên trong bảng HoatDong
          const findRes = await client.query('SELECT mahoatdong FROM HoatDong WHERE LOWER(ten) = LOWER($1)', [activityText]);
          if (findRes.rows.length > 0) {
            activityId = findRes.rows[0].mahoatdong;
          } else {
            // Tự động tạo mới vào bảng HoatDong nếu chưa có
            const insertHdRes = await client.query(
              'INSERT INTO HoatDong (ten, icon) VALUES ($1, $2) RETURNING mahoatdong',
              [activityText, icon || 'sparkles']
            );
            activityId = insertHdRes.rows[0].mahoatdong;
          }
        }

        if (activityId) {
          await client.query(
            'INSERT INTO DiemThamQuan_HoatDong (madiemtq, mahoatdong, thutu, ghichu) VALUES ($1, $2, $3, $4) ON CONFLICT (madiemtq, mahoatdong) DO NOTHING',
            [maDiemTQ, activityId, thuTu, ghiChu]
          );
        }
      }
    }

    if (Array.isArray(mediaList)) {
      await client.query('DELETE FROM MediaDiemThamQuan WHERE madiemtq = $1', [maDiemTQ]);
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        const mediaUrl = typeof m === 'string' ? m : (m?.url || m?.mediaUrl || m?.media_url);
        const mediaType = typeof m === 'object' ? (m?.type || m?.mediaType || m?.media_type || 'image') : 'image';
        const thuTu = typeof m === 'object' ? (m?.thuTu || i + 1) : i + 1;
        if (mediaUrl) {
          await client.query(
            'INSERT INTO MediaDiemThamQuan (madiemtq, thutu, media_url, media_type) VALUES ($1, $2, $3, $4)',
            [maDiemTQ, thuTu, mediaUrl, mediaType]
          );
        }
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
  addReview,
  upsertReview,
  updateUserReview,
  deleteUserReview,
  createAttraction,
  updateAttraction,
  deleteAttraction,
};

