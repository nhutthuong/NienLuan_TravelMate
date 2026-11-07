import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User as UserIcon,
  Shield,
  KeyRound,
  Calendar,
  Mail,
  Camera,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');

  // Floating notification toast
  const [toast, setToast] = useState(null);

  // Profile form state
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  // Security / Password form state
  const [matKhauHienTai, setMatKhauHienTai] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordApiError, setPasswordApiError] = useState('');

  const isGoogleAccount = user?.phuongThucXacThuc === 'google';

  const showToast = (text, type = 'success', duration = 3000) => {
    setToast({ text, type });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      setHoTen(user.hoTen || '');
      setNgaySinh(user.ngaySinh ? user.ngaySinh.substring(0, 10) : '');
      setAvatarUrl(user.avatarUrl || '');
      setAvatarPreview(user.avatarUrl ? resolveImageUrl(user.avatarUrl) : '');
      setToast(null);
      setProfileErrors({});
      setPasswordErrors({});
      setPasswordApiError('');
      setIsProfileSaved(false);
      setIsPasswordSaved(false);
      setMatKhauHienTai('');
      setMatKhauMoi('');
      setXacNhanMatKhau('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Dung lượng ảnh không được vượt quá 5MB.', 'error');
      return;
    }

    // Local object URL for instant preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    setIsUploadingAvatar(true);

    try {
      const res = await api.auth.uploadAvatar(file);
      if (res?.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
        showToast('Tải ảnh đại diện lên thành công. Bấm "Lưu thông tin hồ sơ" để hoàn tất.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Không thể tải ảnh đại diện lên máy chủ.', 'error');
      setAvatarPreview(user?.avatarUrl ? resolveImageUrl(user.avatarUrl) : '');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Custom Tailwind client validation
    const errors = {};
    if (!hoTen || !hoTen.trim()) {
      errors.hoTen = 'Vui lòng nhập họ và tên của bạn';
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      showToast('Vui lòng kiểm tra lại thông tin hồ sơ.', 'error');
      return;
    }

    setProfileErrors({});
    setIsSavingProfile(true);

    try {
      await updateProfile({
        hoTen: hoTen.trim(),
        ngaySinh: ngaySinh || null,
        avatarUrl: avatarUrl || user?.avatarUrl || null,
      });

      setIsProfileSaved(true);
      showToast('Cập nhật thông tin hồ sơ thành công!', 'success', 2500);

      // Auto close modal after brief confirmation so user returns to updated page
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      showToast(err.message || 'Không thể cập nhật thông tin hồ sơ.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordApiError('');

    if (isGoogleAccount) {
      showToast('Tài khoản Google không sử dụng mật khẩu riêng trên TravelMate.', 'error');
      return;
    }

    // Custom Tailwind client validation without browser tooltips
    const errors = {};
    if (!matKhauHienTai || !matKhauHienTai.trim()) {
      errors.matKhauHienTai = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!matKhauMoi || !matKhauMoi.trim()) {
      errors.matKhauMoi = 'Vui lòng nhập mật khẩu mới';
    } else if (matKhauMoi.length < 6) {
      errors.matKhauMoi = 'Mật khẩu mới phải có tối thiểu 6 ký tự';
    } else if (matKhauMoi === matKhauHienTai) {
      errors.matKhauMoi = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
    }

    if (!xacNhanMatKhau || !xacNhanMatKhau.trim()) {
      errors.xacNhanMatKhau = 'Vui lòng xác nhận lại mật khẩu mới';
    } else if (matKhauMoi && xacNhanMatKhau !== matKhauMoi) {
      errors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp với mật khẩu mới';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsSavingPassword(true);

    try {
      const res = await api.auth.changePassword({
        matKhauHienTai,
        matKhauMoi,
      });

      setIsPasswordSaved(true);
      showToast(res?.message || 'Đổi mật khẩu thành công!', 'success', 2500);
      setMatKhauHienTai('');
      setMatKhauMoi('');
      setXacNhanMatKhau('');

      // Auto close after brief moment
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errorText = err.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.';
      setPasswordApiError(errorText);
      showToast(errorText, 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const formattedCreatedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 relative max-h-[92vh] flex flex-col overflow-hidden font-sans">
        {/* Floating Toast Notification */}
        {toast && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl border flex items-center gap-2.5 transition-all duration-300 animate-slideDown max-w-[90%] ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/20'
                : 'bg-rose-600 text-white border-rose-500 shadow-rose-950/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{toast.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <UserIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800">
                Hồ sơ cá nhân
              </h2>
              <p className="text-xs text-slate-500">
                Quản lý thông tin cá nhân và cài đặt bảo mật tài khoản
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 sm:px-8 bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setPasswordErrors({});
              setPasswordApiError('');
            }}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-sky-600 text-sky-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon size={16} />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('security');
              setProfileErrors({});
            }}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-sky-600 text-sky-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield size={16} />
            <span>Bảo mật &amp; Mật khẩu</span>
            {isGoogleAccount && (
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Google
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto px-6 sm:px-8 py-6 flex-1 space-y-5">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} noValidate className="space-y-5">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="relative group shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={hoTen || 'Avatar'}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md border-2 border-white">
                      {hoTen ? hoTen.charAt(0) : <UserIcon size={32} />}
                    </div>
                  )}

                  {/* Upload button overlay */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    title="Đổi ảnh đại diện"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Camera size={20} />
                        <span className="text-[10px] font-medium mt-1">Đổi ảnh</span>
                      </>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm font-bold text-slate-800">Ảnh đại diện</span>
                    {isGoogleAccount ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <svg className="w-3 h-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        Đồng bộ từ Google
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                        Tài khoản TravelMate
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ định dạng JPG, PNG hoặc WebP. Kích thước tối đa 5MB.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Camera size={14} className="text-slate-500" />
                    <span>{isUploadingAvatar ? 'Đang tải lên...' : 'Tải ảnh mới'}</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={hoTen}
                    onChange={(e) => {
                      setHoTen(e.target.value);
                      if (profileErrors.hoTen) {
                        setProfileErrors((prev) => ({ ...prev, hoTen: null }));
                      }
                    }}
                    placeholder="Nhập họ và tên đầy đủ"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-all ${
                      profileErrors.hoTen
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                </div>
                {profileErrors.hoTen && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium animate-fadeIn">
                    <AlertCircle size={14} className="shrink-0 text-rose-500" />
                    <span>{profileErrors.hoTen}</span>
                  </p>
                )}
              </div>

              {/* Email (Readonly) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Địa chỉ Email
                  </label>
                  <span className="text-[11px] text-slate-400">Email định danh cố định</span>
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày tháng năm sinh
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={ngaySinh}
                    onChange={(e) => setNgaySinh(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Giúp TravelMate gợi ý các hoạt động du lịch phù hợp hơn theo độ tuổi của bạn.
                </p>
              </div>

              {/* Account Meta Info */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Vai trò tài khoản
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {user?.vaiTro === 'Admin' ? 'Quản trị viên (Admin)' : 'Thành viên'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Ngày tham gia
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {formattedCreatedAt || 'Mới tham gia'}
                  </span>
                </div>
              </div>

              {/* Submit Button with Success State */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile || isUploadingAvatar || isProfileSaved}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-80 ${
                    isProfileSaved
                      ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                      : 'bg-primary hover:bg-primary-dark text-white shadow-sky-500/20'
                  }`}
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang lưu thay đổi...</span>
                    </>
                  ) : isProfileSaved ? (
                    <>
                      <CheckCircle2 size={18} className="animate-bounce" />
                      <span>Đã lưu thành công! Đang đóng...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Lưu thông tin hồ sơ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              {isGoogleAccount ? (
                /* Google OAuth Account Notice */
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-sky-50/50 to-white border border-emerald-100 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-emerald-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Xác thực liên kết Google OAuth
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Tài khoản của bạn được liên kết trực tiếp qua hệ sinh thái Google. Bạn không có mật khẩu độc lập trên hệ thống TravelMate, giúp tối đa hóa tính bảo mật và loại bỏ nguy cơ lộ mật khẩu.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-white/80 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Đăng nhập 1 chạm an toàn với Google OpenID Connect</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Bảo vệ bởi cơ chế xác thực 2 lớp (2FA) của Google</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Shield size={16} className="text-sky-600" />
                      <span>Mật khẩu và thông tin bảo mật được quản lý độc quyền bởi Google</span>
                    </div>
                  </div>

                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Quản lý cài đặt bảo mật tài khoản Google</span>
                    <ExternalLink size={14} className="text-slate-400" />
                  </a>
                </div>
              ) : (
                /* Local JWT Email/Password Form */
                <form onSubmit={handleChangePassword} noValidate className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-2.5">
                    <KeyRound size={18} className="text-sky-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-sky-800 leading-relaxed">
                      Để bảo vệ tài khoản, mật khẩu mới phải có tối thiểu 6 ký tự. Hãy chọn mật khẩu mạnh kết hợp chữ cái và chữ số.
                    </p>
                  </div>

                  {passwordApiError && (
                    <div className="p-3.5 text-xs sm:text-sm rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2.5 animate-fadeIn">
                      <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                      <span>{passwordApiError}</span>
                    </div>
                  )}

                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mật khẩu hiện tại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={matKhauHienTai}
                        onChange={(e) => {
                          setMatKhauHienTai(e.target.value);
                          if (passwordErrors.matKhauHienTai) {
                            setPasswordErrors((prev) => ({ ...prev, matKhauHienTai: null }));
                          }
                          if (passwordApiError) setPasswordApiError('');
                        }}
                        placeholder="Nhập mật khẩu hiện tại"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-800 transition-all ${
                          passwordErrors.matKhauHienTai
                            ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordErrors.matKhauHienTai && (
                      <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium animate-fadeIn">
                        <AlertCircle size={14} className="shrink-0 text-rose-500" />
                        <span>{passwordErrors.matKhauHienTai}</span>
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mật khẩu mới <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={matKhauMoi}
                        onChange={(e) => {
                          setMatKhauMoi(e.target.value);
                          if (passwordErrors.matKhauMoi) {
                            setPasswordErrors((prev) => ({ ...prev, matKhauMoi: null }));
                          }
                        }}
                        placeholder="Tối thiểu 6 ký tự"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-800 transition-all ${
                          passwordErrors.matKhauMoi
                            ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordErrors.matKhauMoi && (
                      <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium animate-fadeIn">
                        <AlertCircle size={14} className="shrink-0 text-rose-500" />
                        <span>{passwordErrors.matKhauMoi}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={xacNhanMatKhau}
                        onChange={(e) => {
                          setXacNhanMatKhau(e.target.value);
                          if (passwordErrors.xacNhanMatKhau) {
                            setPasswordErrors((prev) => ({ ...prev, xacNhanMatKhau: null }));
                          }
                        }}
                        placeholder="Nhập lại mật khẩu mới"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-800 transition-all ${
                          passwordErrors.xacNhanMatKhau
                            ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordErrors.xacNhanMatKhau && (
                      <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium animate-fadeIn">
                        <AlertCircle size={14} className="shrink-0 text-rose-500" />
                        <span>{passwordErrors.xacNhanMatKhau}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button with Success State */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingPassword || isPasswordSaved}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-80 ${
                        isPasswordSaved
                          ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                          : 'bg-primary hover:bg-primary-dark text-white shadow-sky-500/20'
                      }`}
                    >
                      {isSavingPassword ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Đang cập nhật mật khẩu...</span>
                        </>
                      ) : isPasswordSaved ? (
                        <>
                          <CheckCircle2 size={18} className="animate-bounce" />
                          <span>Đổi mật khẩu thành công! Đang đóng...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Cập nhật mật khẩu mới</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
