import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-20' : 'h-24'}`}>
        <Link to="/" className="flex items-center gap-2.5 group transition-all active:scale-95 py-2">
          <img
            src={isSolid ? "/traveler_filled.png" : "/traveler_filled_white.png"}
            alt="TravelMate Emblem"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
          />
          <span className={`text-2xl sm:text-[26px] font-heading font-extrabold tracking-tight transition-colors duration-300 ${
            isSolid ? 'text-sky-900' : 'text-white drop-shadow-md'
          }`}>
            Travel<span className={isSolid ? 'text-sky-600' : 'text-sky-300'}>Mate</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => `text-base font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary py-1" : (isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-slate-200 drop-shadow-md")}`}>
            Trang chủ
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `text-base font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary py-1" : (isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-slate-200 drop-shadow-md")}`}>
            Khám phá
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => `text-base font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary py-1" : (isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-slate-200 drop-shadow-md")}`}>
            Yêu thích
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `text-base font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary py-1" : (isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-slate-200 drop-shadow-md")}`}>
            Lịch sử tìm kiếm
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `text-base font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary py-1" : (isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-slate-200 drop-shadow-md")}`}>
            Quản trị
          </NavLink>
        </nav>
        <div className="flex items-center gap-6">
          <Link to="/register" className={`text-base font-semibold transition-colors ${isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-slate-200 drop-shadow-md"}`}>Đăng ký</Link>
          <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-md">Đăng nhập</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
