import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Camera, 
  Hotel, 
  MessageSquare,
  Users, 
  BarChart3, 
  Home, 
  Menu
} from 'lucide-react';

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  setSearchQuery,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  destinationsCount,
  checkInsCount,
  servicesCount,
  reviewsCount,
  usersCount,
  flaggedReviewsCount
}) => {
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchQuery('');
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-gradient-to-b from-sky-800 via-sky-700 to-sky-900 text-white flex flex-col justify-between shrink-0 transition-all duration-300 z-40 shadow-xl select-none overflow-hidden ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Logo & Brand Header */}
        <div className="h-20 shrink-0 flex items-center justify-between px-4 border-b border-white/10 relative">
          {!isSidebarCollapsed ? (
            <>
              <Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity">
                <img
                  src="/traveler_filled_white.png"
                  alt="TravelMate"
                  className="w-7 h-7 object-contain drop-shadow-sm shrink-0"
                />
                <div>
                  <span className="text-lg font-bold font-heading tracking-wide block leading-none">
                    Travel<span className="text-sky-200">Mate</span>
                  </span>
                  <span className="text-[10px] text-sky-200 font-mono uppercase tracking-wider font-semibold">
                    Admin Portal
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Thu gọn menu"
              >
                <Menu size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="w-10 h-10 mx-auto rounded-xl bg-white/10 hover:bg-white/20 p-1 flex items-center justify-center shadow-md transition-all active:scale-95 group relative border border-white/20"
              title="Mở rộng menu quản trị"
            >
              <img src="/favicon.png" alt="TravelMate" className="w-6 h-6 object-contain group-hover:hidden drop-shadow-sm" />
              <Menu size={20} className="text-white hidden group-hover:block" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-sky-200/80 ${isSidebarCollapsed ? 'text-center' : ''}`}>
            {isSidebarCollapsed ? '•••' : 'Quản Lý Nghiệp Vụ'}
          </div>

          {/* Tab 1: 10 Địa danh */}
          <button
            onClick={() => handleTabChange('destinations')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'destinations'
                ? 'bg-white text-sky-800 shadow-md font-bold'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
            title="10 Địa danh ResNet50"
          >
            <MapPin size={20} className={activeTab === 'destinations' ? 'text-sky-700' : 'text-sky-200'} />
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left flex items-center justify-between">
                <span>10 Địa Danh AI</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                  activeTab === 'destinations' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                }`}>
                  {destinationsCount}
                </span>
              </div>
            )}
          </button>

          {/* Tab 2: Điểm Check-in */}
          <button
            onClick={() => handleTabChange('checkins')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'checkins'
                ? 'bg-white text-sky-800 shadow-md font-bold'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
            title="Điểm Check-in & Tham quan"
          >
            <Camera size={20} className={activeTab === 'checkins' ? 'text-sky-700' : 'text-sky-200'} />
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Điểm Check-in</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                  activeTab === 'checkins' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                }`}>
                  {checkInsCount}
                </span>
              </div>
            )}
          </button>

          {/* Tab 3: Khách sạn & Dịch vụ */}
          <button
            onClick={() => handleTabChange('services')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-white text-sky-800 shadow-md font-bold'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
            title="Khách sạn & Dịch vụ"
          >
            <Hotel size={20} className={activeTab === 'services' ? 'text-sky-700' : 'text-sky-200'} />
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Khách Sạn &amp; Dịch Vụ</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                  activeTab === 'services' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                }`}>
                  {servicesCount}
                </span>
              </div>
            )}
          </button>

          {/* Tab 4: Bình luận & Đánh giá (MỚI) */}
          <button
            onClick={() => handleTabChange('reviews')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-white text-sky-800 shadow-md font-bold'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
            title="Bình luận & Đánh giá"
          >
            <MessageSquare size={20} className={activeTab === 'reviews' ? 'text-sky-700' : 'text-sky-200'} />
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Đánh Giá &amp; Bình Luận</span>
                <div className="flex items-center gap-1.5">
                  {flaggedReviewsCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold animate-pulse" title="Cần kiểm duyệt">
                      {flaggedReviewsCount}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                    activeTab === 'reviews' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                  }`}>
                    {reviewsCount}
                  </span>
                </div>
              </div>
            )}
          </button>

          {/* Tab 5: Người dùng */}
          <button
            onClick={() => handleTabChange('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-white text-sky-800 shadow-md font-bold'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
            title="Quản lý Người dùng"
          >
            <Users size={20} className={activeTab === 'users' ? 'text-sky-700' : 'text-sky-200'} />
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Tài Khoản &amp; Quyền</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                  activeTab === 'users' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                }`}>
                  {usersCount}
                </span>
              </div>
            )}
          </button>

          {/* Tab 6: Thống kê ResNet50 */}
          <button
            onClick={() => handleTabChange('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-sky-800 shadow-md font-bold'
                : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}
            title="Thống kê ResNet50"
          >
            <BarChart3 size={20} className={activeTab === 'analytics' ? 'text-sky-700' : 'text-sky-200'} />
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Thống Kê AI</span>
                <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold ${
                  activeTab === 'analytics' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-400/20 text-emerald-200'
                }`}>
                  AI
                </span>
              </div>
            )}
          </button>

          <div className="pt-4 mt-4 border-t border-white/10">
            <div className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-sky-200/80 ${isSidebarCollapsed ? 'text-center' : ''}`}>
              {isSidebarCollapsed ? '•••' : 'Điều Hướng'}
            </div>
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-sky-100 hover:text-white hover:bg-white/10 transition-colors"
              title="Về Trang chủ người dùng"
            >
              <Home size={18} />
              {!isSidebarCollapsed && <span>Trang Chủ Khách</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Footer User info */}
      <div className="p-4 border-t border-white/10 bg-black/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-sky-800 font-bold flex items-center justify-center shrink-0 shadow">
            A
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Admin Quản Trị</p>
              <p className="text-[10px] text-sky-200 truncate">admin@travelmate.vn</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
