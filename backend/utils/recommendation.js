/**
 * Tien ich ho tro tinh toan do phu hop theo so thich nguoi dung (Content-based Filtering)
 */

const buildLocationMatchScoreSql = (userParamIndex) => {
  if (!userParamIndex) {
    return {
      selectFields: `
        0 AS match_score,
        ARRAY[]::TEXT[] AS matched_loai_hinh
      `,
      joinClause: '',
    };
  }

  return {
    selectFields: `
      COALESCE(
        (
          SELECT COUNT(DISTINCT dl.MaLoaiHinh)::INT
          FROM DiaDiem_LoaiHinh dl
          JOIN SoThichNguoiDung st ON dl.MaLoaiHinh = st.MaLoaiHinh
          WHERE dl.MaDiaDiem = d.MaDiaDiem AND st.MaNguoiDung = $${userParamIndex}
        ), 0
      ) AS match_score,
      COALESCE(
        (
          SELECT ARRAY_AGG(lh.Ten)
          FROM DiaDiem_LoaiHinh dl
          JOIN SoThichNguoiDung st ON dl.MaLoaiHinh = st.MaLoaiHinh
          JOIN LoaiHinhDuLich lh ON dl.MaLoaiHinh = lh.MaLoaiHinh
          WHERE dl.MaDiaDiem = d.MaDiaDiem AND st.MaNguoiDung = $${userParamIndex}
        ), ARRAY[]::VARCHAR[]
      ) AS matched_loai_hinh
    `,
  };
};

const buildAttractionMatchScoreSql = (userParamIndex, attractionAlias = 'tq') => {
  if (!userParamIndex) {
    return {
      selectFields: `
        0 AS match_score,
        ARRAY[]::TEXT[] AS matched_loai_hinh
      `,
    };
  }

  return {
    selectFields: `
      COALESCE(
        (
          SELECT COUNT(DISTINCT tl.MaLoaiHinh)::INT
          FROM DiemThamQuan_LoaiHinh tl
          JOIN SoThichNguoiDung st ON tl.MaLoaiHinh = st.MaLoaiHinh
          WHERE tl.MaDiemTQ = ${attractionAlias}.MaDiemTQ AND st.MaNguoiDung = $${userParamIndex}
        ), 0
      ) AS match_score,
      COALESCE(
        (
          SELECT ARRAY_AGG(lh.Ten)
          FROM DiemThamQuan_LoaiHinh tl
          JOIN SoThichNguoiDung st ON tl.MaLoaiHinh = st.MaLoaiHinh
          JOIN LoaiHinhDuLich lh ON tl.MaLoaiHinh = lh.MaLoaiHinh
          WHERE tl.MaDiemTQ = ${attractionAlias}.MaDiemTQ AND st.MaNguoiDung = $${userParamIndex}
        ), ARRAY[]::VARCHAR[]
      ) AS matched_loai_hinh
    `,
  };
};

const buildHotelMatchScoreSql = (userParamIndex, hotelAlias = 'ks') => {
  if (!userParamIndex) {
    return {
      selectFields: `
        0 AS match_score,
        ARRAY[]::TEXT[] AS matched_loai_hinh
      `,
    };
  }

  return {
    selectFields: `
      COALESCE(
        (
          SELECT COUNT(DISTINCT kl.MaLoaiHinh)::INT
          FROM KhachSan_LoaiHinh kl
          JOIN SoThichNguoiDung st ON kl.MaLoaiHinh = st.MaLoaiHinh
          WHERE kl.MaKhachSan = ${hotelAlias}.MaKhachSan AND st.MaNguoiDung = $${userParamIndex}
        ), 0
      ) AS match_score,
      COALESCE(
        (
          SELECT ARRAY_AGG(lh.Ten)
          FROM KhachSan_LoaiHinh kl
          JOIN SoThichNguoiDung st ON kl.MaLoaiHinh = st.MaLoaiHinh
          JOIN LoaiHinhDuLich lh ON kl.MaLoaiHinh = lh.MaLoaiHinh
          WHERE kl.MaKhachSan = ${hotelAlias}.MaKhachSan AND st.MaNguoiDung = $${userParamIndex}
        ), ARRAY[]::VARCHAR[]
      ) AS matched_loai_hinh
    `,
  };
};

module.exports = {
  buildLocationMatchScoreSql,
  buildAttractionMatchScoreSql,
  buildHotelMatchScoreSql,
};

