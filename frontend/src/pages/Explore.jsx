import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// Modular child components
import ExploreHero from '../components/explore/ExploreHero';
import ExploreFilterBar from '../components/explore/ExploreFilterBar';
import ExploreLocationCard from '../components/explore/ExploreLocationCard';
import ExploreAttractionCard from '../components/explore/ExploreAttractionCard';
import ExploreHotelCard from '../components/explore/ExploreHotelCard';
import ExploreEmptyState from '../components/explore/ExploreEmptyState';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationState = useLocation();
  const { isAuthenticated } = useAuth();

  // Active Type: 'locations' | 'attractions' | 'hotels'
  const initialType = searchParams.get('type') || 'locations';
  const [activeType, setActiveType] = useState(initialType);

  // Search keyword
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Categories
  const [categories, setCategories] = useState([]);
  const initialCats = searchParams.get('categories')
    ? searchParams.get('categories').split(',').map((c) => c.trim()).filter(Boolean)
    : searchParams.get('category')
    ? [searchParams.get('category').trim()]
    : [];
  const [selectedCategories, setSelectedCategories] = useState(initialCats);

  // Locations / Destinations list (10 core destinations)
  const [locationsList, setLocationsList] = useState([]);
  const initialLocation = searchParams.get('location') || searchParams.get('maDiaDiem') || '';
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // Hotel specific filters
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [selectedStars, setSelectedStars] = useState(searchParams.get('stars') || '');

  // Sorting
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');

  // Results state
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch metadata on initial load (Categories & Locations)
  useEffect(() => {
    let isMounted = true;
    const loadInitialMetadata = async () => {
      try {
        const [catsRes, locsRes] = await Promise.all([
          api.locations.getCategories(),
          api.locations.getAll(),
        ]);
        if (isMounted) {
          setCategories(Array.isArray(catsRes) ? catsRes : []);
          setLocationsList(Array.isArray(locsRes) ? locsRes : []);
        }
      } catch (err) {
        console.error('Loi khi tai danh muc/dia danh:', err.message);
      }
    };

    loadInitialMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Main Fetch Function based on activeType and filters
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (selectedCategories.length > 0) {
        params.maLoaiHinh = selectedCategories.join(',');
      }
      if (selectedLocation) {
        params.maDiaDiem = selectedLocation;
      }

      let results = [];
      if (activeType === 'locations') {
        results = await api.locations.getAll({
          search: params.search,
          maLoaiHinh: params.maLoaiHinh,
        });
      } else if (activeType === 'attractions') {
        results = await api.attractions.getAll({
          search: params.search,
          maLoaiHinh: params.maLoaiHinh,
          maDiaDiem: params.maDiaDiem,
        });
      } else if (activeType === 'hotels') {
        // Parse price range
        let minPrice = null;
        let maxPrice = null;
        if (priceRange === 'under_1m') {
          maxPrice = 1000000;
        } else if (priceRange === '1m_3m') {
          minPrice = 1000000;
          maxPrice = 3000000;
        } else if (priceRange === '3m_5m') {
          minPrice = 3000000;
          maxPrice = 5000000;
        } else if (priceRange === 'above_5m') {
          minPrice = 5000000;
        }

        results = await api.hotels.getAll({
          search: params.search,
          maLoaiHinh: params.maLoaiHinh,
          maDiaDiem: params.maDiaDiem,
          minPrice,
          maxPrice,
          soSao: selectedStars || null,
          sort: sortOption || '',
        });
      }

      setDataList(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error('Loi khi loc du lieu:', err.message);
      setError(err.message || 'Không thể tải danh sách kết quả.');
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }, [
    activeType,
    searchQuery,
    selectedCategories,
    selectedLocation,
    priceRange,
    selectedStars,
    sortOption,
  ]);

  // Trigger fetch when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Synchronize with URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeType !== 'locations') params.set('type', activeType);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedLocation) params.set('location', selectedLocation);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (selectedStars) params.set('stars', selectedStars);
    if (sortOption) params.set('sort', sortOption);

    setSearchParams(params, { replace: true });
  }, [
    activeType,
    searchQuery,
    selectedCategories,
    selectedLocation,
    priceRange,
    selectedStars,
    sortOption,
    setSearchParams,
  ]);

  // Handlers
  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLocation('');
    setPriceRange('all');
    setSelectedStars('');
    setSortOption('');
  };

  const handleToggleWishlist = async (itemId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: locationState.pathname } });
      return;
    }

    try {
      let payload = {};
      if (activeType === 'locations') payload = { maDiaDiem: itemId };
      else if (activeType === 'attractions') payload = { maDiemTQ: itemId };
      else if (activeType === 'hotels') payload = { maKhachSan: itemId };

      const res = await api.wishlist.toggle(payload);

      setDataList((prev) =>
        prev.map((item) => {
          const currentId = item.maDiaDiem || item.maDiemTQ || item.maKhachSan;
          return currentId === itemId ? { ...item, isFavorited: res.isFavorited } : item;
        })
      );
    } catch (err) {
      console.error('Loi khi toggle wishlist:', err.message);
    }
  };

  const handleBookingRedirect = (bookingUrl, fallbackId) => {
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

  const getResultsTitle = () => {
    if (activeType === 'locations') return 'Địa danh du lịch';
    if (activeType === 'attractions') return 'Điểm tham quan & Check-in';
    return 'Khách sạn & Khu nghỉ dưỡng';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ExploreHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={fetchData}
        />

        {/* Filter Controls Bar */}
        <ExploreFilterBar
          activeType={activeType}
          setActiveType={setActiveType}
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onClearCategories={handleClearCategories}
          locationsList={locationsList}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedStars={selectedStars}
          setSelectedStars={setSelectedStars}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onResetAll={handleResetAll}
        />

        {/* Results Count & Status Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 text-sm text-slate-600 gap-2">
          <div>
            Hiển thị <strong className="text-slate-900">{dataList.length}</strong> {getResultsTitle()}
            {selectedLocation && (
              <span>
                {' '}
                tại{' '}
                <strong className="text-sky-700">
                  {locationsList.find((l) => l.maDiaDiem === selectedLocation)?.ten ||
                    selectedLocation}
                </strong>
              </span>
            )}
            {selectedCategories.length > 0 && (
              <span>
                {' '}
                với <strong className="text-slate-800">{selectedCategories.length} chủ đề</strong>
              </span>
            )}
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 h-96 animate-pulse"
              >
                <div className="h-60 bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded-lg w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-lg mx-auto mb-16">
            <h3 className="text-lg font-bold text-rose-800 mb-2">Đã xảy ra lỗi khi tải dữ liệu</h3>
            <p className="text-rose-600 text-sm mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
            >
              Thử lại
            </button>
          </div>
        ) : dataList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {activeType === 'locations' &&
              dataList.map((location) => (
                <ExploreLocationCard
                  key={location.maDiaDiem}
                  location={location}
                  onToggleWishlist={handleToggleWishlist}
                  onNavigate={(path) => navigate(path)}
                />
              ))}

            {activeType === 'attractions' &&
              dataList.map((attraction) => (
                <ExploreAttractionCard
                  key={attraction.maDiemTQ}
                  attraction={attraction}
                  onToggleWishlist={handleToggleWishlist}
                  onNavigate={(path) => navigate(path)}
                />
              ))}

            {activeType === 'hotels' &&
              dataList.map((hotel) => (
                <ExploreHotelCard
                  key={hotel.maKhachSan}
                  hotel={hotel}
                  onToggleWishlist={handleToggleWishlist}
                  onNavigate={(path) => navigate(path)}
                  onBookingRedirect={handleBookingRedirect}
                  formatCurrency={formatCurrency}
                />
              ))}
          </div>
        ) : (
          <ExploreEmptyState
            searchQuery={searchQuery}
            onReset={handleResetAll}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
