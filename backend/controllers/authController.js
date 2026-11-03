const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const googleAuthService = require('../services/googleAuthService');

const generateToken = (user) => {
  return jwt.sign(
    {
      maNguoiDung: user.manguoidung || user.maNguoiDung,
      vaiTro: user.vaitro || user.vaiTro,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { hoTen, email, matKhau, maLoaiHinhList } = req.body;

    if (!hoTen || !hoTen.trim()) {
      return res.status(400).json({ message: 'Ho ten khong duoc de trong' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email khong duoc de trong' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Dinh dang email khong hop le' });
    }

    if (!matKhau || matKhau.length < 6) {
      return res.status(400).json({ message: 'Mat khau phai co it nhat 6 ky tu' });
    }

    const existingUser = await userModel.findByEmail(email.trim());
    if (existingUser) {
      return res.status(409).json({ message: 'Email da duoc su dung tren he thong' });
    }

    const matKhauHash = await bcrypt.hash(matKhau, 10);

    const newUser = await userModel.createLocal(
      {
        hoTen: hoTen.trim(),
        email: email.trim(),
        matKhauHash,
      },
      Array.isArray(maLoaiHinhList) ? maLoaiHinhList : []
    );

    const token = generateToken(newUser);
    const prefs = await userModel.getPreferences(newUser.manguoidung);

    return res.status(201).json({
      token,
      user: {
        maNguoiDung: newUser.manguoidung,
        hoTen: newUser.hoten,
        email: newUser.email,
        avatarUrl: newUser.avatar_url,
        vaiTro: newUser.vaitro,
        phuongThucXacThuc: newUser.phuongthucxacthuc,
        soThich: prefs.map((p) => p.maloaihinh),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, matKhau } = req.body;

    if (!email || !matKhau) {
      return res.status(400).json({ message: 'Vui long nhap day du email va mat khau' });
    }

    const user = await userModel.findByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ message: 'Email hoac mat khau khong dung' });
    }

    if (!user.matkhau_hash) {
      return res.status(400).json({
        message: 'Tai khoan nay dang nhap bang Google. Vui long chon Dang nhap voi Google.',
      });
    }

    const isMatch = await bcrypt.compare(matKhau, user.matkhau_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoac mat khau khong dung' });
    }

    if (user.trangthai === 'Banned') {
      return res.status(403).json({ message: 'Tai khoan cua ban da bi khoa' });
    }

    const token = generateToken(user);
    const prefs = await userModel.getPreferences(user.manguoidung);

    return res.status(200).json({
      token,
      user: {
        maNguoiDung: user.manguoidung,
        hoTen: user.hoten,
        email: user.email,
        avatarUrl: user.avatar_url,
        vaiTro: user.vaitro,
        phuongThucXacThuc: user.phuongthucxacthuc,
        soThich: prefs.map((p) => p.maloaihinh),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential khong duoc de trong' });
    }

    const googlePayload = await googleAuthService.verifyGoogleToken(credential);

    let user = await userModel.findByGoogleId(googlePayload.googleId);
    let accountLinked = false;
    let isNewUser = false;

    if (!user) {
      user = await userModel.findByEmail(googlePayload.email);

      if (user) {
        if (user.trangthai === 'Banned') {
          return res.status(403).json({ message: 'Tai khoan cua ban da bi khoa' });
        }

        user = await userModel.linkGoogleAccount(
          user.manguoidung,
          googlePayload.googleId,
          googlePayload.picture
        );
        accountLinked = true;
      } else {
        user = await userModel.createGoogle({
          hoTen: googlePayload.name,
          email: googlePayload.email,
          googleId: googlePayload.googleId,
          avatarUrl: googlePayload.picture,
        });
        isNewUser = true;
      }
    }

    if (user.trangthai === 'Banned') {
      return res.status(403).json({ message: 'Tai khoan cua ban da bi khoa' });
    }

    const token = generateToken(user);
    const prefs = await userModel.getPreferences(user.manguoidung);

    return res.status(200).json({
      token,
      accountLinked,
      isNewUser,
      user: {
        maNguoiDung: user.manguoidung,
        hoTen: user.hoten,
        email: user.email,
        avatarUrl: user.avatar_url,
        vaiTro: user.vaitro,
        phuongThucXacThuc: user.phuongthucxacthuc,
        soThich: prefs.map((p) => p.maloaihinh),
      },
    });
  } catch (err) {
    return res.status(401).json({ message: `Xac thuc Google that bai: ${err.message}` });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.maNguoiDung);
    if (!user) {
      return res.status(404).json({ message: 'Khong tim thay nguoi dung' });
    }

    const prefs = await userModel.getPreferences(req.user.maNguoiDung);

    return res.status(200).json({
      maNguoiDung: user.manguoidung,
      hoTen: user.hoten,
      email: user.email,
      avatarUrl: user.avatar_url,
      vaiTro: user.vaitro,
      trangThai: user.trangthai,
      phuongThucXacThuc: user.phuongthucxacthuc,
      soThich: prefs.map((p) => p.maloaihinh),
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { maLoaiHinhList } = req.body;

    if (!Array.isArray(maLoaiHinhList)) {
      return res.status(400).json({ message: 'maLoaiHinhList phai la mot mang cac ma loai hinh' });
    }

    await userModel.updatePreferences(req.user.maNguoiDung, maLoaiHinhList);
    const updatedPrefs = await userModel.getPreferences(req.user.maNguoiDung);

    return res.status(200).json({
      message: 'Cap nhat so thich thanh cong',
      soThich: updatedPrefs.map((p) => p.maloaihinh),
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  updatePreferences,
};

