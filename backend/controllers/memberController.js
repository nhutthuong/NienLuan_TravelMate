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
    const limit = parseInt(req.query.limit || '100', 10);
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

    const deletedRecord = await interactionModel.deleteSearchHistory(id, currentUserId);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Khong tim thay ban ghi lich su hoac khong co quyen xoa' });
    }

    if (deletedRecord.anh_tailen_url) {
      await interactionModel.deleteHistoryImageFile(deletedRecord.anh_tailen_url);
    }

    return res.status(200).json({ message: 'Xoa ban ghi lich su thanh cong' });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const clearHistory = async (req, res) => {
  try {
    const currentUserId = req.user.maNguoiDung;

    const deletedRecords = await interactionModel.clearAllSearchHistory(currentUserId);
    await interactionModel.cleanOrphanedHistoryImages();

    return res.status(200).json({
      message: 'Xoa toan bo lich su tim kiem thanh cong',
      deletedCount: deletedRecords.length,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updateHistoryNote = async (req, res) => {
  try {
    const currentUserId = req.user.maNguoiDung;
    const { id } = req.params;
    const { ghiChu } = req.body;

    const updated = await interactionModel.updateSearchHistoryNote(
      id,
      currentUserId,
      typeof ghiChu === 'string' ? ghiChu.trim() : null
    );

    if (!updated) {
      return res.status(404).json({ message: 'Khong tim thay ban ghi lich su hoac khong co quyen cap nhat' });
    }

    return res.status(200).json({
      message: 'Cap nhat ghi chu thanh cong',
      maLSTimKiem: updated.malstimkiem,
      ghiChu: updated.ghichu,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  getHistory,
  deleteHistory,
  clearHistory,
  updateHistoryNote,
};

