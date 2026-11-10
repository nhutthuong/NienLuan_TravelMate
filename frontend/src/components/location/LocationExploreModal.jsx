import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Search,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  MapPin,
  Building,
  Camera,
  Star,
  SlidersHorizontal,
  Layers,
  Settings2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PreferencesModal from '../PreferencesModal';
import PriceRangeFilter from '../filters/PriceRangeFilter';
import StarRatingFilter from '../filters/StarRatingFilter';
import AmenitiesFilter from '../filters/AmenitiesFilter';
import PreferenceToggle from '../filters/PreferenceToggle';
import AttractionFilterSidebar from '../filters/AttractionFilterSidebar';
import HotelCard from '../explore/HotelCard';
import AttractionCard from './AttractionCard';

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

const isFreeTicket = (giaVe) => {
  if (!giaVe) return true;
  const str = String(giaVe).trim().toLowerCase();
  return str.includes('miễn phí') || str.includes('free') || str === '0' || str === '0đ';
};

const isOpenAllDay = (gioMoCua) => {
  if (!gioMoCua) return true;
  const str = String(gioMoCua).trim().toLowerCase();
  return (
    str.includes('tự do') ||
    str.includes('cả ngày') ||
    str.includes('24/24') ||
    str.includes('24/7')
  );
};

