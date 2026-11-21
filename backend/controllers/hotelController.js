const hotelModel = require('../models/hotelModel');

const getHotels = async (req, res) => {
  try {
    const { maDiaDiem, maLoaiHinh, minPrice, maxPrice, soSao, search, sort } = req.query;
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    const hotels = await hotelModel.getAllHotels(
      {
        maDiaDiem: maDiaDiem || '',
        maLoaiHinh: maLoaiHinh || '',
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        soSao: soSao || null,
        search: search || '',
        sort: sort || '',
      },
      currentUserId
    );

    return res.status(200).json(hotels);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getHotelDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    const hotel = await hotelModel.getById(id, currentUserId);
    if (!hotel) {
      return res.status(404).json({ message: 'Khong tim thay khach san' });
    }

    return res.status(200).json(hotel);
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

    const hotel = await hotelModel.getById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Khong tim thay khach san' });
    }

    const review = await hotelModel.addReview(
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

const updateReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { danhGia, binhLuan } = req.body;
    const currentUserId = req.user.maNguoiDung;

    const ratingVal = parseFloat(danhGia);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ message: 'Diem danh gia phai la so tu 1.0 den 5.0' });
    }

    if (!binhLuan || !binhLuan.trim()) {
      return res.status(400).json({ message: 'Noi dung binh luan khong duoc de trong' });
    }

    const review = await hotelModel.updateUserReview(
      currentUserId,
      id,
      ratingVal,
      binhLuan.trim(),
      reviewId || null
    );

    if (!review) {
      return res.status(404).json({ message: 'Khong tim thay danh gia de cap nhat hoac ban khong co quyen' });
    }

    return res.status(200).json({
      message: 'Cap nhat danh gia thanh cong',
      data: review,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const currentUserId = req.user.maNguoiDung;

    const deleted = await hotelModel.deleteUserReview(
      currentUserId,
      id,
      reviewId || null
    );

    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay danh gia de xoa hoac ban khong co quyen' });
    }

    return res.status(200).json({
      message: 'Xoa danh gia thanh cong',
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  getHotels,
  getHotelDetail,
  addReview,
  updateReview,
  deleteReview,
};
