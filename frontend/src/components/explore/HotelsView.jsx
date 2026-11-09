import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Building,
  Heart,
  ExternalLink,
  ArrowUpDown,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const formatCurrency = (amount) => {
  if (!amount) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const HotelsView = ({
  hotels = [],
  loading = false,
  onHotelWishlistChange,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const userPreferences = useMemo(() => {
    return Array.isArray(user?.soThich) ? user.soThich : [];
  }, [user]);

  const [hotelSearch, setHotelSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');
  const [selectedStar, setSelectedStar] = useState('Tất cả');
  const [hotelSort, setHotelSort] = useState('recommended');
  const [onlyMyPreferences, setOnlyMyPreferences] = useState(false);

  // Extract unique locations dynamically from loaded data (No hardcoding)
  const locationOptions = useMemo(() => {
    const set = new Set();
    hotels.forEach((h) => {
      const loc = h.tenDiaDiem || h.ten_dia_diem || h.tinhThanh || h.tinhthanh;
      if (loc) set.add(loc);
    });
    return ['Tất cả', ...Array.from(set)];
  }, [hotels]);

  const handleToggleWishlist = async (e, hotelId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/explore?tab=hotels' } });
      return;
    }

    try {
      const res = await api.wishlist.toggle({ maKhachSan: hotelId });
      if (onHotelWishlistChange) {
        onHotelWishlistChange(hotelId, res.isFavorited);
      }
    } catch (err) {
      console.error('Loi toggle wishlist khach san:', err);
    }
  };

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const hotelName = (hotel.ten || hotel.name || '').toLowerCase();
        const hotelAddress = (hotel.diaChi || hotel.diachi || '').toLowerCase();
        const hotelDestination = (hotel.tenDiaDiem || hotel.ten_dia_diem || '').toLowerCase();
        const hotelProvince = (hotel.tinhThanh || hotel.tinhthanh || '').toLowerCase();
        const stars = parseFloat(hotel.soSao || hotel.sosao || 4);
        const matchScore = hotel.matchScore || hotel.match_score || 0;
        const matched = hotel.matchedLoaiHinh || hotel.matched_loai_hinh || [];

        // Search match
        const query = hotelSearch.trim().toLowerCase();
        const matchSearch =
          !query ||
          hotelName.includes(query) ||
          hotelAddress.includes(query) ||
          hotelDestination.includes(query) ||
          hotelProvince.includes(query);

        if (!matchSearch) return false;

        // Preference filter shortcut
        if (onlyMyPreferences) {
          if (matchScore <= 0 && matched.length === 0) return false;
        }

        // Destination match
        const matchLocation =
          selectedLocation === 'Tất cả' ||
          hotelDestination.includes(selectedLocation.toLowerCase()) ||
          hotelProvince.includes(selectedLocation.toLowerCase()) ||
          selectedLocation.toLowerCase().includes(hotelDestination);

        if (!matchLocation) return false;

        // Star filter match
        if (selectedStar === '5 sao') return stars >= 5.0;
        if (selectedStar === '4 sao trở lên') return stars >= 4.0;

        return true;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.giaThamKhao || a.giathamkhao || 0, 10);
        const priceB = parseInt(b.giaThamKhao || b.giathamkhao || 0, 10);
        const ratingA = parseFloat(a.diemDanhGia || a.diem_danh_gia || a.soSao || 4.5);
        const ratingB = parseFloat(b.diemDanhGia || b.diem_danh_gia || b.soSao || 4.5);
        const scoreA = parseInt(a.matchScore || a.match_score || 0, 10);
        const scoreB = parseInt(b.matchScore || b.match_score || 0, 10);

        if (hotelSort === 'price_asc') return priceA - priceB;
        if (hotelSort === 'price_desc') return priceB - priceA;
        if (hotelSort === 'rating') return ratingB - ratingA;
        // recommended: priority to matchScore then rating
        if (scoreA !== scoreB) return scoreB - scoreA;
        return ratingB - ratingA;
      });
  }, [hotels, hotelSearch, selectedLocation, selectedStar, hotelSort, onlyMyPreferences]);

  return (
    <>
      {/* Hotel Filter & Search Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-6 mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input
              type="text"
              placeholder="Tìm theo tên khách sạn, địa chỉ, tiện ích..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition-all text-sm sm:text-base placeholder:text-slate-400"
              value={hotelSearch}
              onChange={(e) => setHotelSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto justify-end">
            {/* Preference filter button */}
            {isAuthenticated && userPreferences.length > 0 && (
              <button
                type="button"
                onClick={() => setOnlyMyPreferences(!onlyMyPreferences)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2.5 cursor-pointer select-none ${
                  onlyMyPreferences
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-teal-700/20'
                    : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                <Sparkles size={16} className={onlyMyPreferences ? 'text-amber-300' : 'text-teal-700'} />
                <span>Ưu tiên theo sở thích của tôi</span>
              </button>
            )}

            {/* Star Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider hidden sm:inline mr-1">
                Hạng sao:
              </span>
              {['Tất cả', '5 sao', '4 sao trở lên'].map((starOpt) => (
                <button
                  key={starOpt}
                  type="button"
                  onClick={() => setSelectedStar(starOpt)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
                    selectedStar === starOpt
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {starOpt}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 shadow-xs">
              <ArrowUpDown size={16} className="text-slate-400 shrink-0" />
              <select
                value={hotelSort}
                onChange={(e) => setHotelSort(e.target.value)}
                className="bg-transparent outline-none cursor-pointer pr-1 text-xs sm:text-sm font-semibold text-slate-700"
              >
                <option value="recommended">
                  {isAuthenticated && userPreferences.length > 0 ? 'Ưu tiên theo sở thích của bạn' : 'Gợi ý phù hợp nhất'}
                </option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Location Filter Pills */}
        {locationOptions.length > 1 && (
          <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2.5 overflow-x-auto scrollbar-thin">
            <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Địa danh:
            </span>
            {locationOptions.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs select-none ${
                  selectedLocation === loc
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hotels Count Notice */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-slate-800">{filteredHotels.length}</span> cơ sở lưu trú &amp; khách sạn nghỉ dưỡng
          </p>
          {onlyMyPreferences && (
            <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Sparkles size={12} /> Đang lọc theo sở thích cá nhân
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onlyMyPreferences && (
            <button
              type="button"
              onClick={() => setOnlyMyPreferences(false)}
              className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer"
            >
              Hiện tất cả khách sạn
            </button>
          )}
          {selectedLocation !== 'Tất cả' && (
            <button
              type="button"
              onClick={() => setSelectedLocation('Tất cả')}
              className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer"
            >
              Xem tất cả địa danh
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={36} className="text-teal-700 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-500">Đang tải danh sách khách sạn &amp; resort từ hệ thống...</p>
        </div>
      ) : filteredHotels.length > 0 ? (
        /* Hotels Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredHotels.map((hotel) => {
            const hotelId = hotel.maKhachSan || hotel.makhachsan;
            const hotelImg = hotel.anhDaiDien || hotel.anh_dai_dien || '/images/vinh_ha_long.jpg';
            const hotelName = hotel.ten || hotel.name;
            const destinationName = hotel.tenDiaDiem || hotel.ten_dia_diem || hotel.tinhThanh || hotel.tinhthanh;
            const address = hotel.diaChi || hotel.diachi;
            const stars = Math.min(5, Math.max(1, Math.round(parseFloat(hotel.soSao || hotel.sosao || 5))));
            const rating = parseFloat(hotel.diemDanhGia || hotel.diem_danh_gia || hotel.soSao || 4.8).toFixed(1);
            const reviewCount = hotel.soDanhGia || hotel.so_danh_gia || 100;
            const price = hotel.giaThamKhao || hotel.giathamkhao;
            const priceUnit = hotel.donViTinh || hotel.donvitinh || '/đêm';
            const highlight = hotel.diemNoiBat || hotel.diemnoibat;
            const isFav = Boolean(hotel.isFavorited || hotel.is_favorited);
            const amenities = Array.isArray(hotel.tienNghi) ? hotel.tienNghi : [];
            const matchedList = hotel.matchedLoaiHinh || hotel.matched_loai_hinh || [];

            return (
              <div
                key={hotelId}
                onClick={() => navigate(`/service/hotel/${hotelId}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-teal-600/40 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image & Badges */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={hotelImg}
                    alt={hotelName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/vinh_ha_long.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Destination Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-teal-800 text-xs font-bold px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <MapPin size={12} className="text-teal-600" />
                    <span>{destinationName}</span>
                  </div>

                  {/* Personalized match badge on image */}
                  {matchedList.length > 0 && (
                    <div className="absolute top-11 left-3 z-10 max-w-[80%]">
                      <div className="bg-slate-900/85 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm border border-amber-300/30 flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-400 shrink-0" />
                        <span className="truncate">Khớp sở thích: {matchedList.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, hotelId)}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
                      isFav
                        ? 'bg-rose-50 text-rose-600 shadow-sm'
                        : 'bg-black/30 hover:bg-black/50 text-white'
                    }`}
                    title="Lưu khách sạn yêu thích"
                  >
                    <Heart size={16} className={isFav ? 'fill-rose-500' : ''} />
                  </button>

                  {/* Highlight Tag */}
                  {highlight && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block bg-teal-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-medium truncate max-w-full">
                        {highlight}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Stars & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-200/50">
                        <Star size={11} className="fill-amber-500 text-amber-500" />
                        {rating} ({reviewCount})
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-1.5">
                      {hotelName}
                    </h3>

                    {/* Address */}
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{address}</span>
                    </div>

                    {/* Amenities Chips */}
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {amenities.slice(0, 3).map((item, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium"
                          >
                            {typeof item === 'string' ? item : item.ten}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Short Description */}
                    {hotel.moTa && (
                      <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {hotel.moTa}
                      </p>
                    )}
                  </div>

                  {/* Bottom Price & Actions */}
                  <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Giá từ</span>
                      <div className="text-base font-extrabold text-teal-700 leading-tight">
                        {formatCurrency(price)}
                        <span className="text-[11px] font-normal text-slate-400 ml-1">{priceUnit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hotel.bookingUrl && (
                        <a
                          href={hotel.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                          title="Đặt phòng trực tuyến"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/service/hotel/${hotelId}`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-700 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Chi tiết</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm mb-16">
          <div className="text-slate-300 mb-4 flex justify-center">
            <Building size={64} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy khách sạn phù hợp</h3>
          <p className="text-slate-500 text-sm">Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc địa danh, hạng sao.</p>
        </div>
      )}
    </>
  );
};

export default React.memo(HotelsView);