const LocationExploreModal = ({
  locationName = 'Địa danh',
  defaultImage = '/images/vinh_ha_long.jpg',
  activeTab = 'all', // 'all' | 'spots' | 'hotels'
  setActiveTab,
  spots = [],
  hotels = [],
  categories = [],
  onClose,
  onNavigate,
  onSubItemWishlist,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  const userPreferences = useMemo(() => {
    return Array.isArray(user?.soThich) ? user.soThich : [];
  }, [user]);

  // Helper to resolve preference ID or name to human-readable Vietnamese name
  const getCategoryDisplayName = useCallback(
    (pref) => {
      if (!pref) return '';
      const pStr = String(pref).trim();
      const upper = pStr.toUpperCase();

      if (DEFAULT_CATEGORY_MAP[upper]) {
        return DEFAULT_CATEGORY_MAP[upper];
      }

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

  const preferenceDisplayNames = useMemo(() => {
    return userPreferences.map((p) => getCategoryDisplayName(p)).filter(Boolean);
  }, [userPreferences, getCategoryDisplayName]);

  // Compute matched preferences for attraction
  const getSpotMatchedPreferences = useCallback(
    (spot) => {
      if (!isAuthenticated || !userPreferences || userPreferences.length === 0) return [];
      const spotTypes = Array.isArray(spot.loaiHinh) ? spot.loaiHinh : [];
      const matched = [];

      spotTypes.forEach((name) => {
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
      return Array.isArray(spot.matchedLoaiHinh) ? spot.matchedLoaiHinh : [];
    },
    [isAuthenticated, userPreferences, getCategoryDisplayName]
  );

  // Compute matched preferences for hotel
  const getHotelMatchedPreferences = useCallback(
    (hotel) => {
      if (!isAuthenticated || !userPreferences || userPreferences.length === 0) return [];
      const hNames = Array.isArray(hotel.loaiHinh) ? hotel.loaiHinh : [];
      const matched = [];

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
      return Array.isArray(hotel.matchedLoaiHinh) ? hotel.matchedLoaiHinh : [];
    },
    [isAuthenticated, userPreferences, getCategoryDisplayName]
  );

  // Dynamic max price
  const maxPossiblePrice = useMemo(() => {
    if (!hotels.length) return 25000000;
    const highest = Math.max(...hotels.map((h) => parseInt(h.giaThamKhao || h.giathamkhao || 0, 10)));
    return Math.max(25000000, Math.ceil(highest / 1000000) * 1000000);
  }, [hotels]);

  // Common filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [onlyMyPreferences, setOnlyMyPreferences] = useState(false);
  const [minRatingAll, setMinRatingAll] = useState(0);

  // Hotel filter states
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(maxPossiblePrice);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Attraction filter states
  const [ticketType, setTicketType] = useState('all'); // 'all' | 'free' | 'paid'
  const [hourType, setHourType] = useState('all'); // 'all' | 'all_day' | 'fixed'
  const [spotMinRating, setSpotMinRating] = useState(0);
  const [selectedSpotCategories, setSelectedSpotCategories] = useState([]);

  // Responsive mobile filter toggle
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Reset price
  const handleResetPrice = useCallback(() => {
    setMinPrice(0);
    setMaxPrice(maxPossiblePrice);
  }, [maxPossiblePrice]);

  // Hotel amenity stats
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

  // Hotel star counts
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

  // Attraction category stats
  const attractionCategoryStats = useMemo(() => {
    const map = new Map();
    spots.forEach((s) => {
      const list = Array.isArray(s.loaiHinh) ? s.loaiHinh : [];
      list.forEach((item) => {
        if (item && String(item).trim()) {
          const trimmed = String(item).trim();
          map.set(trimmed, (map.get(trimmed) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [spots]);

  // Attraction ticket counts
  const attractionTicketCounts = useMemo(() => {
    let free = 0;
    let paid = 0;
    spots.forEach((s) => {
      if (isFreeTicket(s.giaVe)) {
        free++;
      } else {
        paid++;
      }
    });
    return { all: spots.length, free, paid };
  }, [spots]);

  // Attraction hour counts
  const attractionHourCounts = useMemo(() => {
    let all_day = 0;
    let fixed = 0;
    spots.forEach((s) => {
      if (isOpenAllDay(s.gioMoCua)) {
        all_day++;
      } else {
        fixed++;
      }
    });
    return { all: spots.length, all_day, fixed };
  }, [spots]);

  // Attraction rating counts
  const attractionRatingCounts = useMemo(() => {
    let r5 = 0;
    let r45 = 0;
    let r4 = 0;
    spots.forEach((s) => {
      const rating = parseFloat(s.diemDanhGia || 5.0);
      if (rating >= 5.0) r5++;
      if (rating >= 4.5) r45++;
      if (rating >= 4.0) r4++;
    });
    return { all: spots.length, 5: r5, 4.5: r45, 4: r4 };
  }, [spots]);

  // Reset all filters in modal
  const handleResetCurrentTabFilters = useCallback(() => {
    setSearchQuery('');
    setOnlyMyPreferences(false);
    if (activeTab === 'hotels') {
      setMinPrice(0);
      setMaxPrice(maxPossiblePrice);
      setSelectedStars([]);
      setSelectedAmenities([]);
    } else if (activeTab === 'spots') {
      setTicketType('all');
      setHourType('all');
      setSpotMinRating(0);
      setSelectedSpotCategories([]);
    } else {
      setMinRatingAll(0);
    }
  }, [activeTab, maxPossiblePrice]);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (onlyMyPreferences) count++;

    if (activeTab === 'hotels') {
      if (minPrice > 0 || maxPrice < maxPossiblePrice) count++;
      if (selectedStars.length > 0) count += selectedStars.length;
      if (selectedAmenities.length > 0) count += selectedAmenities.length;
    } else if (activeTab === 'spots') {
      if (ticketType !== 'all') count++;
      if (hourType !== 'all') count++;
      if (spotMinRating > 0) count++;
      if (selectedSpotCategories.length > 0) count += selectedSpotCategories.length;
    } else {
      if (minRatingAll > 0) count++;
    }
    return count;
  }, [
    searchQuery,
    onlyMyPreferences,
    activeTab,
    minPrice,
    maxPrice,
    maxPossiblePrice,
    selectedStars,
    selectedAmenities,
    ticketType,
    hourType,
    spotMinRating,
    selectedSpotCategories,
    minRatingAll,
  ]);

  // Filtered & Sorted Spots
  const filteredSpots = useMemo(() => {
    return spots
      .filter((spot) => {
        const name = (spot.ten || '').toLowerCase();
        const address = (spot.diaChi || '').toLowerCase();
        const highlight = (spot.diemNoiBat || '').toLowerCase();
        const desc = (spot.moTa || '').toLowerCase();
        const rating = parseFloat(spot.diemDanhGia || 5.0);
        const matchScore = spot.matchScore || 0;
        const matched = spot.matchedLoaiHinh || [];
        const isFree = isFreeTicket(spot.giaVe);
        const isAllDay = isOpenAllDay(spot.gioMoCua);
        const categoriesList = Array.isArray(spot.loaiHinh) ? spot.loaiHinh : [];

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const match =
            name.includes(q) ||
            address.includes(q) ||
            highlight.includes(q) ||
            desc.includes(q) ||
            categoriesList.some((c) => String(c).toLowerCase().includes(q));
          if (!match) return false;
        }

        // Preference filter
        if (onlyMyPreferences) {
          if (matchScore <= 0 && matched.length === 0 && getSpotMatchedPreferences(spot).length === 0) {
            return false;
          }
        }

        // ActiveTab specific filters
        if (activeTab === 'spots') {
          // Ticket type
          if (ticketType === 'free' && !isFree) return false;
          if (ticketType === 'paid' && isFree) return false;

          // Hour type
          if (hourType === 'all_day' && !isAllDay) return false;
          if (hourType === 'fixed' && isAllDay) return false;

          // Rating
          if (spotMinRating > 0 && rating < spotMinRating) return false;

          // Categories
          if (selectedSpotCategories.length > 0) {
            const hasCat = selectedSpotCategories.some((sel) =>
              categoriesList.some((c) => String(c).toLowerCase() === sel.toLowerCase())
            );
            if (!hasCat) return false;
          }
        } else if (activeTab === 'all') {
          if (minRatingAll > 0 && rating < minRatingAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const ratingA = parseFloat(a.diemDanhGia || 5.0);
        const ratingB = parseFloat(b.diemDanhGia || 5.0);
        const reviewsA = parseInt(a.soDanhGia || 0, 10);
        const reviewsB = parseInt(b.soDanhGia || 0, 10);
        const nameA = a.ten || '';
        const nameB = b.ten || '';

        if (sortOption === 'rating') return ratingB - ratingA;
        if (sortOption === 'reviews_desc') return reviewsB - reviewsA;
        if (sortOption === 'name_asc') return nameA.localeCompare(nameB);
        if (sortOption === 'free_first') {
          const freeA = isFreeTicket(a.giaVe) ? 1 : 0;
          const freeB = isFreeTicket(b.giaVe) ? 1 : 0;
          if (freeA !== freeB) return freeB - freeA;
          return ratingB - ratingA;
        }

        // Default recommended
        const matchCountA = getSpotMatchedPreferences(a).length;
        const matchCountB = getSpotMatchedPreferences(b).length;
        if (matchCountA !== matchCountB) return matchCountB - matchCountA;
        return ratingB - ratingA;
      });
  }, [
    spots,
    searchQuery,
    onlyMyPreferences,
    activeTab,
    ticketType,
    hourType,
    spotMinRating,
    selectedSpotCategories,
    minRatingAll,
    sortOption,
    getSpotMatchedPreferences,
  ]);

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const name = (hotel.ten || '').toLowerCase();
        const address = (hotel.diaChi || '').toLowerCase();
        const desc = (hotel.moTa || '').toLowerCase();
        const highlight = (hotel.diemNoiBat || '').toLowerCase();
        const stars = Math.min(5, Math.max(1, Math.round(parseFloat(hotel.soSao || hotel.sosao || 5))));
        const price = parseInt(hotel.giaThamKhao || hotel.giathamkhao || 0, 10);
        const rating = parseFloat(hotel.diemDanhGia || hotel.soSao || 4.5);
        const matchScore = hotel.matchScore || 0;
        const matched = hotel.matchedLoaiHinh || [];

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const match =
            name.includes(q) ||
            address.includes(q) ||
            desc.includes(q) ||
            highlight.includes(q);
          if (!match) return false;
        }

        // Preference filter
        if (onlyMyPreferences) {
          if (matchScore <= 0 && matched.length === 0 && getHotelMatchedPreferences(hotel).length === 0) {
            return false;
          }
        }

        // Tab specific filters
        if (activeTab === 'hotels') {
          // Price range
          if (price > 0) {
            if (price < minPrice || price > maxPrice) return false;
          }

          // Stars
          if (selectedStars.length > 0 && !selectedStars.includes(stars)) return false;

          // Amenities
          if (selectedAmenities.length > 0) {
            const raw = Array.isArray(hotel.tienNghi) ? hotel.tienNghi : [];
            const hotelAmenities = raw.map((a) => (typeof a === 'string' ? a : a.ten || '').toLowerCase());
            const matchesAll = selectedAmenities.every((sel) =>
              hotelAmenities.some((item) => item.includes(sel.toLowerCase()) || sel.toLowerCase().includes(item))
            );
            if (!matchesAll) return false;
          }
        } else if (activeTab === 'all') {
          if (minRatingAll > 0 && rating < minRatingAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseInt(a.giaThamKhao || 0, 10);
        const priceB = parseInt(b.giaThamKhao || 0, 10);
        const ratingA = parseFloat(a.diemDanhGia || a.soSao || 4.5);
        const ratingB = parseFloat(b.diemDanhGia || b.soSao || 4.5);
        const starsA = parseFloat(a.soSao || 5);
        const starsB = parseFloat(b.soSao || 5);

        if (sortOption === 'price_asc') return priceA - priceB;
        if (sortOption === 'price_desc') return priceB - priceA;
        if (sortOption === 'rating') return ratingB - ratingA;
        if (sortOption === 'stars_desc') return starsB - starsA;
        if (sortOption === 'name_asc') return (a.ten || '').localeCompare(b.ten || '');

        // Default recommended
        const matchCountA = getHotelMatchedPreferences(a).length;
        const matchCountB = getHotelMatchedPreferences(b).length;
        if (matchCountA !== matchCountB) return matchCountB - matchCountA;
        return ratingB - ratingA;
      });
  }, [
    hotels,
    searchQuery,
    onlyMyPreferences,
    activeTab,
    minPrice,
    maxPrice,
    selectedStars,
    selectedAmenities,
    minRatingAll,
    sortOption,
    getHotelMatchedPreferences,
  ]);

  // Combined count for active display
  const totalDisplayCount = useMemo(() => {
    if (activeTab === 'spots') return filteredSpots.length;
    if (activeTab === 'hotels') return filteredHotels.length;
    return filteredSpots.length + filteredHotels.length;
  }, [activeTab, filteredSpots.length, filteredHotels.length]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end"
        onClick={onClose}
      >
        <div
          className="bg-slate-50 w-full max-w-6xl h-full shadow-2xl flex flex-col transform transition-transform overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-6 sm:px-8 py-4.5 flex justify-between items-center border-b border-slate-200/90 shadow-xs z-10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Khám phá & Trải nghiệm
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 bg-sky-50 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                  <MapPin size={12} className="text-sky-600" />
                  <span>{locationName}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Danh sách đầy đủ điểm check-in tiêu biểu và cơ sở lưu trú tại {locationName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <SlidersHorizontal size={16} />
                <span>Lọc</span>
                {activeFilterCount > 0 && (
                  <span className="bg-teal-700 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-full transition cursor-pointer"
                onClick={onClose}
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body 2-Column */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* ============================================================== */}
            {/* LEFT COLUMN: Sidebar Filters & Tabs                            */}
            {/* ============================================================== */}
            <aside
              className={`w-full md:w-80 lg:w-[340px] bg-white border-b md:border-b-0 md:border-r border-slate-200/90 p-5 overflow-y-auto shrink-0 space-y-6 ${
                showMobileFilter ? 'block' : 'hidden md:block'
              }`}
            >
              {/* Tab Selection */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Danh mục dịch vụ
                </span>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('all');
                      setSortOption('recommended');
                    }}
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                      activeTab === 'all'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={15} />
                      <span>Tất cả</span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {spots.length + hotels.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('spots');
                      setSortOption('recommended');
                    }}
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                      activeTab === 'spots'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Camera size={15} />
                      <span>Điểm Check-in</span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'spots' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {spots.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('hotels');
                      setSortOption('recommended');
                    }}
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                      activeTab === 'hotels'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building size={15} />
                      <span>Nơi lưu trú</span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === 'hotels' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {hotels.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search Input Box with Safe Padding (pl-11 = 44px) */}
              <div>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'hotels'
                        ? 'Tìm tên khách sạn, địa chỉ...'
                        : activeTab === 'spots'
                        ? 'Tìm điểm check-in, hoạt động...'
                        : 'Tìm dịch vụ, điểm tham quan...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-8 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700 bg-slate-50 focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Reset All Filters Header */}
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500">
                    Đang chọn {activeFilterCount} tiêu chí
                  </span>
                  <button
                    type="button"
                    onClick={handleResetCurrentTabFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Đặt lại bộ lọc</span>
                  </button>
                </div>
              )}

              {/* 1. Personalized Preferences Section */}
              <div className="pb-5 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Cá nhân hóa
                </span>

                {isAuthenticated && userPreferences.length > 0 ? (
                  <div className="space-y-2.5">
                    <PreferenceToggle
                      isActive={onlyMyPreferences}
                      onToggle={() => setOnlyMyPreferences(!onlyMyPreferences)}
                      label="Ưu tiên theo sở thích"
                    />

                    {preferenceDisplayNames.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-slate-500">
                            Gu du lịch của bạn:
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsPrefModalOpen(true)}
                            className="text-[11px] text-teal-700 hover:text-teal-800 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <Settings2 size={12} />
                            <span>Thay đổi</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {preferenceDisplayNames.map((tag) => (
                            <span
                              key={tag}
                              className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-teal-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : isAuthenticated ? (
                  /* Logged in but has not chosen preferences yet */
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                      <Sparkles size={16} className="text-amber-500" />
                      <span>Gợi ý cá nhân hóa</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Bạn chưa chọn sở thích du lịch. Hãy chọn sở thích để AI ưu tiên đề xuất điểm đến chuẩn gu nhất.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPrefModalOpen(true)}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={13} />
                      <span>Chọn sở thích ngay</span>
                    </button>
                  </div>
                ) : (
                  /* Guest not logged in */
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                      <Sparkles size={16} className="text-teal-700" />
                      <span>Gợi ý theo gu của bạn</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Đăng nhập để TravelMate tự động gợi ý điểm check-in & khách sạn theo sở thích của bạn.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/login');
                      }}
                      className="w-full py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Đăng nhập</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. DYNAMIC FILTERS: HOTELS TAB */}
              {activeTab === 'hotels' && (
                <>
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

                  <StarRatingFilter
                    selectedStars={selectedStars}
                    starCounts={starCounts}
                    onToggleStar={(starNum) => {
                      setSelectedStars((prev) =>
                        prev.includes(starNum) ? prev.filter((s) => s !== starNum) : [...prev, starNum]
                      );
                    }}
                    onReset={() => setSelectedStars([])}
                  />

                  <AmenitiesFilter
                    amenities={amenityStats}
                    selectedAmenities={selectedAmenities}
                    onToggleAmenity={(amenityName) => {
                      setSelectedAmenities((prev) =>
                        prev.includes(amenityName)
                          ? prev.filter((a) => a !== amenityName)
                          : [...prev, amenityName]
                      );
                    }}
                    onReset={() => setSelectedAmenities([])}
                    initialCount={5}
                  />
                </>
              )}

              {/* 3. DYNAMIC FILTERS: ATTRACTIONS (CHECK-IN) TAB */}
              {activeTab === 'spots' && (
                <AttractionFilterSidebar
                  ticketType={ticketType}
                  onTicketTypeChange={setTicketType}
                  ticketCounts={attractionTicketCounts}
                  hourType={hourType}
                  onHourTypeChange={setHourType}
                  hourCounts={attractionHourCounts}
                  minRating={spotMinRating}
                  onMinRatingChange={setSpotMinRating}
                  ratingCounts={attractionRatingCounts}
                  availableCategories={attractionCategoryStats}
                  selectedCategories={selectedSpotCategories}
                  onToggleCategory={(cat) => {
                    setSelectedSpotCategories((prev) =>
                      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                    );
                  }}
                  onResetCategories={() => setSelectedSpotCategories([])}
                  onResetAll={handleResetCurrentTabFilters}
                  hasActiveFilters={activeFilterCount > 0}
                />
              )}

              {/* 4. DYNAMIC FILTERS: ALL TAB */}
              {activeTab === 'all' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-3">
                      Đánh giá tối thiểu
                    </h3>
                    <div className="space-y-1.5">
                      {[
                        { val: 0, label: 'Tất cả mức đánh giá' },
                        { val: 4.5, label: 'Từ 4.5 sao trở lên' },
                        { val: 4.0, label: 'Từ 4.0 sao trở lên' },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setMinRatingAll(item.val)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            minRatingAll === item.val
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{item.label}</span>
                          {minRatingAll === item.val && (
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: Results Grid & Sort Bar                          */}
            {/* ============================================================== */}
            <main className="flex-1 overflow-y-auto p-5 sm:p-7 bg-slate-50 flex flex-col">
              {/* Top Sort & Count Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Hiển thị <span className="font-extrabold text-slate-900 text-base">{totalDisplayCount}</span>{' '}
                    {activeTab === 'spots'
                      ? 'điểm check-in'
                      : activeTab === 'hotels'
                      ? 'cơ sở lưu trú'
                      : 'dịch vụ & trải nghiệm'}
                  </p>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 self-end sm:self-auto bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 whitespace-nowrap">
                  <ArrowUpDown size={15} className="text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-600">Sắp xếp:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer pr-1 text-xs sm:text-sm font-bold text-slate-800"
                  >
                    <option value="recommended">
                      {isAuthenticated && userPreferences.length > 0
                        ? 'Ưu tiên theo sở thích của bạn'
                        : 'Gợi ý phù hợp nhất'}
                    </option>
                    <option value="rating">Đánh giá cao nhất</option>
                    {activeTab === 'hotels' && (
                      <>
                        <option value="price_asc">Giá: Thấp đến cao</option>
                        <option value="price_desc">Giá: Cao đến thấp</option>
                        <option value="stars_desc">Hạng sao: Cao đến thấp</option>
                      </>
                    )}
                    {activeTab === 'spots' && (
                      <>
                        <option value="reviews_desc">Nhiều đánh giá nhất</option>
                        <option value="free_first">Vé: Miễn phí trước</option>
                        <option value="name_asc">Tên: A đến Z</option>
                      </>
                    )}
                    {activeTab === 'all' && <option value="name_asc">Tên: A đến Z</option>}
                  </select>
                </div>
              </div>

              {/* Personalized Suggestion Banner */}
              {isAuthenticated && userPreferences.length > 0 ? (
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles size={16} className="text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-teal-950 flex items-center gap-2">
                        <span>Gợi ý cá nhân hóa theo gu của bạn</span>
                        <span className="bg-teal-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          AI Smart Match
                        </span>
                      </h4>
                      <p className="text-[11px] sm:text-xs text-teal-800 mt-0.5">
                        Đang xếp hạng ưu tiên theo gu: <strong className="font-bold">{preferenceDisplayNames.join(', ')}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPrefModalOpen(true)}
                    className="text-xs font-bold text-teal-800 hover:text-teal-950 bg-white border border-teal-200 px-3 py-1.5 rounded-xl shrink-0 cursor-pointer hover:bg-teal-50 shadow-xs transition self-start sm:self-auto"
                  >
                    Tùy chỉnh gu
                  </button>
                </div>
              ) : isAuthenticated ? (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                        Khám phá gợi ý cá nhân hóa theo sở thích
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-800 mt-0.5">
                        Chọn sở thích du lịch (Văn hóa, Ẩm thực, Khám phá...) để AI ưu tiên điểm đến phù hợp nhất.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrefModalOpen(true)}
                    className="text-xs font-bold text-amber-900 bg-white border border-amber-300 px-3.5 py-1.5 rounded-xl shrink-0 cursor-pointer hover:bg-amber-50 shadow-xs transition self-start sm:self-auto"
                  >
                    Chọn sở thích
                  </button>
                </div>
              ) : null}

              {/* Active Badges */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">
                      <span>Tìm: "{searchQuery}"</span>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {onlyMyPreferences && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">
                      <Sparkles size={12} className="text-emerald-700" />
                      <span>Theo sở thích của tôi</span>
                      <button
                        type="button"
                        onClick={() => setOnlyMyPreferences(false)}
                        className="hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {activeTab === 'hotels' && (minPrice > 0 || maxPrice < maxPossiblePrice) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-900">
                      <span>Khoảng giá đã chọn</span>
                      <button
                        type="button"
                        onClick={handleResetPrice}
                        className="hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {activeTab === 'hotels' &&
                    selectedStars.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900"
                      >
                        <Star size={11} className="fill-amber-500 text-amber-500" />
                        <span>{s} sao</span>
                        <button
                          type="button"
                          onClick={() => setSelectedStars((prev) => prev.filter((x) => x !== s))}
                          className="hover:text-rose-600 ml-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                  {activeTab === 'spots' && ticketType !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">
                      <span>Vé: {ticketType === 'free' ? 'Miễn phí' : 'Có thu phí'}</span>
                      <button
                        type="button"
                        onClick={() => setTicketType('all')}
                        className="hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {activeTab === 'spots' && hourType !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-900">
                      <span>Giờ: {hourType === 'all_day' ? 'Mở cửa cả ngày' : 'Khung giờ cố định'}</span>
                      <button
                        type="button"
                        onClick={() => setHourType('all')}
                        className="hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {activeTab === 'spots' &&
                    selectedSpotCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-900"
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSpotCategories((prev) => prev.filter((c) => c !== cat))
                          }
                          className="hover:text-rose-600 ml-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                  <button
                    type="button"
                    onClick={handleResetCurrentTabFilters}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer ml-1"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}

              {/* Results Grid */}
              <div className="flex-1">
                {totalDisplayCount > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {/* Spots Rendering */}
                    {(activeTab === 'all' || activeTab === 'spots') &&
                      filteredSpots.map((spot) => (
                        <AttractionCard
                          key={`modal-spot-${spot.maDiemTQ || spot.madiemtq}`}
                          spot={spot}
                          matchedList={getSpotMatchedPreferences(spot)}
                          defaultImage={defaultImage}
                          isCompact={true}
                          onToggleWishlist={onSubItemWishlist}
                          onNavigate={(spotId) => {
                            onClose();
                            if (onNavigate) onNavigate(`/service/attraction/${spotId}`);
                          }}
                        />
                      ))}

                    {/* Hotels Rendering */}
                    {(activeTab === 'all' || activeTab === 'hotels') &&
                      filteredHotels.map((hotel) => (
                        <HotelCard
                          key={`modal-hotel-${hotel.maKhachSan || hotel.makhachsan}`}
                          hotel={hotel}
                          matchedList={getHotelMatchedPreferences(hotel)}
                          defaultImage={defaultImage}
                          isCompact={true}
                          onToggleWishlist={onSubItemWishlist}
                          onNavigate={(hotelId) => {
                            onClose();
                            if (onNavigate) onNavigate(`/service/hotel/${hotelId}`);
                          }}
                        />
                      ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 my-auto">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={30} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      Không tìm thấy kết quả phù hợp
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto mb-5 leading-relaxed">
                      Không có dịch vụ hoặc điểm đến nào thỏa mãn tiêu chí lọc bạn đã chọn. Hãy thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetCurrentTabFilters}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Đặt lại bộ lọc này</span>
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Preferences Modal Dialog */}
      {isPrefModalOpen && (
        <PreferencesModal
          isOpen={isPrefModalOpen}
          onClose={() => setIsPrefModalOpen(false)}
        />
      )}
    </>
  );
};

export default React.memo(LocationExploreModal);
