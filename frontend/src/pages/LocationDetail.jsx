import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Compass,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Ticket
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const LocationDetail = () => {
  const { id } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isFromAI = Boolean(locationState.state?.fromAI);
  const aiConfidence = locationState.state?.confidence || '99.4%';

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'spots', 'hotels'
  const [modalSearch, setModalSearch] = useState('');

  // Resolve ID format (supports DD0001-DD0010 or numeric 1-10)
  const resolveLocationId = useCallback((rawId) => {
    if (!rawId) return 'DD0010';
    if (rawId.startsWith('DD')) return rawId;
    const num = parseInt(rawId, 10);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      return `DD${String(num).padStart(4, '0')}`;
    }
    return rawId;
  }, []);

  const fetchLocationDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const targetId = resolveLocationId(id);
      const data = await api.locations.getById(targetId);
      setLocation(data);
      setIsFavorited(Boolean(data.isFavorited));
    } catch (err) {
      console.error('Loi khi tai thong tin dia diem:', err.message);
      setError(err.message || 'Khong the tai du lieu dia diem');
    } finally {
      setLoading(false);
    }
  }, [id, resolveLocationId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLocationDetail();
  }, [fetchLocationDetail]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: locationState.pathname } });
      return;
    }
    if (!location) return;

    try {
      setWishlistLoading(true);
      const res = await api.wishlist.toggle({ maDiaDiem: location.maDiaDiem });
      setIsFavorited(Boolean(res.isFavorited));
    } catch (err) {
      console.error('Loi toggle wishlist dia diem:', err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubItemWishlist = async (e, type, itemId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: locationState.pathname } });
      return;
    }

    try {
      const payload = type === 'hotel' ? { maKhachSan: itemId } : { maDiemTQ: itemId };
      const res = await api.wishlist.toggle(payload);

      // Optimistically update sub-item favorite state in current location
      if (type === 'hotel') {
        setLocation((prev) => ({
          ...prev,
          hotels: prev.hotels.map((h) =>
            h.maKhachSan === itemId ? { ...h, isFavorited: res.isFavorited } : h
          ),
        }));
      } else {
        setLocation((prev) => ({
          ...prev,
          attractions: prev.attractions.map((a) =>
            a.maDiemTQ === itemId ? { ...a, isFavorited: res.isFavorited } : a
          ),
        }));
      }
    } catch (err) {
      console.error('Loi toggle wishlist sub-item:', err.message);
    }
  };

  const handleBookingRedirect = (e, bookingUrl, fallbackId) => {
    e.stopPropagation();
    if (bookingUrl && bookingUrl !== '#' && bookingUrl.startsWith('http')) {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/service/hotel/${fallbackId}`);
    }
  };

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 font-sans">
        <div className="h-[460px] bg-slate-200 animate-pulse rounded-3xl mb-10"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="h-8 bg-slate-200 animate-pulse rounded-xl w-1/3"></div>
            <div className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
            <div className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
          </div>
          <div className="w-full lg:w-80 h-96 bg-slate-100 animate-pulse rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-24 text-center font-sans">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy địa điểm</h2>
          <p className="text-gray-600 text-sm mb-6">
            Địa điểm bạn yêu cầu không tồn tại hoặc đã thay đổi thông tin trên hệ thống.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/explore"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Khám phá danh thắng khác
            </Link>
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const spotsList = location.attractions || [];
  const hotelsList = location.hotels || [];
  const relatedList = location.relatedLocations || [];

  const filteredSpots = spotsList.filter(
    (s) =>
      !modalSearch ||
      s.ten.toLowerCase().includes(modalSearch.toLowerCase()) ||
      (s.diemNoiBat && s.diemNoiBat.toLowerCase().includes(modalSearch.toLowerCase()))
  );

  const filteredHotels = hotelsList.filter(
    (h) =>
      !modalSearch ||
      h.ten.toLowerCase().includes(modalSearch.toLowerCase()) ||
      (h.diaChi && h.diaChi.toLowerCase().includes(modalSearch.toLowerCase()))
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 text-gray-800 font-sans">
        {/* Phan 1: Hero Banner & Tong quan */}
        <section
          className="relative min-h-[500px] md:h-[540px] rounded-3xl bg-cover bg-center overflow-hidden mb-10 flex items-end shadow-xl"
          style={{ backgroundImage: `url(${location.anhUrl || '/images/vinh_ha_long.jpg'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

          {/* AI Header Info */}
          {isFromAI && (
            <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-sky-800 text-xs sm:text-sm font-semibold">
                Mô hình ResNet50 • Độ tin cậy: {aiConfidence}
              </span>
            </div>
          )}

          {/* Top-Right Action Buttons */}
          <div className="absolute top-5 right-5 z-20 flex flex-wrap gap-2.5">
            <button
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-lg backdrop-blur-md transition transform hover:-translate-y-0.5 cursor-pointer ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/90 hover:bg-white text-gray-800'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                }`}
              />
              <span>{isFavorited ? 'Đã lưu Wishlist' : 'Lưu vào Wishlist'}</span>
            </button>

            <button
              onClick={() => navigate('/?tab=ai')}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg backdrop-blur-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Quét AI khác</span>
            </button>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 w-full text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {location.danhHieu && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-sm">
                  {location.danhHieu}
                </span>
              )}
              {location.tinhThanh && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-white/30 backdrop-blur-sm text-white">
                  {location.tinhThanh}
                </span>
              )}
              {Array.isArray(location.loaiHinh) &&
                location.loaiHinh.slice(0, 3).map((lh, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-black/40 backdrop-blur-sm text-sky-200"
                  >
                    {lh}
                  </span>
                ))}
              {location.matchScore > 0 && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Phù hợp sở thích của bạn
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-6 drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]">
              {location.ten}
            </h1>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-white drop-shadow-md border-t border-white/20 pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-sky-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Tọa độ địa lý
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {location.viDo ? `${location.viDo.toFixed(3)}°N, ${location.kinhDo.toFixed(3)}°E` : '20.910°N, 107.184°E'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-sky-200 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Quy mô danh thắng
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {location.quyMo || 'Đô thị du lịch trọng điểm'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-sky-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Thời điểm lý tưởng
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {location.thoiDiemLyTuong || 'Quanh năm'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-sky-200 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  Điểm đến & Cơ sở lưu trú
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {spotsList.length} điểm tham quan • {hotelsList.length} khách sạn
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout: 2 Columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-10">
            {/* Tong quan mo ta */}
            <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="mb-4">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-600" />
                  Thông tin tổng quan & Lịch sử
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Vẻ đẹp & Giá trị Di sản {location.ten}
                </h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-sky-500 text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line text-base">{location.moTa}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 gap-2">
                  <span>
                    Địa phận hành chính:{' '}
                    <strong className="text-gray-800">{location.tinhThanh}</strong>
                  </span>
                  {location.danhHieu && (
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      {location.danhHieu}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Phan 2: Cac diem Check-in tieu bieu */}
            <section>
              <div className="flex justify-between items-end mb-5">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-600" />
                    Hành trình khám phá
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    Điểm tham quan & Check-in tiêu biểu
                  </h2>
                </div>
                {spotsList.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveTab('spots');
                      setShowAllModal(true);
                    }}
                    className="group flex items-center gap-1.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer"
                  >
                    Xem tất cả {spotsList.length} địa điểm
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {spotsList.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-gray-500">
                  Chưa có thông tin điểm tham quan nào cho địa danh này.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {spotsList.map((spot) => (
                    <div
                      key={spot.maDiemTQ}
                      onClick={() => navigate(`/service/attraction/${spot.maDiemTQ}`)}
                      className="bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={spot.anhDaiDien || location.anhUrl || '/images/vinh_ha_long.jpg'}
                          alt={spot.ten}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => handleSubItemWishlist(e, 'attraction', spot.maDiemTQ)}
                          className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition ${
                            spot.isFavorited
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-black/30 hover:bg-black/50 text-white'
                          }`}
                          title="Lưu điểm tham quan"
                        >
                          <Heart
                            className={`w-4 h-4 ${spot.isFavorited ? 'fill-rose-500' : ''}`}
                          />
                        </button>
                        {spot.diemDanhGia && (
                          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                            {parseFloat(spot.diemDanhGia).toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
                            {spot.ten}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                            {spot.diemNoiBat || spot.moTa || 'Điểm check-in nổi bật không thể bỏ qua.'}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 text-xs text-gray-500 flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {spot.gioMoCua || 'Mở cửa cả ngày'}
                          </span>
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {spot.giaVe || 'Miễn phí'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Phan 3: Khach san & Khu nghi duong */}
            <section>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-600" />
                    Không gian nghỉ dưỡng
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    Cơ sở lưu trú & Khách sạn nghỉ dưỡng
                  </h2>
                </div>
                {hotelsList.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveTab('hotels');
                      setShowAllModal(true);
                    }}
                    className="group flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer w-fit"
                  >
                    Xem tất cả {hotelsList.length} khách sạn
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {hotelsList.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-gray-500">
                  Chưa có thông tin khách sạn hoặc resort lưu trú cho địa danh này.
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {hotelsList.map((hotel) => (
                    <div
                      key={hotel.maKhachSan}
                      onClick={() => navigate(`/service/hotel/${hotel.maKhachSan}`)}
                      className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow group"
                    >
                      <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden bg-slate-100">
                        <img
                          src={hotel.anhDaiDien || location.anhUrl || '/images/vinh_ha_long.jpg'}
                          alt={hotel.ten}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => handleSubItemWishlist(e, 'hotel', hotel.maKhachSan)}
                          className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition ${
                            hotel.isFavorited
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-black/30 hover:bg-black/50 text-white'
                          }`}
                          title="Lưu khách sạn"
                        >
                          <Heart
                            className={`w-4 h-4 ${hotel.isFavorited ? 'fill-rose-500' : ''}`}
                          />
                        </button>
                        {hotel.diemNoiBat && (
                          <span className="absolute bottom-3 left-3 bg-white/95 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            {hotel.diemNoiBat}
                          </span>
                        )}
                      </div>

                      <div className="p-6 md:w-3/5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                              {hotel.ten}
                            </h3>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= (hotel.soSao || 4)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              {hotel.diemDanhGia && (
                                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                                  {parseFloat(hotel.diemDanhGia).toFixed(1)} / 5.0
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="line-clamp-1">{hotel.diaChi}</span>
                          </p>

                          {/* Tien nghi */}
                          {Array.isArray(hotel.tienNghi) && hotel.tienNghi.length > 0 && (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                              {hotel.tienNghi.slice(0, 4).map((am, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {typeof am === 'string' ? am : am.ten}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Price & Booking Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-dashed border-gray-200 mt-2 gap-3">
                          <div>
                            <span className="text-2xl font-extrabold text-rose-600">
                              {formatCurrency(hotel.giaThamKhao)}
                            </span>
                            <span className="text-xs text-gray-400 block">
                              {hotel.donViTinh || '/đêm'}
                            </span>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={(e) =>
                                handleBookingRedirect(e, hotel.bookingUrl, hotel.maKhachSan)
                              }
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <span>Đặt phòng</span>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Phan 4: Diem den tuong dong */}
            {relatedList.length > 0 && (
              <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      Gợi ý cùng chủ đề
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                      Điểm đến di sản tương đồng bạn sẽ thích
                    </h2>
                  </div>
                  <Link
                    to="/explore"
                    className="text-sky-700 font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    Xem cả 10 danh thắng <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedList.map((sim) => (
                    <Link
                      key={sim.maDiaDiem}
                      to={`/location/${sim.maDiaDiem}`}
                      className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-300 group flex flex-col"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={sim.anhUrl || '/images/vinh_ha_long.jpg'}
                          alt={sim.ten}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 text-[11px] font-semibold rounded">
                          {sim.tinhThanh}
                        </span>
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-gray-800 group-hover:text-sky-700 transition-colors line-clamp-1">
                          {sim.ten}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                          {sim.danhHieu || 'Điểm đến hấp dẫn'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Ban do mini */}
              <div
                onClick={() => setShowMapPopup(true)}
                className="bg-sky-50 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition border border-sky-100 group"
              >
                <div className="flex justify-between items-center text-sm font-semibold text-sky-900 mb-3">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    Tọa độ GPS:
                  </span>
                  <span className="text-xs font-mono text-sky-700">
                    {location.viDo ? `${location.viDo.toFixed(3)}°, ${location.kinhDo.toFixed(3)}°` : 'Bấm để xem'}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-sky-400 to-sky-600 h-36 rounded-2xl flex flex-col items-center justify-center text-white font-bold mb-4 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
                  <MapPin className="w-8 h-8 mb-1 animate-bounce" />
                  <span className="text-sm">Mở Bản đồ tương tác</span>
                  <span className="text-[11px] font-normal opacity-90">Xem vị trí & chỉ đường</span>
                </div>

                <div className="text-sm text-slate-700 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Mùa du lịch đẹp:
                    </span>
                    <span className="font-bold text-xs text-slate-800">
                      {location.thoiDiemLyTuong || 'Quanh năm'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      Khu vực:
                    </span>
                    <span className="font-bold text-xs text-slate-800">
                      {location.tinhThanh}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bo loc & Tien ich nghi duong */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Tiêu chí nghỉ dưỡng
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Đã tự động loại bỏ các tiện ích không phù hợp, ưu tiên trải nghiệm thư giãn tĩnh tâm.
                </p>

                <div className="space-y-3.5">
                  {[
                    { title: 'Hồ bơi vô cực view danh thắng', sub: 'Tầm nhìn bao quát biển/núi' },
                    { title: 'Spa & Liệu pháp thảo mộc Onsen', sub: 'Tái tạo năng lượng và thanh lọc' },
                    { title: 'Ẩm thực hữu cơ thực dưỡng', sub: 'Món ngon địa phương tuyển chọn' },
                  ].map((filter, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{filter.title}</div>
                        <div className="text-xs text-gray-400">{filter.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveTab('hotels');
                    setShowAllModal(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm mt-6 transition shadow-sm cursor-pointer"
                >
                  Xem danh sách khách sạn đạt chuẩn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Popup Modal */}
        {showMapPopup && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMapPopup(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition cursor-pointer p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowMapPopup(false)}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-sky-600" />
                  Bản đồ tương tác {location.ten}
                </h2>
                <p className="text-sm text-gray-500">
                  Tọa độ:{' '}
                  <span className="font-mono font-medium text-gray-700">
                    {location.viDo}°N, {location.kinhDo}°E
                  </span>{' '}
                  • {location.tinhThanh}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden h-[450px] border border-slate-200 shadow-inner bg-slate-100">
                <iframe
                  src={`https://maps.google.com/maps?q=${location.viDo || 20.91},${location.kinhDo || 107.18}&hl=vi&z=12&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ ${location.ten}`}
                ></iframe>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Sử dụng cử chỉ chuột để phóng to/thu nhỏ và di chuyển trên bản đồ.
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    location.ten + ' ' + (location.tinhThanh || '')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>Mở trong Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Kham pha & Trai nghiem Drawer / Modal */}
        {showAllModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end"
            onClick={() => setShowAllModal(false)}
          >
            <div
              className="bg-slate-50 w-full max-w-4xl h-full shadow-2xl flex flex-col transform transition-transform overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-6 sm:px-8 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm z-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Khám phá & Trải nghiệm
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Toàn bộ dịch vụ & điểm đến tiêu biểu tại {location.ten}
                  </p>
                </div>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
                  onClick={() => setShowAllModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar Filter */}
                <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-5 overflow-y-auto flex-shrink-0">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Tìm kiếm dịch vụ..."
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex-1 md:flex-none ${
                        activeTab === 'all'
                          ? 'bg-sky-50 text-sky-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Tất cả ({spotsList.length + hotelsList.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('spots')}
                      className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex-1 md:flex-none ${
                        activeTab === 'spots'
                          ? 'bg-sky-50 text-sky-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Điểm Check-in ({spotsList.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('hotels')}
                      className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex-1 md:flex-none ${
                        activeTab === 'hotels'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Nơi lưu trú ({hotelsList.length})
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(activeTab === 'all' || activeTab === 'spots') &&
                      filteredSpots.map((spot) => (
                        <div
                          key={`modal-spot-${spot.maDiemTQ}`}
                          onClick={() => {
                            setShowAllModal(false);
                            navigate(`/service/attraction/${spot.maDiemTQ}`);
                          }}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer flex flex-col"
                        >
                          <div className="relative h-44 overflow-hidden bg-slate-100">
                            <img
                              src={spot.anhDaiDien || location.anhUrl || '/images/vinh_ha_long.jpg'}
                              alt={spot.ten}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 text-sky-700 px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                              Điểm tham quan
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 mb-1">
                                {spot.ten}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {spot.diemNoiBat || spot.moTa}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                              <span className="text-emerald-700 font-semibold">
                                {spot.giaVe || 'Miễn phí'}
                              </span>
                              <span className="text-sky-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                    {(activeTab === 'all' || activeTab === 'hotels') &&
                      filteredHotels.map((hotel) => (
                        <div
                          key={`modal-hotel-${hotel.maKhachSan}`}
                          onClick={() => {
                            setShowAllModal(false);
                            navigate(`/service/hotel/${hotel.maKhachSan}`);
                          }}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer flex flex-col"
                        >
                          <div className="relative h-44 overflow-hidden bg-slate-100">
                            <img
                              src={hotel.anhDaiDien || location.anhUrl || '/images/vinh_ha_long.jpg'}
                              alt={hotel.ten}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                              Khách sạn / Resort
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900 leading-snug text-sm line-clamp-1">
                                  {hotel.ten}
                                </h3>
                                {hotel.diemDanhGia && (
                                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded ml-1 flex-shrink-0">
                                    {parseFloat(hotel.diemDanhGia).toFixed(1)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {hotel.diaChi}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-rose-600 font-bold text-sm">
                                {formatCurrency(hotel.giaThamKhao)}
                              </span>
                              <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Đặt phòng <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {filteredSpots.length === 0 && filteredHotels.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      Không tìm thấy dịch vụ nào phù hợp với từ khóa "{modalSearch}".
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default LocationDetail;
