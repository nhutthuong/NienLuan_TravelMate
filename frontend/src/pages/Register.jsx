import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setIsLoading(true);
    // Giả lập tạo tài khoản & cấp phát JWT (UI Demo)
    setTimeout(() => {
      setIsLoading(false);
      alert('Đăng ký tài khoản thành công! Hãy đăng nhập để tiếp tục.');
      navigate('/login');
    }, 800);
  };

  const handleGoogleSignup = () => {
    alert('Khởi động liên kết Google OAuth2 để tạo tài khoản nhanh (Giao diện Demo)');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 pt-32 pb-16 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] my-4">
        {/* Left Side: Brand & Visual Accent (Tông xanh dương TravelMate) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white hover:text-sky-100 transition-colors group">
              <img src="/traveler_filled_white.png" alt="TravelMate" className="w-9 h-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
              <span className="text-2xl font-extrabold font-heading tracking-wide">TravelMate</span>
            </Link>
            <div className="mt-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100 mb-4 border border-white/20">
                <Sparkles size={13} className="text-amber-300" />
                <span>Trở thành Thành viên (Member)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading leading-snug">
                Bắt đầu hành trình khám phá Việt Nam
              </h2>
              <p className="mt-3 text-sky-100/90 text-sm leading-relaxed">
                Tạo tài khoản để mở khóa toàn bộ quyền năng: lưu trữ lịch sử quét AI, quản lý danh sách yêu thích và nhận gợi ý nghỉ dưỡng độc quyền.
              </p>
            </div>
          </div>

          {/* Benefits list */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-center gap-3 text-sm text-sky-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-emerald-300" />
              </div>
              <span>Miễn phí 100% khi nhận diện với mô hình ResNet50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-sky-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-emerald-300" />
              </div>
              <span>Lưu không giới hạn điểm đến vào Wishlist cá nhân</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-sky-50">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-emerald-300" />
              </div>
              <span>Tích hợp tiện ích chuyển hướng đặt phòng OTA uy tín</span>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center gap-2 text-xs text-sky-100/80">
            <ShieldCheck size={16} className="text-sky-200" />
            <span>Mã hóa thông tin người dùng &amp; chuẩn phân quyền JWT</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800">
                Tạo tài khoản mới
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Điền thông tin hoặc liên kết tài khoản Google trong vài giây
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-slate-700 text-sm shadow-sm group mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng ký nhanh với Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="flex-1 border-t border-slate-200" />
              <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                hoặc đăng ký bằng Email
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Xác nhận
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary mt-0.5"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-primary font-semibold hover:underline">
                      Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a href="#" className="text-primary font-semibold hover:underline">
                      Chính sách bảo mật
                    </a>{' '}
                    của TravelMate
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Đang khởi tạo tài khoản...</span>
                ) : (
                  <>
                    <span>Đăng ký tài khoản</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
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
