const { pool, query } = require('../config/db');
const { buildHotelMatchScoreSql } = require('../utils/recommendation');

const getAllHotels = async (
  { maDiaDiem = '', maLoaiHinh = '', minPrice = null, maxPrice = null, soSao = null, search = '', sort = '' } = {},
  currentUserId = null
) => {
  const conditions = [];
  const params = [];

  let userParamIdx = null;
  if (currentUserId) {
    params.push(currentUserId);
    userParamIdx = params.length;
  }

  const { selectFields } = buildHotelMatchScoreSql(userParamIdx, 'ks');

  if (maDiaDiem) {
    params.push(maDiaDiem);
    conditions.push(`ks.madiadiem = $${params.length}`);
  }

  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const pIdx = params.length;
    conditions.push(`(LOWER(ks.ten) LIKE $${pIdx} OR LOWER(COALESCE(ks.diachi, '')) LIKE $${pIdx})`);
  }

  if (minPrice !== null && !isNaN(minPrice)) {
    params.push(parseInt(minPrice, 10));
    conditions.push(`ks.giathamkhao >= $${params.length}`);
  }

  if (maxPrice !== null && !isNaN(maxPrice)) {
    params.push(parseInt(maxPrice, 10));
    conditions.push(`ks.giathamkhao <= $${params.length}`);
  }

  if (soSao !== null && !isNaN(soSao)) {
    params.push(parseFloat(soSao));
    conditions.push(`ks.sosao >= $${params.length}`);
  }

  if (maLoaiHinh) {
    const categories = maLoaiHinh.split(',').map((c) => c.trim()).filter(Boolean);
    if (categories.length > 0) {
      params.push(categories);
      const pIdx = params.length;
      conditions.push(`
        EXISTS (
          SELECT 1 FROM KhachSan_LoaiHinh kl2
          WHERE kl2.makhachsan = ks.makhachsan AND kl2.maloaihinh = ANY($${pIdx})
        )
      `);
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = '';
  if (sort === 'price_asc') {
    orderBy = 'ks.giathamkhao ASC, ks.sosao DESC';
  } else if (sort === 'price_desc') {
    orderBy = 'ks.giathamkhao DESC, ks.sosao DESC';
  } else if (sort === 'rating') {
    orderBy = 'diem_danh_gia DESC, ks.sosao DESC';
  } else {
    orderBy = userParamIdx ? 'match_score DESC, ks.sosao DESC, ks.makhachsan ASC' : 'ks.sosao DESC, ks.makhachsan ASC';
  }

  const sql = `
    SELECT 
      ks.makhachsan,
      ks.madiadiem,
      ks.ten,
      ks.sosao,
      ks.mota,
      ks.vido,
      ks.kinhdo,
      ks.diachi,
      ks.giathamkhao,
      ks.diemnoibat,
      ks.donvitinh,
      ks.booking_url,
      d.ten AS ten_dia_diem,
      d.tinhthanh,
      (
        SELECT media_url 
        FROM MediaKhachSan 
        WHERE makhachsan = ks.makhachsan AND media_type = 'image' 
        ORDER BY thutu ASC LIMIT 1
      ) AS anh_dai_dien,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      COALESCE(
        (
          SELECT ARRAY_AGG(tn.ten ORDER BY kt.thutu ASC)
          FROM KhachSan_TienNghi kt
          JOIN TienNghi tn ON kt.matiennghi = tn.matiennghi
          WHERE kt.makhachsan = ks.makhachsan
        ), ARRAY[]::VARCHAR[]
      ) AS tien_nghi,
      COALESCE(
        (SELECT ROUND(AVG(danhgia), 1) FROM DanhGiaKhachSan WHERE makhachsan = ks.makhachsan AND trangthai = 'Approved'),
        ks.sosao
      ) AS diem_danh_gia,
      COALESCE(
        (SELECT COUNT(*)::INT FROM DanhGiaKhachSan WHERE makhachsan = ks.makhachsan AND trangthai = 'Approved'),
        0
      ) AS so_danh_gia,
      ${userParamIdx ? `EXISTS (SELECT 1 FROM YeuThich yt WHERE yt.manguoidung = $${userParamIdx} AND yt.makhachsan = ks.makhachsan) AS is_favorited,` : 'FALSE AS is_favorited,'}
      ${selectFields}
    FROM KhachSan ks
    JOIN DiaDiem d ON ks.madiadiem = d.madiadiem
    LEFT JOIN KhachSan_LoaiHinh kl ON ks.makhachsan = kl.makhachsan
    LEFT JOIN LoaiHinhDuLich lh ON kl.maloaihinh = lh.maloaihinh
    ${whereClause}
    GROUP BY ks.makhachsan, d.ten, d.tinhthanh
    ORDER BY ${orderBy}
  `;

  const result = await query(sql, params);
  return result.rows.map((row) => ({
    maKhachSan: row.makhachsan,
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    soSao: parseFloat(row.sosao),
    moTa: row.mota,
    viDo: parseFloat(row.vido),
    kinhDo: parseFloat(row.kinhdo),
    diaChi: row.diachi,
    giaThamKhao: parseInt(row.giathamkhao, 10),
    diemNoiBat: row.diemnoibat,
    donViTinh: row.donvitinh,
    bookingUrl: row.booking_url,
    tenDiaDiem: row.ten_dia_diem,
    tinhThanh: row.tinhthanh,
    anhDaiDien: row.anh_dai_dien || '/images/vinh_ha_long.jpg',
    loaiHinh: row.loai_hinh,
    tienNghi: row.tien_nghi,
    diemDanhGia: parseFloat(row.diem_danh_gia),
    soDanhGia: row.so_danh_gia,
    isFavorited: row.is_favorited,
    matchScore: parseInt(row.match_score || 0, 10),
    matchedLoaiHinh: row.matched_loai_hinh || [],
  }));
};

const getById = async (maKhachSan, currentUserId = null) => {
  const params = [maKhachSan];
  let userParamIdx = null;
  if (currentUserId) {
    params.push(currentUserId);
    userParamIdx = params.length;
  }

  const { selectFields } = buildHotelMatchScoreSql(userParamIdx, 'ks');

  const mainSql = `
    SELECT 
      ks.makhachsan,
      ks.madiadiem,
      ks.ten,
      ks.sosao,
      ks.mota,
      ks.vido,
      ks.kinhdo,
      ks.diachi,
      ks.giathamkhao,
      ks.diemnoibat,
      ks.donvitinh,
      ks.booking_url,
      d.ten AS ten_dia_diem,
      d.tinhthanh,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      COALESCE(
        (SELECT ROUND(AVG(danhgia), 1) FROM DanhGiaKhachSan WHERE makhachsan = ks.makhachsan AND trangthai = 'Approved'),
        ks.sosao
      ) AS diem_danh_gia,
      COALESCE(
        (SELECT COUNT(*)::INT FROM DanhGiaKhachSan WHERE makhachsan = ks.makhachsan AND trangthai = 'Approved'),
        0
      ) AS so_danh_gia,
      ${userParamIdx ? `EXISTS (SELECT 1 FROM YeuThich yt WHERE yt.manguoidung = $${userParamIdx} AND yt.makhachsan = ks.makhachsan) AS is_favorited,` : 'FALSE AS is_favorited,'}
      ${selectFields}
    FROM KhachSan ks
    JOIN DiaDiem d ON ks.madiadiem = d.madiadiem
    LEFT JOIN KhachSan_LoaiHinh kl ON ks.makhachsan = kl.makhachsan
    LEFT JOIN LoaiHinhDuLich lh ON kl.maloaihinh = lh.maloaihinh
    WHERE ks.makhachsan = $1
    GROUP BY ks.makhachsan, d.ten, d.tinhthanh
  `;

  const mainRes = await query(mainSql, params);
  if (mainRes.rows.length === 0) return null;
  const row = mainRes.rows[0];

  const mediaRes = await query(
    'SELECT mamediaks, thutu, media_url, media_type FROM MediaKhachSan WHERE makhachsan = $1 ORDER BY thutu ASC',
    [maKhachSan]
  );

  const amenitiesRes = await query(
    `SELECT tn.matiennghi, tn.ten, tn.icon, kt.ghichu, kt.thutu
     FROM KhachSan_TienNghi kt
     JOIN TienNghi tn ON kt.matiennghi = tn.matiennghi
     WHERE kt.makhachsan = $1
     ORDER BY kt.thutu ASC`,
    [maKhachSan]
  );

  const reviewsRes = await query(
    `SELECT dg.madanhgiaks, dg.manguoidung, u.hoten, u.avatar_url, dg.danhgia, dg.binhluan, dg.created_at
     FROM DanhGiaKhachSan dg
     JOIN NguoiDung u ON dg.manguoidung = u.manguoidung
     WHERE dg.makhachsan = $1 AND dg.trangthai = 'Approved'
     ORDER BY dg.created_at DESC`,
    [maKhachSan]
  );

  return {
    maKhachSan: row.makhachsan,
    maDiaDiem: row.madiadiem,
    ten: row.ten,
    soSao: parseFloat(row.sosao),
    moTa: row.mota,
    viDo: parseFloat(row.vido),
    kinhDo: parseFloat(row.kinhdo),
    diaChi: row.diachi,
    giaThamKhao: parseInt(row.giathamkhao, 10),
    diemNoiBat: row.diemnoibat,
    donViTinh: row.donvitinh,
    bookingUrl: row.booking_url,
    tenDiaDiem: row.ten_dia_diem,
    tinhThanh: row.tinhthanh,
    loaiHinh: row.loai_hinh,
    diemDanhGia: parseFloat(row.diem_danh_gia),
    soDanhGia: row.so_danh_gia,
    isFavorited: row.is_favorited,
    matchScore: parseInt(row.match_score || 0, 10),
    matchedLoaiHinh: row.matched_loai_hinh || [],
    media: mediaRes.rows.map((m) => ({
      maMedia: m.mamediaks,
      thuTu: m.thutu,
      url: m.media_url,
      type: m.media_type,
    })),
    tienNghi: amenitiesRes.rows.map((a) => ({
      maTienNghi: a.matiennghi,
      ten: a.ten,
      icon: a.icon,
      ghiChu: a.ghichu,
    })),
    danhGia: reviewsRes.rows.map((r) => ({
      maDanhGia: r.madanhgiaks,
      maNguoiDung: r.manguoidung,
      hoTen: r.hoten,
      avatarUrl: r.avatar_url,
      danhGia: parseFloat(r.danhgia),
      binhLuan: r.binhluan,
      createdAt: r.created_at,
    })),
  };
};

const getSuggestedHotels = async (maDiaDiem, currentUserId = null, limit = 6) => {
  return getAllHotels({ maDiaDiem }, currentUserId).then((list) => list.slice(0, limit));
};

const upsertReview = async (maNguoiDung, maKhachSan, danhGia, binhLuan) => {
  const checkSql = 'SELECT madanhgiaks FROM DanhGiaKhachSan WHERE manguoidung = $1 AND makhachsan = $2';
  const checkRes = await query(checkSql, [maNguoiDung, maKhachSan]);

  if (checkRes.rows.length > 0) {
    const updateSql = `
      UPDATE DanhGiaKhachSan
      SET danhgia = $1, binhluan = $2, trangthai = 'Approved', created_at = CURRENT_TIMESTAMP
      WHERE manguoidung = $3 AND makhachsan = $4
      RETURNING *
    `;
    const res = await query(updateSql, [danhGia, binhLuan, maNguoiDung, maKhachSan]);
    return res.rows[0];
  }

  const insertSql = `
    INSERT INTO DanhGiaKhachSan (manguoidung, makhachsan, danhgia, binhluan, trangthai)
    VALUES ($1, $2, $3, $4, 'Approved')
    RETURNING *
  `;
  const res = await query(insertSql, [maNguoiDung, maKhachSan, danhGia, binhLuan]);
  return res.rows[0];
};

const createHotel = async (data, loaiHinhList = [], tienNghiList = [], mediaList = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO KhachSan (madiadiem, ten, sosao, mota, vido, kinhdo, diachi, giathamkhao, diemnoibat, donvitinh, booking_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const res = await client.query(insertSql, [
      data.maDiaDiem,
      data.ten,
      data.soSao || 5.0,
      data.moTa || null,
      data.viDo || null,
      data.kinhDo || null,
      data.diaChi || null,
      data.giaThamKhao || 0,
      data.diemNoiBat || null,
      data.donViTinh || '/đêm',
      data.bookingUrl,
    ]);

    const newKs = res.rows[0];

    if (Array.isArray(loaiHinhList)) {
      for (const lh of loaiHinhList) {
        await client.query(
          'INSERT INTO KhachSan_LoaiHinh (makhachsan, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [newKs.makhachsan, lh]
        );
      }
    }

    if (Array.isArray(tienNghiList)) {
      for (const tn of tienNghiList) {
        await client.query(
          'INSERT INTO KhachSan_TienNghi (makhachsan, matiennghi, thutu, ghichu) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [newKs.makhachsan, tn.maTienNghi, tn.thuTu || 1, tn.ghiChu || null]
        );
      }
    }

    if (Array.isArray(mediaList)) {
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        await client.query(
          'INSERT INTO MediaKhachSan (makhachsan, thutu, media_url, media_type) VALUES ($1, $2, $3, $4)',
          [newKs.makhachsan, m.thuTu || i + 1, m.url || m, m.type || 'image']
        );
      }
    }

    await client.query('COMMIT');
    return getById(newKs.makhachsan);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateHotel = async (maKhachSan, data, loaiHinhList = null, tienNghiList = null, mediaList = null) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateSql = `
      UPDATE KhachSan
      SET madiadiem = COALESCE($1, madiadiem),
          ten = COALESCE($2, ten),
          sosao = COALESCE($3, sosao),
          mota = COALESCE($4, mota),
          vido = COALESCE($5, vido),
          kinhdo = COALESCE($6, kinhdo),
          diachi = COALESCE($7, diachi),
          giathamkhao = COALESCE($8, giathamkhao),
          diemnoibat = COALESCE($9, diemnoibat),
          donvitinh = COALESCE($10, donvitinh),
          booking_url = COALESCE($11, booking_url)
      WHERE makhachsan = $12
      RETURNING *
    `;
    const res = await client.query(updateSql, [
      data.maDiaDiem,
      data.ten,
      data.soSao,
      data.moTa,
      data.viDo,
      data.kinhDo,
      data.diaChi,
      data.giaThamKhao,
      data.diemNoiBat,
      data.donViTinh,
      data.bookingUrl,
      maKhachSan,
    ]);

    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    if (Array.isArray(loaiHinhList)) {
      await client.query('DELETE FROM KhachSan_LoaiHinh WHERE makhachsan = $1', [maKhachSan]);
      for (const lh of loaiHinhList) {
        await client.query(
          'INSERT INTO KhachSan_LoaiHinh (makhachsan, maloaihinh) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [maKhachSan, lh]
        );
      }
    }

    if (Array.isArray(tienNghiList)) {
      await client.query('DELETE FROM KhachSan_TienNghi WHERE makhachsan = $1', [maKhachSan]);
      for (const tn of tienNghiList) {
        await client.query(
          'INSERT INTO KhachSan_TienNghi (makhachsan, matiennghi, thutu, ghichu) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [maKhachSan, tn.maTienNghi, tn.thuTu || 1, tn.ghiChu || null]
        );
      }
    }

    if (Array.isArray(mediaList)) {
      await client.query('DELETE FROM MediaKhachSan WHERE makhachsan = $1', [maKhachSan]);
      for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i];
        await client.query(
          'INSERT INTO MediaKhachSan (makhachsan, thutu, media_url, media_type) VALUES ($1, $2, $3, $4)',
          [maKhachSan, m.thuTu || i + 1, m.url || m, m.type || 'image']
        );
      }
    }

    await client.query('COMMIT');
    return getById(maKhachSan);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const deleteHotel = async (maKhachSan) => {
  const result = await query('DELETE FROM KhachSan WHERE makhachsan = $1 RETURNING makhachsan', [maKhachSan]);
  return result.rows.length > 0;
};

module.exports = {
  getAllHotels,
  getById,
  getSuggestedHotels,
  upsertReview,
  createHotel,
  updateHotel,
  deleteHotel,
};

