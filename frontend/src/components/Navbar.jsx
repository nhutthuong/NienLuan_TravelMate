import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PreferencesModal from './PreferencesModal';
import ProfileModal from './ProfileModal';
import {
  Sparkles,
  Heart,
  History,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';

const resolveAvatarUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const isSolid = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto prompt preferences modal for new users with empty preferences
  useEffect(() => {
    if (isAuthenticated && user && (!user.soThich || user.soThich.length === 0)) {
      const prompted = localStorage.getItem(`pref_prompted_${user.maNguoiDung}`);
      if (!prompted) {
        setIsPrefModalOpen(true);
        localStorage.setItem(`pref_prompted_${user.maNguoiDung}`, 'true');
      }
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isSolid ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'h-20' : 'h-24'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group transition-all active:scale-95 py-2">
            <img
              src={isSolid ? '/traveler_filled.png' : '/traveler_filled_white.png'}
              alt="TravelMate Emblem"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
            />
            <span
              className={`text-2xl sm:text-[26px] font-heading font-extrabold tracking-tight transition-colors duration-300 ${
                isSolid ? 'text-sky-900' : 'text-white drop-shadow-md'
              }`}
            >
              Travel<span className={isSolid ? 'text-sky-600' : 'text-sky-300'}>Mate</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-semibold transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary py-1'
                    : isSolid
                    ? 'text-slate-700 hover:text-primary'
                    : 'text-white hover:text-slate-200 drop-shadow-md'
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `text-base font-semibold transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary py-1'
                    : isSolid
                    ? 'text-slate-700 hover:text-primary'
                    : 'text-white hover:text-slate-200 drop-shadow-md'
                }`
              }
            >
              Khám phá
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `text-base font-semibold transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary py-1'
                    : isSolid
                    ? 'text-slate-700 hover:text-primary'
                    : 'text-white hover:text-slate-200 drop-shadow-md'
                }`
              }
            >
              Yêu thích
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-base font-semibold transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary py-1'
                    : isSolid
                    ? 'text-slate-700 hover:text-primary'
                    : 'text-white hover:text-slate-200 drop-shadow-md'
                }`
              }
            >
              Lịch sử tìm kiếm
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-primary border-b-2 border-primary py-1'
                      : isSolid
                      ? 'text-slate-700 hover:text-primary'
                      : 'text-white hover:text-slate-200 drop-shadow-md'
                  }`
                }
              >
                Quản trị
              </NavLink>
            )}
          </nav>

          {/* Right Action: Auth or Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all ${
                    isSolid
                      ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={resolveAvatarUrl(user.avatarUrl)}
                      alt={user.hoTen}
                      className="w-8 h-8 rounded-full object-cover border border-white/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user?.hoTen ? user.hoTen.charAt(0) : <UserIcon size={16} />}
                    </div>
                  )}
                  <span
                    className={`text-sm font-semibold max-w-[130px] truncate ${
                      isSolid ? 'text-slate-800' : 'text-white'
                    }`}
                  >
                    {user?.hoTen || 'Thành viên'}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    } ${isSolid ? 'text-slate-500' : 'text-white/80'}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn font-sans">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Đăng nhập với tư cách</p>
                      <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{user?.hoTen}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                        {user?.vaiTro === 'Admin' ? 'Quản trị viên' : 'Thành viên'}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors text-left"
                      >
                        <UserIcon size={16} className="text-sky-600" />
                        <span>Hồ sơ cá nhân</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsPrefModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors text-left"
                      >
                        <Sparkles size={16} className="text-sky-600" />
                        <span>Sở thích của tôi</span>
                      </button>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors"
                      >
                        <Heart size={16} className="text-rose-500" />
                        <span>Danh sách yêu thích</span>
                      </Link>

                      <Link
                        to="/history"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors"
                      >
                        <History size={16} className="text-amber-500" />
                        <span>Lịch sử nhận diện</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors"
                        >
                          <Shield size={16} className="text-indigo-600" />
                          <span>Bảng điều khiển Quản trị</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  to="/register"
                  className={`text-base font-semibold transition-colors ${
                    isSolid ? 'text-slate-700 hover:text-primary' : 'text-white hover:text-slate-200 drop-shadow-md'
                  }`}
                >
                  Đăng ký
                </Link>
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-md"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isSolid ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-5 space-y-4 shadow-xl font-sans">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-primary"
              >
                Trang chủ
              </Link>
              <Link
                to="/explore"
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-primary"
              >
                Khám phá
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-primary"
              >
                Yêu thích
              </Link>
              <Link
                to="/history"
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-primary"
              >
                Lịch sử tìm kiếm
              </Link>
              {isAuthenticated && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="text-left text-base font-semibold text-sky-600 flex items-center gap-2"
                  >
                    <UserIcon size={16} />
                    <span>Hồ sơ cá nhân</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsPrefModalOpen(true);
                    }}
                    className="text-left text-base font-semibold text-sky-600 flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Sở thích của tôi</span>
                  </button>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-semibold text-indigo-600"
                >
                  Quản trị
                </Link>
              )}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    {user?.avatarUrl ? (
                      <img
                        src={resolveAvatarUrl(user.avatarUrl)}
                        alt={user.hoTen}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user?.hoTen?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user?.hoTen}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
