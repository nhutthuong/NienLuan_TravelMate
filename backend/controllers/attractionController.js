const attractionModel = require('../models/attractionModel');

const getAttractions = async (req, res) => {
  try {
    const { maDiaDiem, maLoaiHinh, search } = req.query;
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    const attractions = await attractionModel.getAllAttractions(
      {
        maDiaDiem: maDiaDiem || '',
        maLoaiHinh: maLoaiHinh || '',
        search: search || '',
      },
      currentUserId
    );

    return res.status(200).json(attractions);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getAttractionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    const attraction = await attractionModel.getById(id, currentUserId);
    if (!attraction) {
      return res.status(404).json({ message: 'Khong tim thay diem tham quan' });
    }

    return res.status(200).json(attraction);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { danhGia, binhLuan } = req.body;
    const currentUserId = req.user.maNguoiDung;

    const ratingVal = parseFloat(danhGia);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ message: 'Diem danh gia phai la so tu 1.0 den 5.0' });
    }

    const attraction = await attractionModel.getById(id);
    if (!attraction) {
      return res.status(404).json({ message: 'Khong tim thay diem tham quan' });
    }

    const review = await attractionModel.upsertReview(
      currentUserId,
      id,
      ratingVal,
      binhLuan ? binhLuan.trim() : ''
    );

    return res.status(200).json({
      message: 'Gui danh gia thanh cong',
      data: review,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  getAttractions,
  getAttractionDetail,
  addReview,
};

