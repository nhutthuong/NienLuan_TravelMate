import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên tối thiểu 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Định dạng email không hợp lệ (ví dụ: nguyenvana@gmail.com)';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có tối thiểu 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        hoTen: formData.fullName.trim(),
        email: formData.email.trim(),
        matKhau: formData.password,
        maLoaiHinhList: [],
      });

      navigate('/', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký tài khoản thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback((res) => {
    if (res.accountLinked) {
      alert('Tài khoản đã được liên kết với Google. Từ nay vui lòng đăng nhập bằng Google.');
    }
    navigate('/', { replace: true });
  }, [navigate]);

  const handleGoogleError = useCallback((err) => {
    setErrorMsg(err.message || 'Xác thực Google thất bại');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 pt-20 pb-4 font-sans">
      <div className="max-w-4xl lg:max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        {/* Left Side: Brand Accent */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white hover:text-sky-100 transition-colors group">
              <img src="/traveler_filled_white.png" alt="TravelMate" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl sm:text-2xl font-extrabold font-heading tracking-wide">TravelMate</span>
            </Link>
            <div className="mt-5 sm:mt-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100 mb-3 border border-white/20">
                <Sparkles size={13} className="text-amber-300" />
                <span>Trở thành Thành viên (Member)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading leading-snug">
                Bắt đầu hành trình khám phá Việt Nam
              </h2>
              <p className="mt-2 text-sky-100/90 text-xs sm:text-sm leading-relaxed">
                Tạo tài khoản để mở khóa toàn bộ quyền năng: lưu trữ lịch sử quét AI, quản lý danh sách yêu thích và nhận gợi ý nghỉ dưỡng độc quyền.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-2.5 my-5 sm:my-6">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-sky-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={13} className="text-emerald-300" />
              </div>
              <span>Miễn phí 100% khi nhận diện với mô hình ResNet50</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-sky-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={13} className="text-emerald-300" />
              </div>
              <span>Lưu không giới hạn điểm đến vào Wishlist cá nhân</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-sky-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={13} className="text-emerald-300" />
              </div>
              <span>Tích hợp tiện ích chuyển hướng đặt phòng OTA uy tín</span>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center gap-2 text-xs text-sky-100/80">
            <ShieldCheck size={15} className="text-sky-200" />
            <span>Mã hóa thông tin người dùng &amp; chuẩn phân quyền JWT</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-4 sm:mb-5">
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-800">
                Tạo tài khoản mới
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Điền thông tin hoặc liên kết tài khoản Google trong vài giây
              </p>
            </div>

            {errorMsg && (
              <div className="mb-3.5 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs sm:text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <div className="mb-3.5">
              <GoogleSignInButton
                text="signup_with"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="flex-1 border-t border-slate-200" />
              <span className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                hoặc đăng ký bằng Email
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      errors.fullName ? 'text-rose-500' : 'text-slate-400'
                    }`}
                    size={17}
                  />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/20 text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      errors.email ? 'text-rose-500' : 'text-slate-400'
                    }`}
                    size={17}
                  />
                  <input
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/20 text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                        errors.password ? 'text-rose-500' : 'text-slate-400'
                      }`}
                      size={17}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      className={`w-full pl-10 pr-9 py-2 rounded-xl border text-sm outline-none transition-all ${
                        errors.password
                          ? 'border-rose-400 bg-rose-50/20 text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Xác nhận
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                        errors.confirmPassword ? 'text-rose-500' : 'text-slate-400'
                      }`}
                      size={17}
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      className={`w-full pl-10 pr-9 py-2 rounded-xl border text-sm outline-none transition-all ${
                        errors.confirmPassword
                          ? 'border-rose-400 bg-rose-50/20 text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-0.5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeTerms: e.target.checked });
                      if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                    }}
                    className="w-3.5 h-3.5 text-primary rounded border-slate-300 focus:ring-primary mt-0.5"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-primary font-semibold hover:underline">
                      Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a href="#" className="text-primary font-semibold hover:underline">
                      Chính sách bảo mật
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.agreeTerms}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 mt-1 shadow-md hover:shadow-lg disabled:opacity-70 font-semibold transition-all text-sm"
              >
                {isLoading ? (
                  <span>Đang khởi tạo tài khoản...</span>
                ) : (
                  <>
                    <span>Đăng ký tài khoản</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 sm:mt-5 text-center text-xs sm:text-sm text-slate-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
