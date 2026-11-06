const { query } = require('../config/db');

// ================= 1. YEU THICH (WISHLIST) =================

const getWishlist = async (maNguoiDung) => {
  const locationsSql = `
    SELECT y.mayeuthich, d.madiadiem, d.ten, d.tinhthanh, d.danhhieu, d.anh_url, y.created_at
    FROM YeuThich y
    JOIN DiaDiem d ON y.madiadiem = d.madiadiem
    WHERE y.manguoidung = $1
    ORDER BY y.created_at DESC
  `;
  const attractionsSql = `
    SELECT 
      y.mayeuthich, 
      tq.madiemtq, 
      tq.ten, 
      tq.diachi, 
      d.ten AS ten_dia_diem,
      COALESCE(
        (SELECT media_url FROM MediaDiemThamQuan WHERE madiemtq = tq.madiemtq AND media_type = 'image' ORDER BY thutu ASC LIMIT 1),
        '/images/cau_vang.jpg'
      ) AS anh_dai_dien,
      y.created_at
    FROM YeuThich y
    JOIN DiemThamQuan tq ON y.madiemtq = tq.madiemtq
    JOIN DiaDiem d ON tq.madiadiem = d.madiadiem
    WHERE y.manguoidung = $1
    ORDER BY y.created_at DESC
  `;
  const hotelsSql = `
    SELECT 
      y.mayeuthich, 
      ks.makhachsan, 
      ks.ten, 
      ks.sosao, 
      ks.giathamkhao,
      d.ten AS ten_dia_diem,
      COALESCE(
        (SELECT media_url FROM MediaKhachSan WHERE makhachsan = ks.makhachsan AND media_type = 'image' ORDER BY thutu ASC LIMIT 1),
        '/images/vinh_ha_long.jpg'
      ) AS anh_dai_dien,
      y.created_at
    FROM YeuThich y
    JOIN KhachSan ks ON y.makhachsan = ks.makhachsan
    JOIN DiaDiem d ON ks.madiadiem = d.madiadiem
    WHERE y.manguoidung = $1
    ORDER BY y.created_at DESC
  `;

  const [locsRes, attsRes, hotelsRes] = await Promise.all([
    query(locationsSql, [maNguoiDung]),
    query(attractionsSql, [maNguoiDung]),
    query(hotelsSql, [maNguoiDung]),
  ]);

  return {
    locations: locsRes.rows.map((r) => ({
      maYeuThich: r.mayeuthich,
      maDiaDiem: r.madiadiem,
      ten: r.ten,
      tinhThanh: r.tinhthanh,
      danhHieu: r.danhhieu,
      anhUrl: r.anh_url,
      createdAt: r.created_at,
    })),
    attractions: attsRes.rows.map((r) => ({
      maYeuThich: r.mayeuthich,
      maDiemTQ: r.madiemtq,
      ten: r.ten,
      diaChi: r.diachi,
      tenDiaDiem: r.ten_dia_diem,
      anhDaiDien: r.anh_dai_dien,
      createdAt: r.created_at,
    })),
    hotels: hotelsRes.rows.map((r) => ({
      maYeuThich: r.mayeuthich,
      maKhachSan: r.makhachsan,
      ten: r.ten,
      soSao: parseFloat(r.sosao),
      giaThamKhao: parseInt(r.giathamkhao, 10),
      tenDiaDiem: r.ten_dia_diem,
      anhDaiDien: r.anh_dai_dien,
      createdAt: r.created_at,
    })),
  };
};

const toggleWishlist = async (maNguoiDung, { maDiaDiem = null, maDiemTQ = null, maKhachSan = null }) => {
  let checkSql = '';
  let checkParams = [maNguoiDung];

  if (maDiaDiem) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND madiadiem = $2';
    checkParams.push(maDiaDiem);
  } else if (maDiemTQ) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND madiemtq = $2';
    checkParams.push(maDiemTQ);
  } else if (maKhachSan) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND makhachsan = $2';
    checkParams.push(maKhachSan);
  } else {
    throw new Error('Can truyen maDiaDiem, maDiemTQ hoac maKhachSan de yeu thich');
  }

  const existingRes = await query(checkSql, checkParams);

  if (existingRes.rows.length > 0) {
    await query('DELETE FROM YeuThich WHERE mayeuthich = $1', [existingRes.rows[0].mayeuthich]);
    return { isFavorited: false };
  }

  const insertSql = `
    INSERT INTO YeuThich (manguoidung, madiadiem, madiemtq, makhachsan)
    VALUES ($1, $2, $3, $4)
    RETURNING mayeuthich
  `;
  await query(insertSql, [maNguoiDung, maDiaDiem, maDiemTQ, maKhachSan]);
  return { isFavorited: true };
};

