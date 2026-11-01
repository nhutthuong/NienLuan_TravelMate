const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Vui long dang nhap de thuc hien thao tac nay' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.maNguoiDung;

    const result = await query(
      'SELECT manguoidung, hoten, email, vaitro, trangthai, avatar_url FROM NguoiDung WHERE manguoidung = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Nguoi dung khong ton tai hoac phien lam viec da het han' });
    }

    const user = result.rows[0];

    if (user.trangthai === 'Banned') {
      return res.status(403).json({ message: 'Tai khoan cua ban da bi khoa' });
    }

    req.user = {
      maNguoiDung: user.manguoidung,
      hoTen: user.hoten,
      email: user.email,
      vaiTro: user.vaitro,
      trangThai: user.trangthai,
      avatarUrl: user.avatar_url,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Phien dang nhap khong hop le hoac da het han' });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.maNguoiDung;

    const result = await query(
      'SELECT manguoidung, hoten, email, vaitro, trangthai, avatar_url FROM NguoiDung WHERE manguoidung = $1',
      [userId]
    );

    if (result.rows.length > 0 && result.rows[0].trangthai !== 'Banned') {
      const user = result.rows[0];
      req.user = {
        maNguoiDung: user.manguoidung,
        hoTen: user.hoten,
        email: user.email,
        vaiTro: user.vaitro,
        trangThai: user.trangthai,
        avatarUrl: user.avatar_url,
      };
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.vaiTro !== 'Admin') {
    return res.status(403).json({ message: 'Ban khong co quyen thuc hien thao tac nay' });
  }
  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireAdmin,
};

