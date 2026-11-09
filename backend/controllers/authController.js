const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const googleAuthService = require('../services/googleAuthService');
const { deleteAvatarFile, cleanupUnusedAvatars } = require('../utils/avatarStorage');

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
    const googleToken = req.body.credential || req.body.accessToken || req.body.token;

    if (!googleToken) {
      return res.status(400).json({ message: 'Google credential / access token khong duoc de trong' });
    }

    const googlePayload = await googleAuthService.verifyGoogleToken(googleToken);

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
      ngaySinh: user.ngaysinh,
      vaiTro: user.vaitro,
      trangThai: user.trangthai,
      phuongThucXacThuc: user.phuongthucxacthuc,
      createdAt: user.created_at,
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

const updateProfile = async (req, res) => {
  try {
    const { hoTen, avatarUrl, ngaySinh } = req.body;
    const maNguoiDung = req.user.maNguoiDung;

    if (hoTen !== undefined && !hoTen.trim()) {
      return res.status(400).json({ message: 'Họ tên không được để trống' });
    }

    // Lấy thông tin người dùng hiện tại trước khi cập nhật
    const currentUser = await userModel.findById(maNguoiDung);
    if (!currentUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    const oldAvatarUrl = currentUser.avatar_url;

    // Chuẩn hóa avatarUrl: nếu rỗng thì chuyển thành null
    const normalizedAvatarUrl =
      avatarUrl !== undefined
        ? avatarUrl && String(avatarUrl).trim()
          ? String(avatarUrl).trim()
          : null
        : undefined;

    const updatedUser = await userModel.updateProfile(maNguoiDung, {
      hoTen,
      avatarUrl: normalizedAvatarUrl,
      ngaySinh,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không thể cập nhật hồ sơ người dùng' });
    }

    // Nếu người dùng đổi avatar hoặc gỡ bỏ avatar (không sử dụng nữa):
    // Xóa file avatar cũ khỏi thư mục uploads/avatars để không tốn dung lượng
    if (normalizedAvatarUrl !== undefined && normalizedAvatarUrl !== oldAvatarUrl && oldAvatarUrl) {
      await deleteAvatarFile(oldAvatarUrl);
    }

    // Dọn dẹp bất kỳ avatar rác nào không còn ai sử dụng trong hệ thống
    cleanupUnusedAvatars().catch((err) => {
      console.error('[Avatar Cleanup] Lỗi quét dọn tự động:', err.message);
    });

    const prefs = await userModel.getPreferences(maNguoiDung);

    return res.status(200).json({
      message: 'Cập nhật thông tin hồ sơ thành công',
      user: {
        maNguoiDung: updatedUser.manguoidung,
        hoTen: updatedUser.hoten,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatar_url,
        ngaySinh: updatedUser.ngaysinh,
        vaiTro: updatedUser.vaitro,
        trangThai: updatedUser.trangthai,
        phuongThucXacThuc: updatedUser.phuongthucxacthuc,
        createdAt: updatedUser.created_at,
        soThich: prefs.map((p) => p.maloaihinh),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: `Lỗi máy chủ: ${err.message}` });
  }
};

const changePassword = async (req, res) => {
  try {
    const { matKhauHienTai, matKhauMoi } = req.body;
    const maNguoiDung = req.user.maNguoiDung;

    const user = await userModel.findById(maNguoiDung);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Đảm bảo phân biệt tài khoản Google OAuth với tài khoản mật khẩu
    if (user.phuongthucxacthuc !== 'local' || !user.matkhau_hash) {
      return res.status(400).json({
        message: 'Tài khoản của bạn đăng nhập thông qua Google OAuth. Bạn không cần và không thể đặt mật khẩu riêng trên TravelMate.',
      });
    }

    if (!matKhauHienTai || !matKhauMoi) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới' });
    }

    if (matKhauMoi.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const isMatch = await bcrypt.compare(matKhauHienTai, user.matkhau_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }

    const newHash = await bcrypt.hash(matKhauMoi, 10);
    await userModel.updatePassword(maNguoiDung, newHash);

    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    return res.status(500).json({ message: `Lỗi máy chủ: ${err.message}` });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn tệp hình ảnh' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    return res.status(200).json({
      message: 'Tải ảnh đại diện thành công',
      avatarUrl,
    });
  } catch (err) {
    return res.status(500).json({ message: `Lỗi tải ảnh đại diện: ${err.message}` });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  updatePreferences,
  updateProfile,
  changePassword,
  uploadAvatar,
};