// ================= 2. LICH SU TIM KIEM AI =================

const saveSearchHistory = async (maNguoiDung, maDiaDiem, anhTaiLenUrl, doTinCay, ketQuaTopK, ghiChu = null) => {
  const sql = `
    INSERT INTO LichSuTimKiem (manguoidung, madiadiem, anh_tailen_url, dotincay, ketquatopk, ghichu)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const result = await query(sql, [
    maNguoiDung,
    maDiaDiem,
    anhTaiLenUrl,
    doTinCay,
    JSON.stringify(ketQuaTopK),
    ghiChu,
  ]);
  return result.rows[0];
};

const getSearchHistory = async (maNguoiDung, limit = 20, offset = 0) => {
  const sql = `
    SELECT 
      ls.malstimkiem, 
      ls.madiadiem, 
      d.ten AS ten_dia_diem, 
      d.tinhthanh, 
      d.anh_url AS dia_diem_anh_url,
      ls.anh_tailen_url, 
      ls.dotincay, 
      ls.ketquatopk, 
      ls.ghichu, 
      ls.searched_at
    FROM LichSuTimKiem ls
    JOIN DiaDiem d ON ls.madiadiem = d.madiadiem
    WHERE ls.manguoidung = $1
    ORDER BY ls.searched_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await query(sql, [maNguoiDung, limit, offset]);
  return result.rows.map((r) => ({
    maLSTimKiem: r.malstimkiem,
    maDiaDiem: r.madiadiem,
    tenDiaDiem: r.ten_dia_diem,
    tinhThanh: r.tinhthanh,
    anhTaiLenUrl: r.anh_tailen_url || r.dia_diem_anh_url,
    diaDiemAnhUrl: r.dia_diem_anh_url,
    doTinCay: parseFloat(r.dotincay),
    ketQuaTopK: typeof r.ketquatopk === 'string' ? JSON.parse(r.ketquatopk) : r.ketquatopk,
    ghiChu: r.ghichu,
    searchedAt: r.searched_at,
  }));
};

const deleteSearchHistory = async (maLSTimKiem, maNguoiDung) => {
  const sql = 'DELETE FROM LichSuTimKiem WHERE malstimkiem = $1 AND manguoidung = $2 RETURNING malstimkiem';
  const result = await query(sql, [maLSTimKiem, maNguoiDung]);
  return result.rows.length > 0;
};

// ================= 3. QUAN LY DANH GIA & BINH LUAN (ADMIN) =================

