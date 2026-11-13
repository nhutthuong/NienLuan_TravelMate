const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');

const historyDir = path.join(__dirname, '../uploads/history');

// ================= 1. YEU THICH (WISHLIST) =================

const getWishlist = async (maNguoiDung) => {
  const locationsSql = `
    SELECT 
      y.mayeuthich, 
      d.madiadiem, 
      d.ten, 
      d.tinhthanh, 
      d.danhhieu, 
      d.mota,
      d.anh_url, 
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      y.created_at
    FROM YeuThich y
    JOIN DiaDiem d ON y.madiadiem = d.madiadiem
    LEFT JOIN DiaDiem_LoaiHinh dl ON d.madiadiem = dl.madiadiem
    LEFT JOIN LoaiHinhDuLich lh ON dl.maloaihinh = lh.maloaihinh
    WHERE y.manguoidung = $1
    GROUP BY y.mayeuthich, d.madiadiem, d.ten, d.tinhthanh, d.danhhieu, d.mota, d.anh_url, y.created_at
    ORDER BY y.created_at DESC
  `;
  const attractionsSql = `
    SELECT 
      y.mayeuthich, 
      tq.madiemtq, 
      tq.madiadiem,
      tq.ten, 
      tq.diachi, 
      tq.mota,
      tq.diemnoibat,
      tq.giave,
      tq.giomocua,
      d.ten AS ten_dia_diem,
      d.tinhthanh,
      COALESCE(
        (SELECT media_url FROM MediaDiemThamQuan WHERE madiemtq = tq.madiemtq AND media_type = 'image' ORDER BY thutu ASC LIMIT 1),
        '/images/cau_vang.jpg'
      ) AS anh_dai_dien,
      COALESCE(
        (SELECT ROUND(AVG(danhgia), 1) FROM DanhGiaDiemTQ WHERE madiemtq = tq.madiemtq AND trangthai = 'Approved'),
        5.0
      ) AS diem_danh_gia,
      COALESCE(
        (SELECT COUNT(*)::INT FROM DanhGiaDiemTQ WHERE madiemtq = tq.madiemtq AND trangthai = 'Approved'),
        0
      ) AS so_danh_gia,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      y.created_at
    FROM YeuThich y
    JOIN DiemThamQuan tq ON y.madiemtq = tq.madiemtq
    JOIN DiaDiem d ON tq.madiadiem = d.madiadiem
    LEFT JOIN DiemThamQuan_LoaiHinh tl ON tq.madiemtq = tl.madiemtq
    LEFT JOIN LoaiHinhDuLich lh ON tl.maloaihinh = lh.maloaihinh
    WHERE y.manguoidung = $1
    GROUP BY y.mayeuthich, tq.madiemtq, tq.madiemtq, tq.madiadiem, tq.ten, tq.diachi, tq.mota, tq.diemnoibat, tq.giave, tq.giomocua, d.ten, d.tinhthanh, y.created_at
    ORDER BY y.created_at DESC
  `;
  const hotelsSql = `
    SELECT 
      y.mayeuthich, 
      ks.makhachsan, 
      ks.madiadiem,
      ks.ten, 
      ks.sosao, 
      ks.diachi,
      ks.mota,
      ks.giathamkhao,
      ks.diemnoibat,
      ks.donvitinh,
      ks.booking_url,
      d.ten AS ten_dia_diem,
      d.tinhthanh,
      COALESCE(
        (SELECT media_url FROM MediaKhachSan WHERE makhachsan = ks.makhachsan AND media_type = 'image' ORDER BY thutu ASC LIMIT 1),
        '/images/vinh_ha_long.jpg'
      ) AS anh_dai_dien,
      COALESCE(
        (SELECT ROUND(AVG(danhgia), 1) FROM DanhGiaKhachSan WHERE makhachsan = ks.makhachsan AND trangthai = 'Approved'),
        ks.sosao
      ) AS diem_danh_gia,
      COALESCE(
        (SELECT COUNT(*)::INT FROM DanhGiaKhachSan WHERE makhachsan = ks.makhachsan AND trangthai = 'Approved'),
        0
      ) AS so_danh_gia,
      COALESCE(
        (
          SELECT ARRAY_AGG(tn.ten ORDER BY kt.thutu ASC)
          FROM KhachSan_TienNghi kt
          JOIN TienNghi tn ON kt.matiennghi = tn.matiennghi
          WHERE kt.makhachsan = ks.makhachsan
        ), ARRAY[]::VARCHAR[]
      ) AS tien_nghi,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      y.created_at
    FROM YeuThich y
    JOIN KhachSan ks ON y.makhachsan = ks.makhachsan
    JOIN DiaDiem d ON ks.madiadiem = d.madiadiem
    LEFT JOIN KhachSan_LoaiHinh kl ON ks.makhachsan = kl.makhachsan
    LEFT JOIN LoaiHinhDuLich lh ON kl.maloaihinh = lh.maloaihinh
    WHERE y.manguoidung = $1
    GROUP BY y.mayeuthich, ks.makhachsan, ks.madiadiem, ks.ten, ks.sosao, ks.diachi, ks.mota, ks.giathamkhao, ks.diemnoibat, ks.donvitinh, ks.booking_url, d.ten, d.tinhthanh, y.created_at
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
      tenDiaDiem: r.ten,
      tinhThanh: r.tinhthanh,
      danhHieu: r.danhhieu,
      moTa: r.mota,
      anhUrl: r.anh_url,
      loaiHinh: r.loai_hinh,
      isFavorited: true,
      createdAt: r.created_at,
    })),
    attractions: attsRes.rows.map((r) => ({
      maYeuThich: r.mayeuthich,
      maDiemTQ: r.madiemtq,
      maDiaDiem: r.madiadiem,
      ten: r.ten,
      tenDiem: r.ten,
      diaChi: r.diachi,
      moTa: r.mota,
      diemNoiBat: r.diemnoibat,
      giaVe: r.giave,
      gioMoCua: r.giomocua,
      tenDiaDiem: r.ten_dia_diem,
      tinhThanh: r.tinhthanh,
      anhDaiDien: r.anh_dai_dien,
      diemDanhGia: parseFloat(r.diem_danh_gia),
      soDanhGia: r.so_danh_gia,
      loaiHinh: r.loai_hinh,
      isFavorited: true,
      createdAt: r.created_at,
    })),
    hotels: hotelsRes.rows.map((r) => ({
      maYeuThich: r.mayeuthich,
      maKhachSan: r.makhachsan,
      ten: r.ten,
      tenKhachSan: r.ten,
      soSao: parseFloat(r.sosao),
      diaChi: r.diachi,
      moTa: r.mota,
      giaThamKhao: parseInt(r.giathamkhao, 10),
      diemNoiBat: r.diemnoibat,
      donViTinh: r.donvitinh,
      bookingUrl: r.booking_url,
      tenDiaDiem: r.ten_dia_diem,
      tinhThanh: r.tinhthanh,
      anhDaiDien: r.anh_dai_dien,
      diemDanhGia: parseFloat(r.diem_danh_gia),
      soDanhGia: r.so_danh_gia,
      tienNghi: r.tien_nghi,
      loaiHinh: r.loai_hinh,
      isFavorited: true,
      createdAt: r.created_at,
    })),
  };
};

const toggleWishlist = async (maNguoiDung, { maDiaDiem = null, maDiemTQ = null, maKhachSan = null, maYeuThich = null }) => {
  let checkSql = '';
  let checkParams = [maNguoiDung];

  if (maYeuThich) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND mayeuthich = $2';
    checkParams.push(maYeuThich);
  } else if (maDiemTQ) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND madiemtq = $2';
    checkParams.push(maDiemTQ);
  } else if (maKhachSan) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND makhachsan = $2';
    checkParams.push(maKhachSan);
  } else if (maDiaDiem) {
    checkSql = 'SELECT mayeuthich FROM YeuThich WHERE manguoidung = $1 AND madiadiem = $2';
    checkParams.push(maDiaDiem);
  } else {
    throw new Error('Can truyen maDiaDiem, maDiemTQ, maKhachSan hoac maYeuThich de yeu thich');
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

const removeFromWishlist = async (maNguoiDung, { maDiaDiem = null, maDiemTQ = null, maKhachSan = null, maYeuThich = null }) => {
  if (maYeuThich) {
    const res = await query(
      'DELETE FROM YeuThich WHERE manguoidung = $1 AND mayeuthich = $2 RETURNING mayeuthich',
      [maNguoiDung, maYeuThich]
    );
    return { success: true, isFavorited: false, count: res.rowCount };
  }
  if (maDiemTQ) {
    const res = await query(
      'DELETE FROM YeuThich WHERE manguoidung = $1 AND madiemtq = $2 RETURNING mayeuthich',
      [maNguoiDung, maDiemTQ]
    );
    return { success: true, isFavorited: false, count: res.rowCount };
  }
  if (maKhachSan) {
    const res = await query(
      'DELETE FROM YeuThich WHERE manguoidung = $1 AND makhachsan = $2 RETURNING mayeuthich',
      [maNguoiDung, maKhachSan]
    );
    return { success: true, isFavorited: false, count: res.rowCount };
  }
  if (maDiaDiem) {
    const res = await query(
      'DELETE FROM YeuThich WHERE manguoidung = $1 AND madiadiem = $2 RETURNING mayeuthich',
      [maNguoiDung, maDiaDiem]
    );
    return { success: true, isFavorited: false, count: res.rowCount };
  }
  throw new Error('Can truyen maDiaDiem, maDiemTQ, maKhachSan hoac maYeuThich de xoa yeu thich');
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

const getSearchHistory = async (maNguoiDung, limit = 100, offset = 0) => {
  const sql = `
    SELECT 
      ls.malstimkiem, 
      ls.madiadiem, 
      d.ten AS ten_dia_diem, 
      d.tinhthanh, 
      d.danhhieu,
      d.mota,
      d.thoidiemlytuong,
      d.quymo,
      d.anh_url AS dia_diem_anh_url,
      COALESCE(ARRAY_AGG(DISTINCT lh.ten) FILTER (WHERE lh.ten IS NOT NULL), ARRAY[]::VARCHAR[]) AS loai_hinh,
      ls.anh_tailen_url, 
      ls.dotincay, 
      ls.ketquatopk, 
      ls.ghichu, 
      ls.searched_at
    FROM LichSuTimKiem ls
    LEFT JOIN DiaDiem d ON ls.madiadiem = d.madiadiem
    LEFT JOIN DiaDiem_LoaiHinh dl ON d.madiadiem = dl.madiadiem
    LEFT JOIN LoaiHinhDuLich lh ON dl.maloaihinh = lh.maloaihinh
    WHERE ls.manguoidung = $1
    GROUP BY ls.malstimkiem, ls.madiadiem, d.ten, d.tinhthanh, d.danhhieu, d.mota, d.thoidiemlytuong, d.quymo, d.anh_url, ls.anh_tailen_url, ls.dotincay, ls.ketquatopk, ls.ghichu, ls.searched_at
    ORDER BY ls.searched_at DESC
    LIMIT $2 OFFSET $3
  `;
  const [result, allLocationsRes] = await Promise.all([
    query(sql, [maNguoiDung, limit, offset]),
    query('SELECT madiadiem, ten, tinhthanh, danhhieu, anh_url FROM DiaDiem'),
  ]);

  const locationMap = new Map((allLocationsRes.rows || []).map((loc) => [loc.madiadiem, loc]));

  return result.rows.map((r) => {
    let parsedTopK = typeof r.ketquatopk === 'string' ? JSON.parse(r.ketquatopk) : r.ketquatopk;
    if (Array.isArray(parsedTopK)) {
      parsedTopK = parsedTopK.map((item, idx) => {
        const locDetail = (item.maDiaDiem && locationMap.get(item.maDiaDiem)) || {};
        const locName = item.locationName || item.ten || locDetail.ten || item.label || (idx === 0 ? r.ten_dia_diem : 'Địa danh');
        const conf = typeof item.confidence !== 'undefined'
          ? parseFloat(item.confidence)
          : typeof item.score !== 'undefined'
          ? parseFloat((item.score * 100).toFixed(2))
          : (idx === 0 ? parseFloat(r.dotincay) : 0);

        return {
          ...item,
          maDiaDiem: item.maDiaDiem || locDetail.madiadiem || null,
          locationName: locName,
          ten: locName,
          tinhThanh: item.tinhThanh || locDetail.tinhthanh || '',
          danhHieu: item.danhHieu || locDetail.danhhieu || '',
          anhUrl: item.anhUrl || locDetail.anh_url || '',
          confidence: isNaN(conf) ? 0 : conf,
        };
      });
    }

    return {
      maLSTimKiem: r.malstimkiem,
      maDiaDiem: r.madiadiem,
      tenDiaDiem: r.ten_dia_diem,
      tinhThanh: r.tinhthanh,
      danhHieu: r.danhhieu,
      moTa: r.mota,
      thoiDiemLyTuong: r.thoidiemlytuong,
      quyMo: r.quymo,
      loaiHinh: r.loai_hinh,
      anhTaiLenUrl: r.anh_tailen_url || r.dia_diem_anh_url,
      diaDiemAnhUrl: r.dia_diem_anh_url,
      doTinCay: parseFloat(r.dotincay),
      ketQuaTopK: parsedTopK,
      ghiChu: r.ghichu,
      searchedAt: r.searched_at,
    };
  });
};

const deleteHistoryImageFile = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (!imageUrl.startsWith('/uploads/history/')) return;

  const filename = path.basename(imageUrl);
  if (!filename) return;

  try {
    const checkSql = 'SELECT COUNT(*)::INT as count FROM LichSuTimKiem WHERE anh_tailen_url = $1';
    const checkRes = await query(checkSql, [imageUrl]);
    if (parseInt(checkRes.rows[0]?.count || '0', 10) > 0) {
      return;
    }

    const filePath = path.join(historyDir, filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`[InteractionModel] Da xoa file anh lich su: ${filename}`);
    }
  } catch (err) {
    console.error(`[InteractionModel] Loi khi xoa file anh ${filename}:`, err.message);
  }
};

const cleanOrphanedHistoryImages = async () => {
  try {
    if (!fs.existsSync(historyDir)) return { deletedCount: 0 };

    const res = await query("SELECT DISTINCT anh_tailen_url FROM LichSuTimKiem WHERE anh_tailen_url LIKE '/uploads/history/%'");
    const activeFilenames = new Set(
      res.rows.map((r) => path.basename(r.anh_tailen_url)).filter(Boolean)
    );

    const allFiles = await fs.promises.readdir(historyDir);
    let deletedCount = 0;
    for (const file of allFiles) {
      if (!activeFilenames.has(file)) {
        const fullPath = path.join(historyDir, file);
        try {
          await fs.promises.unlink(fullPath);
          deletedCount++;
          console.log(`[InteractionModel] Da don dep anh khong dung: ${file}`);
        } catch (unlinkErr) {
          console.error(`[InteractionModel] Khong the xoa ${file}:`, unlinkErr.message);
        }
      }
    }
    return { deletedCount };
  } catch (err) {
    console.error('[InteractionModel] Loi khi don dep thu muc history:', err.message);
    return { deletedCount: 0 };
  }
};

const deleteSearchHistory = async (maLSTimKiem, maNguoiDung) => {
  const sql = 'DELETE FROM LichSuTimKiem WHERE malstimkiem = $1 AND manguoidung = $2 RETURNING malstimkiem, anh_tailen_url';
  const result = await query(sql, [maLSTimKiem, maNguoiDung]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

const clearAllSearchHistory = async (maNguoiDung) => {
  const sql = 'DELETE FROM LichSuTimKiem WHERE manguoidung = $1 RETURNING malstimkiem, anh_tailen_url';
  const result = await query(sql, [maNguoiDung]);
  return result.rows;
};

const updateSearchHistoryNote = async (maLSTimKiem, maNguoiDung, ghiChu) => {
  const sql = `
    UPDATE LichSuTimKiem
    SET ghichu = $1
    WHERE malstimkiem = $2 AND manguoidung = $3
    RETURNING malstimkiem, ghichu
  `;
  const result = await query(sql, [ghiChu, maLSTimKiem, maNguoiDung]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
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
  removeFromWishlist,
  saveSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  clearAllSearchHistory,
  updateSearchHistoryNote,
  deleteHistoryImageFile,
  cleanOrphanedHistoryImages,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};

