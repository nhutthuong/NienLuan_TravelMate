const userModel = require('../models/userModel');
const locationModel = require('../models/locationModel');
const attractionModel = require('../models/attractionModel');
const hotelModel = require('../models/hotelModel');
const interactionModel = require('../models/interactionModel');

// 1. Thong ke tong quan
const getStats = async (req, res) => {
  try {
    const stats = await userModel.getAdminStats();
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 2. Quan ly nguoi dung
const getUsers = async (req, res) => {
  try {
    const { search, trangThai, page, limit } = req.query;
    const result = await userModel.getAllUsers({
      search: search || '',
      trangThai: trangThai || '',
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;

    if (!['Active', 'Banned'].includes(trangThai)) {
      return res.status(400).json({ message: 'Trang thai khong hop le (phai la Active hoac Banned)' });
    }

    if (id === req.user.maNguoiDung) {
      return res.status(403).json({ message: 'Khong duoc khoa chinh minh' });
    }

    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'Nguoi dung khong ton tai' });
    }

    if (targetUser.vaitro === 'Admin') {
      return res.status(403).json({ message: 'Khong the khoa tai khoan cua Quan tri vien khac' });
    }

    const updatedUser = await userModel.updateStatus(id, trangThai);
    return res.status(200).json({
      message: 'Cap nhat trang thai tai khoan thanh cong',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 3. CRUD Dia diem
const createLocation = async (req, res) => {
  try {
    const { maLoaiHinhList, ...data } = req.body;
    if (!data.ten || !data.tinhThanh || !data.anhUrl) {
      return res.status(400).json({ message: 'Ten, tinh thanh va anhUrl la bat buoc' });
    }
    const newLoc = await locationModel.createLocation(data, maLoaiHinhList || []);
    return res.status(201).json({ message: 'Tao dia diem thanh cong', data: newLoc });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { maLoaiHinhList, ...data } = req.body;
    const updated = await locationModel.updateLocation(id, data, maLoaiHinhList);
    if (!updated) {
      return res.status(404).json({ message: 'Khong tim thay dia diem can cap nhat' });
    }
    return res.status(200).json({ message: 'Cap nhat dia diem thanh cong', data: updated });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await locationModel.deleteLocation(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay dia diem can xoa' });
    }
    return res.status(200).json({ message: 'Xoa dia diem thanh cong' });
  } catch (err) {
    if (err.statusCode === 409 || (err.message && err.message.includes('mo hinh AI'))) {
      return res.status(409).json({ message: 'Khong the xoa dia diem gan voi mo hinh AI' });
    }
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Khong the xoa vi co du lieu khach san/diem tham quan lien quan' });
    }
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 4. CRUD Diem tham quan
const createAttraction = async (req, res) => {
  try {
    const { maLoaiHinhList, hoatDongList, mediaList, ...data } = req.body;
    if (!data.maDiaDiem || !data.ten) {
      return res.status(400).json({ message: 'Ma dia diem va ten diem tham quan la bat buoc' });
    }
    const newAtt = await attractionModel.createAttraction(data, maLoaiHinhList || [], hoatDongList || [], mediaList || []);
    return res.status(201).json({ message: 'Tao diem tham quan thanh cong', data: newAtt });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateAttraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { maLoaiHinhList, hoatDongList, mediaList, ...data } = req.body;
    const updated = await attractionModel.updateAttraction(id, data, maLoaiHinhList, hoatDongList, mediaList);
    if (!updated) {
      return res.status(404).json({ message: 'Khong tim thay diem tham quan can cap nhat' });
    }
    return res.status(200).json({ message: 'Cap nhat diem tham quan thanh cong', data: updated });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteAttraction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await attractionModel.deleteAttraction(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay diem tham quan can xoa' });
    }
    return res.status(200).json({ message: 'Xoa diem tham quan thanh cong' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Khong the xoa vi co du lieu lien quan' });
    }
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 5. CRUD Khach san
const createHotel = async (req, res) => {
  try {
    const { maLoaiHinhList, tienNghiList, mediaList, ...data } = req.body;
    if (!data.maDiaDiem || !data.ten) {
      return res.status(400).json({ message: 'Ma dia diem va ten khach san la bat buoc' });
    }
    const newHot = await hotelModel.createHotel(data, maLoaiHinhList || [], tienNghiList || [], mediaList || []);
    return res.status(201).json({ message: 'Tao khach san thanh cong', data: newHot });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { maLoaiHinhList, tienNghiList, mediaList, ...data } = req.body;
    const updated = await hotelModel.updateHotel(id, data, maLoaiHinhList, tienNghiList, mediaList);
    if (!updated) {
      return res.status(404).json({ message: 'Khong tim thay khach san can cap nhat' });
    }
    return res.status(200).json({ message: 'Cap nhat khach san thanh cong', data: updated });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await hotelModel.deleteHotel(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay khach san can xoa' });
    }
    return res.status(200).json({ message: 'Xoa khach san thanh cong' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Khong the xoa vi co du lieu lien quan' });
    }
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 6. Kiem duyet & Quan ly Danh gia
const getReviews = async (req, res) => {
  try {
    const { type, status, rating, search, page, limit } = req.query;
    const result = await interactionModel.getAllReviews({
      type: type || 'all',
      status: status || 'all',
      rating: rating || 'all',
      search: search || '',
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Flagged'].includes(status)) {
      return res.status(400).json({ message: 'Trang thai danh gia phai la Approved hoac Flagged' });
    }

    const updated = await interactionModel.updateReviewStatus(type, id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Khong tim thay ban ghi danh gia' });
    }

    return res.status(200).json({
      message: 'Cap nhat trang thai danh gia thanh cong',
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { type, id } = req.params;
    const deleted = await interactionModel.deleteReview(type, id);
    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay ban ghi danh gia can xoa' });
    }
    return res.status(200).json({ message: 'Xoa ban ghi danh gia thanh cong' });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 7. Danh muc Tien nghi & Hoat dong
const createAmenity = async (req, res) => {
  try {
    const { ten, icon } = req.body;
    if (!ten || !ten.trim()) {
      return res.status(400).json({ message: 'Ten tien nghi la bat buoc' });
    }
    const item = await locationModel.createAmenity({ ten: ten.trim(), icon });
    return res.status(201).json({ message: 'Tao tien nghi thanh cong', data: item });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, icon } = req.body;
    const item = await locationModel.updateAmenity(id, { ten, icon });
    if (!item) {
      return res.status(404).json({ message: 'Khong tim thay tien nghi can cap nhat' });
    }
    return res.status(200).json({ message: 'Cap nhat tien nghi thanh cong', data: item });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await locationModel.deleteAmenity(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay tien nghi can xoa' });
    }
    return res.status(200).json({ message: 'Xoa tien nghi thanh cong' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Khong the xoa tien nghi dang duoc su dung boi khach san' });
    }
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const createActivity = async (req, res) => {
  try {
    const { ten, icon } = req.body;
    if (!ten || !ten.trim()) {
      return res.status(400).json({ message: 'Ten hoat dong la bat buoc' });
    }
    const item = await locationModel.createActivity({ ten: ten.trim(), icon });
    return res.status(201).json({ message: 'Tao hoat dong thanh cong', data: item });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, icon } = req.body;
    const item = await locationModel.updateActivity(id, { ten, icon });
    if (!item) {
      return res.status(404).json({ message: 'Khong tim thay hoat dong can cap nhat' });
    }
    return res.status(200).json({ message: 'Cap nhat hoat dong thanh cong', data: item });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await locationModel.deleteActivity(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay hoat dong can xoa' });
    }
    return res.status(200).json({ message: 'Xoa hoat dong thanh cong' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Khong the xoa hoat dong dang duoc su dung boi diem tham quan' });
    }
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

// 8. Upload anh
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui long tai len tep anh' });
    }
    const url = `/uploads/media/${req.file.filename}`;
    return res.status(200).json({ url });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserStatus,
  createLocation,
  updateLocation,
  deleteLocation,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  createHotel,
  updateHotel,
  deleteHotel,
  getReviews,
  updateReviewStatus,
  deleteReview,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  createActivity,
  updateActivity,
  deleteActivity,
  uploadImage,
};