const getAllReviews = async ({
  type = 'all',
  status = 'all',
  rating = 'all',
  search = '',
  page = 1,
  limit = 20,
} = {}) => {
  const offset = (page - 1) * limit;

  const unionSql = `
    SELECT 
      dg.madanhgiaks AS id,
      'hotel' AS target_type,
      dg.makhachsan AS target_id,
      ks.ten AS target_name,
      d.ten AS location_name,
      u.hoten AS user_name,
      u.email AS user_email,
      u.avatar_url AS user_avatar,
      dg.danhgia AS rating,
      dg.binhluan AS comment,
      dg.trangthai AS status,
      dg.created_at AS created_at
    FROM DanhGiaKhachSan dg
    JOIN NguoiDung u ON dg.manguoidung = u.manguoidung
    JOIN KhachSan ks ON dg.makhachsan = ks.makhachsan
    JOIN DiaDiem d ON ks.madiadiem = d.madiadiem

    UNION ALL

    SELECT 
      dg.madanhgiadtq AS id,
      'attraction' AS target_type,
      dg.madiemtq AS target_id,
      tq.ten AS target_name,
      d.ten AS location_name,
      u.hoten AS user_name,
      u.email AS user_email,
      u.avatar_url AS user_avatar,
      dg.danhgia AS rating,
      dg.binhluan AS comment,
      dg.trangthai AS status,
      dg.created_at AS created_at
    FROM DanhGiaDiemTQ dg
    JOIN NguoiDung u ON dg.manguoidung = u.manguoidung
    JOIN DiemThamQuan tq ON dg.madiemtq = tq.madiemtq
    JOIN DiaDiem d ON tq.madiadiem = d.madiadiem
  `;

  const conditions = [];
  const params = [];

  if (type !== 'all' && ['hotel', 'attraction'].includes(type)) {
    params.push(type);
    conditions.push(`r.target_type = $${params.length}`);
  }

  if (status !== 'all' && ['Approved', 'Flagged'].includes(status)) {
    params.push(status);
    conditions.push(`r.status = $${params.length}`);
  }

  if (rating === '5') {
    conditions.push('r.rating >= 5.0');
  } else if (rating === '4') {
    conditions.push('r.rating >= 4.0 AND r.rating < 5.0');
  } else if (rating === '3') {
    conditions.push('r.rating >= 3.0 AND r.rating < 4.0');
  } else if (rating === 'low') {
    conditions.push('r.rating < 3.0');
  }

  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const pIdx = params.length;
    conditions.push(`(
      LOWER(r.user_name) LIKE $${pIdx} OR 
      LOWER(r.user_email) LIKE $${pIdx} OR 
      LOWER(r.target_name) LIKE $${pIdx} OR 
      LOWER(r.location_name) LIKE $${pIdx} OR 
      LOWER(COALESCE(r.comment, '')) LIKE $${pIdx}
    )`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `
    SELECT 
      COUNT(*)::INT AS total,
      COALESCE(ROUND(AVG(rating), 1), 5.0) AS avg_rating,
      COUNT(*) FILTER (WHERE status = 'Flagged')::INT AS flagged_count
    FROM (${unionSql}) r
    ${whereClause}
  `;
  const countRes = await query(countSql, params);
  const total = countRes.rows[0].total;
  const averageRating = parseFloat(countRes.rows[0].avg_rating || 5.0);
  const flaggedCount = countRes.rows[0].flagged_count;

  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const dataSql = `
    SELECT *
    FROM (${unionSql}) r
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `;
  const dataRes = await query(dataSql, params);

  return {
    total,
    flaggedCount,
    averageRating,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: dataRes.rows.map((r) => ({
      id: r.id,
      targetType: r.target_type,
      targetId: r.target_id,
      targetName: r.target_name,
      locationName: r.location_name,
      userName: r.user_name,
      userEmail: r.user_email,
      userAvatar: r.user_avatar,
      rating: parseFloat(r.rating),
      comment: r.comment,
      status: r.status,
      createdAt: r.created_at,
    })),
  };
};

const updateReviewStatus = async (type, id, status) => {
  if (!['Approved', 'Flagged'].includes(status)) {
    throw new Error('Trang thai danh gia phai la Approved hoac Flagged');
  }

  if (type === 'hotel') {
    const res = await query(
      'UPDATE DanhGiaKhachSan SET trangthai = $1 WHERE madanhgiaks = $2 RETURNING madanhgiaks, trangthai',
      [status, id]
    );
    return res.rows[0] || null;
  }

  if (type === 'attraction') {
    const res = await query(
      'UPDATE DanhGiaDiemTQ SET trangthai = $1 WHERE madanhgiadtq = $2 RETURNING madanhgiadtq, trangthai',
      [status, id]
    );
    return res.rows[0] || null;
  }

  throw new Error('Loai danh gia khong hop le (phai la hotel hoac attraction)');
};

const deleteReview = async (type, id) => {
  if (type === 'hotel') {
    const res = await query('DELETE FROM DanhGiaKhachSan WHERE madanhgiaks = $1 RETURNING madanhgiaks', [id]);
    return res.rows.length > 0;
  }

  if (type === 'attraction') {
    const res = await query('DELETE FROM DanhGiaDiemTQ WHERE madanhgiadtq = $1 RETURNING madanhgiadtq', [id]);
    return res.rows.length > 0;
  }

  throw new Error('Loai danh gia khong hop le (phai la hotel hoac attraction)');
};

module.exports = {
  getWishlist,
  toggleWishlist,
  saveSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};

