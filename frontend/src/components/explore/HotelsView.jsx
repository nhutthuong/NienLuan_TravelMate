import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Building,
  ArrowUpDown,
  Loader2,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  X,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PriceRangeFilter from '../filters/PriceRangeFilter';
import StarRatingFilter from '../filters/StarRatingFilter';
import AmenitiesFilter from '../filters/AmenitiesFilter';
import PreferenceToggle from '../filters/PreferenceToggle';
import HotelCard from './HotelCard';

const formatNumberVN = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
};

const MAX_PRICE_DEFAULT = 25000000; // 25.000.000 VND

const DEFAULT_CATEGORY_MAP = {
  LH0001: 'Thiên nhiên',
  LH0002: 'Văn hóa',
  LH0003: 'Lịch sử',
  LH0004: 'Nghỉ dưỡng',
  LH0005: 'Khám phá',
  LH0006: 'Mạo hiểm',
  LH0007: 'Biển đảo',
  LH0008: 'Ẩm thực',
  LH0009: 'Tâm linh',
  LH0010: 'Di sản',
  LH0011: 'Sinh thái',
};

const HotelsView = ({
  hotels = [],
  categories = [],
  loading = false,
  onHotelWishlistChange,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const userPreferences = useMemo(() => {
    return Array.isArray(user?.soThich) ? user.soThich : [];
  }, [user]);

  const getCategoryDisplayName = useCallback(
    (pref) => {
      if (!pref) return '';
      const pStr = String(pref).trim();
      const upper = pStr.toUpperCase();
      if (DEFAULT_CATEGORY_MAP[upper]) return DEFAULT_CATEGORY_MAP[upper];
      if (Array.isArray(categories) && categories.length > 0) {
        const found = categories.find(
          (c) =>
            (c.maLoaiHinh || c.maloaihinh || '').toLowerCase() === pStr.toLowerCase()
        );
        if (found && (found.ten || found.name)) return found.ten || found.name;
      }
      return pStr;
    },
    [categories]
  );

  // Compute matched preferences dynamically based on live userPreferences and categories
  const getHotelMatchedPreferences = useCallback(
    (hotel) => {
      if (!isAuthenticated || !userPreferences || userPreferences.length === 0) {
        return [];
      }

      const hNames = Array.isArray(hotel.loaiHinh)
        ? hotel.loaiHinh
        : Array.isArray(hotel.loai_hinh)
        ? hotel.loai_hinh
        : [];

      const matched = [];

      // 1. Direct match against hotel.loaiHinh
      hNames.forEach((name) => {
        const nameStr = String(name).trim().toLowerCase();
        const isMatched = userPreferences.some((p) => {
          const pStr = String(p).trim().toLowerCase();
          if (pStr === nameStr) return true;
          const mappedName = getCategoryDisplayName(p).toLowerCase();
          if (mappedName && mappedName === nameStr) return true;
          return false;
        });
        if (isMatched && !matched.includes(name)) {
          matched.push(name);
        }
      });

      if (matched.length > 0) return matched;

      // 2. Fallback to backend matched list
      const backendMatched =
        Array.isArray(hotel.matchedLoaiHinh) && hotel.matchedLoaiHinh.length > 0
          ? hotel.matchedLoaiHinh
          : Array.isArray(hotel.matched_loai_hinh) && hotel.matched_loai_hinh.length > 0
          ? hotel.matched_loai_hinh
          : [];
      return backendMatched;
    },
    [isAuthenticated, userPreferences, getCategoryDisplayName]
  );

  // Determine dynamic max price based on actual hotels data
  const maxPossiblePrice = useMemo(() => {
    if (!hotels.length) return MAX_PRICE_DEFAULT;
    const highest = Math.max(...hotels.map((h) => parseInt(h.giaThamKhao || h.giathamkhao || 0, 10)));
    return Math.max(MAX_PRICE_DEFAULT, Math.ceil(highest / 1000000) * 1000000);
  }, [hotels]);

  // Filter States
  const [hotelSearch, setHotelSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_DEFAULT);
  const [selectedStars, setSelectedStars] = useState([]); // array of numbers: [5, 4, 3]
  const [selectedAmenities, setSelectedAmenities] = useState([]); // array of amenity strings
  const [hotelSort, setHotelSort] = useState('recommended');
  const [onlyMyPreferences, setOnlyMyPreferences] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique locations with count
  const locationStats = useMemo(() => {
    const map = new Map();
    hotels.forEach((h) => {
      const loc = h.tenDiaDiem || h.ten_dia_diem || h.tinhThanh || h.tinhthanh;
      if (loc) {
        map.set(loc, (map.get(loc) || 0) + 1);
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [hotels]);

  // Extract unique amenities with count
  const amenityStats = useMemo(() => {
    const map = new Map();
    hotels.forEach((h) => {
      const list = Array.isArray(h.tienNghi) ? h.tienNghi : [];
      list.forEach((item) => {
        const name = typeof item === 'string' ? item : item.ten;
        if (name && name.trim()) {
          const trimmed = name.trim();
          map.set(trimmed, (map.get(trimmed) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [hotels]);

  // Star counts
  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0 };
    hotels.forEach((h) => {
      const star = Math.min(5, Math.max(1, Math.round(parseFloat(h.soSao || h.sosao || 5))));
      if (counts[star] !== undefined) {
        counts[star] += 1;
      }
    });
    return counts;
  }, [hotels]);

  // Reset price range to defaults
  const handleResetPrice = useCallback(() => {
    setMinPrice(0);
    setMaxPrice(maxPossiblePrice);
  }, [maxPossiblePrice]);

  // Toggle star selection
  const handleToggleStar = (starNumber) => {
    setSelectedStars((prev) =>
      prev.includes(starNumber)
        ? prev.filter((s) => s !== starNumber)
        : [...prev, starNumber]
    );
  };

  // Toggle amenity selection
  const handleToggleAmenity = (amenityName) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  // Reset all filters
  const handleResetAllFilters = useCallback(() => {
    setHotelSearch('');
    setSelectedLocation('Tất cả');
    setMinPrice(0);
    setMaxPrice(maxPossiblePrice);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setOnlyMyPreferences(false);
  }, [maxPossiblePrice]);

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (hotelSearch.trim()) count++;
    if (selectedLocation !== 'Tất cả') count++;
    if (minPrice > 0 || maxPrice < maxPossiblePrice) count++;
    if (selectedStars.length > 0) count += selectedStars.length;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (onlyMyPreferences) count++;
    return count;
  }, [hotelSearch, selectedLocation, minPrice, maxPrice, maxPossiblePrice, selectedStars, selectedAmenities, onlyMyPreferences]);

  // Wishlist toggle
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

  // Filtering & Sorting
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const hotelName = (hotel.ten || hotel.name || '').toLowerCase();
        const hotelAddress = (hotel.diaChi || hotel.diachi || '').toLowerCase();
        const hotelDestination = (hotel.tenDiaDiem || hotel.ten_dia_diem || '').toLowerCase();
        const hotelProvince = (hotel.tinhThanh || hotel.tinhthanh || '').toLowerCase();
        const stars = Math.min(5, Math.max(1, Math.round(parseFloat(hotel.soSao || hotel.sosao || 5))));
        const price = parseInt(hotel.giaThamKhao || hotel.giathamkhao || 0, 10);
        const matchScore = hotel.matchScore || hotel.match_score || 0;
        const matched = hotel.matchedLoaiHinh || hotel.matched_loai_hinh || [];

        // 1. Search Query
        const query = hotelSearch.trim().toLowerCase();
        if (query) {
          const matchSearch =
            hotelName.includes(query) ||
            hotelAddress.includes(query) ||
            hotelDestination.includes(query) ||
            hotelProvince.includes(query);
          if (!matchSearch) return false;
        }

        // 2. Personal Preference Filter
        if (onlyMyPreferences) {
          if (matchScore <= 0 && matched.length === 0 && getHotelMatchedPreferences(hotel).length === 0) return false;
        }

        // 3. Location Filter
        if (selectedLocation !== 'Tất cả') {
          const selLoc = selectedLocation.toLowerCase();
          const matchLoc =
            hotelDestination.includes(selLoc) ||
            hotelProvince.includes(selLoc) ||
            selLoc.includes(hotelDestination);
          if (!matchLoc) return false;
        }

        // 4. Price Range Filter
        if (price > 0) {
          if (price < minPrice || price > maxPrice) return false;
        }

        // 5. Star Filter
        if (selectedStars.length > 0) {
          if (!selectedStars.includes(stars)) return false;
        }

        // 6. Amenities Filter
        if (selectedAmenities.length > 0) {
          const rawAmenities = Array.isArray(hotel.tienNghi) ? hotel.tienNghi : [];
          const hotelAmenities = rawAmenities.map((a) =>
            (typeof a === 'string' ? a : a.ten || '').toLowerCase()
          );

          const matchesAllAmenities = selectedAmenities.every((sel) => {
            const selLower = sel.toLowerCase();
            return hotelAmenities.some((item) => item.includes(selLower) || selLower.includes(item));
          });

          if (!matchesAllAmenities) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.giaThamKhao || a.giathamkhao || 0, 10);
        const priceB = parseInt(b.giaThamKhao || b.giathamkhao || 0, 10);
        const ratingA = parseFloat(a.diemDanhGia || a.diem_danh_gia || a.soSao || 4.5);
        const ratingB = parseFloat(b.diemDanhGia || b.diem_danh_gia || b.soSao || 4.5);
        const starsA = parseFloat(a.soSao || a.sosao || 5);
        const starsB = parseFloat(b.soSao || b.sosao || 5);
        const scoreA = parseInt(a.matchScore || a.match_score || 0, 10);
        const scoreB = parseInt(b.matchScore || b.match_score || 0, 10);

        if (hotelSort === 'price_asc') return priceA - priceB;
        if (hotelSort === 'price_desc') return priceB - priceA;
        if (hotelSort === 'rating') return ratingB - ratingA;
        if (hotelSort === 'stars_desc') return starsB - starsA;
        // Default: recommended
        const matchCountA = getHotelMatchedPreferences(a).length;
        const matchCountB = getHotelMatchedPreferences(b).length;
        const totalScoreA = scoreA + matchCountA * 10;
        const totalScoreB = scoreB + matchCountB * 10;
        if (totalScoreA !== totalScoreB) return totalScoreB - totalScoreA;
        return ratingB - ratingA;
      });
  }, [
    hotels,
    hotelSearch,
    selectedLocation,
    minPrice,
    maxPrice,
    selectedStars,
    selectedAmenities,
    hotelSort,
    onlyMyPreferences,
    getHotelMatchedPreferences,
  ]);

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Header (< lg) */}
      <div className="lg:hidden mb-6 flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex-1 py-3 px-5 bg-teal-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2.5 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <SlidersHorizontal size={19} />
          <span>Bộ lọc tìm kiếm</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-extrabold ml-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="p-3 text-slate-500 hover:text-rose-600 bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw size={20} />
          </button>
        )}
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Vertical Filter Sidebar                           */}
        {/* ============================================================== */}
        <aside
          className={`w-full lg:w-[340px] xl:w-[360px] shrink-0 space-y-6 ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Main Filter Panel Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-7">
            {/* Sidebar Title & Global Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
                <Sliders size={20} className="text-teal-700" />
                <span>Bộ lọc tìm kiếm</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="text-xs sm:text-sm text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Đặt lại ({activeFilterCount})</span>
                </button>
              )}
            </div>

            {/* 1. Personalized Preference Toggle (For members) */}
            {isAuthenticated && userPreferences.length > 0 && (
              <div className="pb-5 border-b border-slate-100">
                <PreferenceToggle
                  isActive={onlyMyPreferences}
                  onToggle={() => setOnlyMyPreferences(!onlyMyPreferences)}
                  label="Ưu tiên theo sở thích"
                />
              </div>
            )}

            {/* 2. Khoảng giá (Price Range) */}
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              maxPossiblePrice={maxPossiblePrice}
              onChange={({ min, max }) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              onReset={handleResetPrice}
            />

            {/* 3. Hạng sao (Star Rating) */}
            <StarRatingFilter
              selectedStars={selectedStars}
              starCounts={starCounts}
              onToggleStar={handleToggleStar}
              onReset={() => setSelectedStars([])}
            />

            {/* 4. Các tiện nghi (Amenities) */}
            <AmenitiesFilter
              amenities={amenityStats}
              selectedAmenities={selectedAmenities}
              onToggleAmenity={handleToggleAmenity}
              onReset={() => setSelectedAmenities([])}
              initialCount={6}
            />

            {/* 5. Địa danh / Tỉnh thành (Locations) */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider">
                  Địa danh
                </h3>
                {selectedLocation !== 'Tất cả' && (
                  <button
                    type="button"
                    onClick={() => setSelectedLocation('Tất cả')}
                    className="text-sm text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
                  >
                    Xem tất cả
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedLocation('Tất cả')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                    selectedLocation === 'Tất cả'
                      ? 'bg-teal-700 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Tất cả địa danh</span>
                  <span className={selectedLocation === 'Tất cả' ? 'text-teal-100 font-bold' : 'text-slate-400'}>
                    ({hotels.length})
                  </span>
                </button>

                {locationStats.map(([loc, count]) => {
                  const isSelected = selectedLocation === loc;

                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocation(loc)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-1">{loc}</span>
                      <span className={isSelected ? 'text-teal-100 font-bold' : 'text-slate-400'}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Search, Sort, Stats & Hotels Grid                */}
        {/* ============================================================== */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Top Search & Sort Control Bar */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Tìm theo tên khách sạn, địa chỉ, tiện ích..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10 outline-none transition-all text-sm sm:text-base placeholder:text-slate-400"
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
              />
              {hotelSearch && (
                <button
                  type="button"
                  onClick={() => setHotelSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 shadow-xs w-full md:w-auto whitespace-nowrap">
                <ArrowUpDown size={17} className="text-slate-500 shrink-0" />
                <span className="text-slate-600 text-sm font-bold whitespace-nowrap shrink-0">
                  Sắp xếp:
                </span>
                <select
                  value={hotelSort}
                  onChange={(e) => setHotelSort(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer pr-1 text-sm sm:text-base font-bold text-slate-800 whitespace-nowrap"
                >
                  <option value="recommended">
                    {isAuthenticated && userPreferences.length > 0
                      ? 'Ưu tiên theo sở thích của bạn'
                      : 'Gợi ý phù hợp nhất'}
                  </option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price_asc">Giá: Thấp đến cao</option>
                  <option value="price_desc">Giá: Cao đến thấp</option>
                  <option value="stars_desc">Hạng sao: Cao đến thấp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Badges & Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Tìm thấy <span className="font-black text-teal-800 text-base sm:text-lg">{filteredHotels.length}</span> cơ sở lưu trú
                phù hợp
              </p>

              {/* Active Badges */}
              {selectedLocation !== 'Tất cả' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-teal-50 text-teal-900 border border-teal-200">
                  <MapPin size={13} className="text-teal-700" />
                  <span>{selectedLocation}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedLocation('Tất cả')}
                    className="hover:text-rose-600 cursor-pointer ml-0.5 text-base leading-none"
                  >
                    ×
                  </button>
                </span>
              )}

              {(minPrice > 0 || maxPrice < maxPossiblePrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-sky-50 text-sky-900 border border-sky-200">
                  <span>
                    Giá: {formatNumberVN(minPrice)} - {formatNumberVN(maxPrice)}đ
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPrice}
                    className="hover:text-rose-600 cursor-pointer ml-0.5 text-base leading-none"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedStars.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{selectedStars.sort((a, b) => b - a).join(', ')} sao</span>
                  <button
                    type="button"
                    onClick={() => setSelectedStars([])}
                    className="hover:text-rose-600 cursor-pointer ml-0.5 text-base leading-none"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <span className="truncate max-w-[160px]">{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className="hover:text-rose-600 cursor-pointer ml-0.5 text-base leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}

              {onlyMyPreferences && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <Sparkles size={13} className="text-emerald-600" />
                  <span>Theo sở thích của tôi</span>
                  <button
                    type="button"
                    onClick={() => setOnlyMyPreferences(false)}
                    className="hover:text-rose-600 cursor-pointer ml-0.5 text-base leading-none"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="text-xs sm:text-sm text-teal-700 hover:text-teal-800 font-bold hover:underline cursor-pointer shrink-0"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Loader2 size={36} className="text-teal-700 animate-spin mb-3" />
              <p className="text-base font-semibold text-slate-500">
                Đang tải danh sách khách sạn &amp; resort từ hệ thống...
              </p>
            </div>
          ) : filteredHotels.length > 0 ? (
            /* Hotels Grid - 2 columns in right area for optimal readability */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.maKhachSan || hotel.makhachsan}
                  hotel={hotel}
                  matchedList={getHotelMatchedPreferences(hotel)}
                  onToggleWishlist={handleToggleWishlist}
                  onNavigate={(hotelId) => navigate(`/service/hotel/${hotelId}`)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm mb-16 p-8">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Không tìm thấy khách sạn phù hợp
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Rất tiếc, không có cơ sở lưu trú nào thỏa mãn tất cả tiêu chí bạn đã chọn. Hãy thử nới lỏng khoảng
                giá, giảm bớt tiện nghi hoặc chọn lại hạng sao.
              </p>
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
              >
                <RotateCcw size={15} />
                <span>Đặt lại tất cả bộ lọc</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HotelsView);
