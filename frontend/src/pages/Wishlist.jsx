import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  ChevronDown, 
  Map, 
  Compass, 
  Hotel, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import api from '../services/api';
import DestinationCard from '../components/explore/DestinationCard';
import HotelCard from '../components/explore/HotelCard';
import AttractionCard from '../components/location/AttractionCard';

const resolveImageUrl = (url, fallbackUrl = '/images/vinh_ha_long.jpg') => {
  if (!url || typeof url !== 'string' || url.trim() === '') return fallbackUrl;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const backendOrigin = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : 'http://localhost:5000';
    return `${backendOrigin}${url}`;
  }
  return url;
};

const Wishlist = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated && user?.maNguoiDung) {
      setIsLoading(true);
      api.wishlist
        .get()
        .then((res) => {
          if (!isMounted || !res) return;

          const mapped = [];

          (res.locations || []).forEach((loc) => {
            const locName = loc.ten || loc.tenDiaDiem || 'Địa danh';
            mapped.push({
              id: loc.maDiaDiem,
              maDiaDiem: loc.maDiaDiem,
              maYeuThich: loc.maYeuThich,
              type: 'location',
              ten: locName,
              title: locName,
              tinhThanh: loc.tinhThanh || 'Việt Nam',
              location: loc.tinhThanh || 'Việt Nam',
              danhHieu: loc.danhHieu,
              moTa: loc.moTa || '',
              anhUrl: resolveImageUrl(loc.anhUrl || loc.anh_url, '/images/vinh_ha_long.jpg'),
              image: resolveImageUrl(loc.anhUrl || loc.anh_url, '/images/vinh_ha_long.jpg'),
              loaiHinh: loc.loaiHinh || [],
              isFavorited: true,
              dateAdded: loc.createdAt || loc.ngayLuu || new Date().toISOString(),
            });
          });

          (res.attractions || []).forEach((att) => {
            const attName = att.ten || att.tenDiem || 'Điểm check-in';
            mapped.push({
              id: att.maDiemTQ,
              maDiemTQ: att.maDiemTQ,
              maDiaDiem: att.maDiaDiem,
              maYeuThich: att.maYeuThich,
              type: 'checkin',
              ten: attName,
              title: attName,
              diaChi: att.diaChi || att.tenDiaDiem || 'Điểm check-in',
              location: att.diaChi || att.tenDiaDiem || 'Điểm check-in',
              moTa: att.moTa || '',
              diemNoiBat: att.diemNoiBat || att.moTa || '',
              giaVe: att.giaVe || 'Miễn phí',
              gioMoCua: att.gioMoCua || 'Mở cửa cả ngày',
              tenDiaDiem: att.tenDiaDiem || att.tinhThanh,
              tinhThanh: att.tinhThanh,
              anhDaiDien: resolveImageUrl(att.anhDaiDien || att.anhUrl, '/images/cau_vang.jpg'),
              image: resolveImageUrl(att.anhDaiDien || att.anhUrl, '/images/cau_vang.jpg'),
              diemDanhGia: parseFloat(att.diemDanhGia || att.danhGiaTB || 5.0),
              rating: parseFloat(att.diemDanhGia || att.danhGiaTB || 5.0),
              soDanhGia: att.soDanhGia || att.soLuotDanhGia || 0,
              reviews: att.soDanhGia || att.soLuotDanhGia || 0,
              loaiHinh: att.loaiHinh || [],
              isFavorited: true,
              dateAdded: att.createdAt || att.ngayLuu || new Date().toISOString(),
            });
          });

          (res.hotels || []).forEach((hotel) => {
            const hotelName = hotel.ten || hotel.tenKhachSan || 'Khách sạn';
            mapped.push({
              id: hotel.maKhachSan,
              maKhachSan: hotel.maKhachSan,
              maYeuThich: hotel.maYeuThich,
              type: 'hotel',
              ten: hotelName,
              title: hotelName,
              diaChi: hotel.diaChi || hotel.tenDiaDiem || 'Khách sạn',
              location: hotel.diaChi || hotel.tenDiaDiem || 'Khách sạn',
              soSao: parseFloat(hotel.soSao || 5.0),
              moTa: hotel.moTa || '',
              giaThamKhao: hotel.giaThamKhao || 0,
              donViTinh: hotel.donViTinh || '/đêm',
              diemNoiBat: hotel.diemNoiBat || '',
              bookingUrl: hotel.bookingUrl,
              tenDiaDiem: hotel.tenDiaDiem,
              tinhThanh: hotel.tinhThanh,
              anhDaiDien: resolveImageUrl(hotel.anhDaiDien || hotel.anhUrl, '/images/vinh_ha_long.jpg'),
              image: resolveImageUrl(hotel.anhDaiDien || hotel.anhUrl, '/images/vinh_ha_long.jpg'),
              diemDanhGia: parseFloat(hotel.diemDanhGia || hotel.danhGiaTB || 4.8),
              rating: parseFloat(hotel.diemDanhGia || hotel.danhGiaTB || 4.8),
              soDanhGia: hotel.soDanhGia || hotel.soLuotDanhGia || 0,
              reviews: hotel.soDanhGia || hotel.soLuotDanhGia || 0,
              tienNghi: hotel.tienNghi || [],
              loaiHinh: hotel.loaiHinh || [],
              isFavorited: true,
              dateAdded: hotel.createdAt || hotel.ngayLuu || new Date().toISOString(),
            });
          });

          setFavorites(mapped);
        })
        .catch((err) => {
          console.error('Loi khi tai danh sach yeu thich:', err);
          if (isMounted) {
            setFavorites([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    } else {
      setFavorites([]);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.maNguoiDung]);

  let processedFavorites = favorites.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;

    if (searchQuery.trim() === '') return true;
    const query = searchQuery.toLowerCase();
    const itemName = (item.ten || item.title || '').toLowerCase();
    const itemLoc = (item.diaChi || item.tenDiaDiem || item.tinhThanh || item.location || '').toLowerCase();
    return itemName.includes(query) || itemLoc.includes(query);
  });

  const now = new Date();
  if (sortBy === '1_day') {
    processedFavorites = processedFavorites.filter((item) => now - new Date(item.dateAdded) <= 24 * 60 * 60 * 1000);
  } else if (sortBy === '1_week') {
    processedFavorites = processedFavorites.filter((item) => now - new Date(item.dateAdded) <= 7 * 24 * 60 * 60 * 1000);
  }

  processedFavorites.sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.dateAdded) - new Date(b.dateAdded);
    }
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });

  const confirmRemoveFavorite = async () => {
    if (!itemToDelete) return;
    const item = itemToDelete;
    setIsDeleting(true);

    try {
      if (isAuthenticated) {
        const payload = {};
        if (item.maYeuThich) payload.maYeuThich = item.maYeuThich;
        if (item.type === 'location') payload.maDiaDiem = item.maDiaDiem || item.id;
        else if (item.type === 'checkin') payload.maDiemTQ = item.maDiemTQ || item.id;
        else if (item.type === 'hotel') payload.maKhachSan = item.maKhachSan || item.id;

        await api.wishlist.remove(payload);
      }

      setFavorites((prev) =>
        prev.filter((i) => {
          if (item.maYeuThich && i.maYeuThich) {
            return i.maYeuThich !== item.maYeuThich;
          }
          if (item.type === 'location') {
            return !(i.type === 'location' && (i.maDiaDiem === item.maDiaDiem || i.id === item.id));
          }
          if (item.type === 'checkin') {
            return !(i.type === 'checkin' && (i.maDiemTQ === item.maDiemTQ || i.id === item.id));
          }
          if (item.type === 'hotel') {
            return !(i.type === 'hotel' && (i.maKhachSan === item.maKhachSan || i.id === item.id));
          }
          return true;
        })
      );
      setItemToDelete(null);
    } catch (err) {
      console.error('Loi khi xoa khoi wishlist:', err);
      alert('Không thể xóa mục khỏi danh sách yêu thích. Vui lòng thử lại!');
    } finally {
      setIsDeleting(false);
    }
  };

  const countAll = favorites.length;
  const countLocation = favorites.filter((i) => i.type === 'location').length;
  const countHotel = favorites.filter((i) => i.type === 'hotel').length;
  const countCheckin = favorites.filter((i) => i.type === 'checkin').length;

  const locations = processedFavorites.filter((i) => i.type === 'location');
  const hotels = processedFavorites.filter((i) => i.type === 'hotel');
  const checkins = processedFavorites.filter((i) => i.type === 'checkin');

  const renderGrid = (items, typeName) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {typeName === 'location' && <Map className="text-sky-600" size={24} />}
            {typeName === 'checkin' && <Compass className="text-amber-500" size={24} />}
            {typeName === 'hotel' && <Hotel className="text-teal-600" size={24} />}
            {typeName === 'location' && 'Danh thắng & Địa điểm đã lưu'}
            {typeName === 'checkin' && 'Điểm check-in nổi bật đã lưu'}
            {typeName === 'hotel' && 'Khu nghỉ dưỡng & Khách sạn đã lưu'}
          </h2>
          <span className="text-sm font-medium text-slate-500">
            {items.length} {typeName === 'location' ? 'địa điểm' : typeName === 'hotel' ? 'khách sạn' : 'điểm check-in'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {items.map((item) => {
            const key = `${item.type}-${item.maDiaDiem || item.maDiemTQ || item.maKhachSan || item.id}`;
            if (item.type === 'location') {
              return (
                <DestinationCard
                  key={key}
                  destination={item}
                  onRemove={(targetItem) => setItemToDelete(targetItem)}
                  onNavigate={(id) => navigate(`/location/${id}`)}
                />
              );
            }
            if (item.type === 'hotel') {
              return (
                <HotelCard
                  key={key}
                  hotel={item}
                  onRemove={(targetItem) => setItemToDelete(targetItem)}
                  onNavigate={(id) => navigate(`/service/hotel/${id}`)}
                />
              );
            }
            if (item.type === 'checkin') {
              return (
                <AttractionCard
                  key={key}
                  spot={item}
                  onRemove={(targetItem) => setItemToDelete(targetItem)}
                  onNavigate={(id) => navigate(`/service/attraction/${id}`)}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 font-sans">
        <div className="flex-grow pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Header Section */}
            <div className="mb-10 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 flex items-center justify-center sm:justify-start gap-3">
                <Heart className="text-rose-500 fill-rose-500" size={34} />
                Danh Sách Yêu Thích
              </h1>
              <p className="text-slate-500 text-base sm:text-lg">
                Lưu trữ và quản lý những địa điểm, khách sạn mà bạn muốn ghé thăm trong tương lai.
              </p>
            </div>

            {/* Guest Empty State Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm">
              <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Heart size={38} className="text-rose-500" />
              </div>

              <h2 className="text-2xl font-bold font-heading text-slate-800 mb-3">
                Bạn chưa đăng nhập tài khoản
              </h2>
              <p className="text-slate-500 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Vui lòng đăng nhập để xem danh sách yêu thích cá nhân hoặc lưu lại các địa danh, khu nghỉ dưỡng và điểm check-in bạn muốn ghé thăm.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <LogIn size={18} />
                  <span>Đăng nhập ngay</span>
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-8 py-3 rounded-xl border border-slate-200 transition-all"
                >
                  <UserPlus size={18} />
                  <span>Tạo tài khoản mới</span>
                </Link>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm mb-2">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Lưu trữ không giới hạn</h4>
                  <p className="text-xs text-slate-500">Đánh dấu tất cả danh lam thắng cảnh và khách sạn bạn yêu thích.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Đồng bộ đa thiết bị</h4>
                  <p className="text-xs text-slate-500">Truy cập danh sách yêu thích mọi lúc mọi nơi trên máy tính hay điện thoại.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm mb-2">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Gợi ý thông minh</h4>
                  <p className="text-xs text-slate-500">Nhận đề xuất địa điểm tương tự phù hợp với sở thích du lịch của bạn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 font-sans">
      <div className="flex-grow pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 flex items-center gap-3">
              <Heart className="text-rose-500 fill-rose-500" size={36} />
              Danh Sách Yêu Thích
            </h1>
            <p className="text-slate-500 text-base sm:text-lg">
              Lưu trữ và quản lý những địa điểm, khách sạn mà bạn muốn ghé thăm trong tương lai.
            </p>
          </div>

          {/* Layout: Sidebar (Left) + Content (Right) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filter (Left) */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 sticky top-28 z-20">
              <h3 className="text-lg font-bold text-slate-800 mb-5">Bộ lọc & Tìm kiếm</h3>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-600 mb-2 block">Tìm nhanh</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Nhập tên, địa điểm..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-600 mb-2 block">Sắp xếp</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all appearance-none text-sm text-slate-700 cursor-pointer"
                  >
                    <option value="newest">Mới thêm gần đây</option>
                    <option value="1_day">Thêm 1 ngày trước</option>
                    <option value="1_week">Thêm 1 tuần trước</option>
                    <option value="oldest">Thêm cũ nhất</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="mb-2">
                <label className="text-sm font-semibold text-slate-600 mb-3 block">Danh mục yêu thích</label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      filter === 'all'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span>Tất cả mục đã lưu</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        filter === 'all'
                          ? 'bg-sky-500/50 text-white'
                          : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                      }`}
                    >
                      {countAll}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter('location')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      filter === 'location'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Map size={18} />
                      <span>Địa điểm</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        filter === 'location'
                          ? 'bg-sky-500/50 text-white'
                          : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                      }`}
                    >
                      {countLocation}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter('hotel')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      filter === 'hotel'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hotel size={18} />
                      <span>Resort & Khách sạn</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        filter === 'hotel'
                          ? 'bg-sky-500/50 text-white'
                          : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                      }`}
                    >
                      {countHotel}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter('checkin')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      filter === 'checkin'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Compass size={18} />
                      <span>Điểm Check-in</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        filter === 'checkin'
                          ? 'bg-sky-500/50 text-white'
                          : 'bg-white text-slate-500 shadow-sm border border-slate-200'
                      }`}
                    >
                      {countCheckin}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content (Right) */}
            <div className="w-full lg:flex-1 min-w-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-slate-600 font-medium text-base">Đang tải danh sách yêu thích của bạn...</p>
                </div>
              ) : processedFavorites.length > 0 ? (
                <>
                  {(filter === 'all' || filter === 'location') && renderGrid(locations, 'location')}
                  {(filter === 'all' || filter === 'hotel') && renderGrid(hotels, 'hotel')}
                  {(filter === 'all' || filter === 'checkin') && renderGrid(checkins, 'checkin')}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                  <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-sky-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {favorites.length === 0 ? 'Chưa có mục yêu thích nào' : 'Không tìm thấy mục nào'}
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    {favorites.length === 0
                      ? 'Bạn chưa lưu địa điểm hay khách sạn nào. Hãy tiếp tục khám phá và lưu lại những nơi bạn muốn đến nhé!'
                      : 'Không có mục nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Xác nhận xóa khỏi danh sách yêu thích */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
              <Trash2 size={26} />
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Xóa khỏi danh sách yêu thích?
            </h4>

            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Bạn có chắc chắn muốn xóa{' '}
              <span className="font-semibold text-slate-800">
                "{itemToDelete.ten || itemToDelete.title || 'mục này'}"
              </span>{' '}
              khỏi danh sách yêu thích không?
            </p>

            {/* Mini preview card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 text-left">
              <img
                src={itemToDelete.anhUrl || itemToDelete.anhDaiDien || itemToDelete.image || '/images/vinh_ha_long.jpg'}
                alt=""
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-semibold text-slate-800 truncate">
                  {itemToDelete.ten || itemToDelete.title}
                </h5>
                <p className="text-xs text-slate-500 truncate">
                  {itemToDelete.tinhThanh || itemToDelete.diaChi || itemToDelete.location || 'Việt Nam'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600 shrink-0">
                {itemToDelete.type === 'location' ? 'Địa điểm' : itemToDelete.type === 'hotel' ? 'Khách sạn' : 'Điểm check-in'}
              </span>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => !isDeleting && setItemToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmRemoveFavorite}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Đồng ý xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Wishlist;
