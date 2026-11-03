const interactionModel = require('../models/interactionModel');

const getWishlist = async (req, res) => {
  try {
    const currentUserId = req.user.maNguoiDung;
    const wishlist = await interactionModel.getWishlist(currentUserId);
    return res.status(200).json(wishlist);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const currentUserId = req.user.maNguoiDung;
    const { maDiaDiem, maDiemTQ, maKhachSan } = req.body;

    if (!maDiaDiem && !maDiemTQ && !maKhachSan) {
      return res.status(400).json({
        message: 'Vui long truyen maDiaDiem, maDiemTQ hoac maKhachSan de thay doi trang thai yeu thich',
      });
    }

    const result = await interactionModel.toggleWishlist(currentUserId, {
      maDiaDiem: maDiaDiem || null,
      maDiemTQ: maDiemTQ || null,
      maKhachSan: maKhachSan || null,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getHistory = async (req, res) => {
  try {
    const currentUserId = req.user.maNguoiDung;
    const limit = parseInt(req.query.limit || '20', 10);
    const page = parseInt(req.query.page || '1', 10);
    const offset = (page - 1) * limit;

    const history = await interactionModel.getSearchHistory(currentUserId, limit, offset);
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const currentUserId = req.user.maNguoiDung;
    const { id } = req.params;

    const success = await interactionModel.deleteSearchHistory(id, currentUserId);
    if (!success) {
      return res.status(404).json({ message: 'Khong tim thay ban ghi lich su hoac khong co quyen xoa' });
    }

    return res.status(200).json({ message: 'Xoa ban ghi lich su thanh cong' });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  getHistory,
  deleteHistory,
};

