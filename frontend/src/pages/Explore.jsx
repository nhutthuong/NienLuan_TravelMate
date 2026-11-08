import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../services/api';
import ExploreTabs from '../components/explore/ExploreTabs';
import DestinationsView from '../components/explore/DestinationsView';
import HotelsView from '../components/explore/HotelsView';

const Explore = ({ defaultTab = 'destinations' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'hotels' ? 'hotels' : (tabParam === 'destinations' ? 'destinations' : defaultTab);

  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || 'Tất cả';

  // Data states fetched from Database
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hotels, setHotels] = useState([]);

  // Loading states
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);

  const handleTabChange = useCallback((newTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', newTab);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Load destinations & categories from Backend Database
  useEffect(() => {
    let isMounted = true;
    setLoadingDestinations(true);

    Promise.all([
      api.locations.getAll().catch(() => []),
      api.locations.getCategories().catch(() => []),
    ]).then(([locData, catData]) => {
      if (!isMounted) return;

      if (Array.isArray(locData)) {
        setDestinations(locData);
      }
      if (Array.isArray(catData)) {
        setCategories(catData);
      }
      setLoadingDestinations(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Load hotels from Backend Database
  useEffect(() => {
    let isMounted = true;
    setLoadingHotels(true);

    api.hotels
      .getAll()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setHotels(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingHotels(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update hotel wishlist state locally
  const handleHotelWishlistChange = useCallback((hotelId, isFavorited) => {
    setHotels((prev) =>
      prev.map((h) =>
        (h.maKhachSan === hotelId || h.makhachsan === hotelId)
          ? { ...h, isFavorited, is_favorited: isFavorited }
          : h
      )
    );
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Header Title */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {activeTab === 'hotels' ? 'Khám Phá Khu Nghỉ Dưỡng & Khách Sạn' : 'Khám Phá Điểm Đến Tuyệt Vời'}
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
              {activeTab === 'hotels'
                ? 'Tuyển tập khách sạn, resort và không gian lưu trú cao cấp tại các thiên đường du lịch Việt Nam.'
                : 'Bộ lọc giúp bạn tìm kiếm và lựa chọn những địa điểm du lịch phù hợp với sở thích cá nhân của bạn.'}
            </p>
          </div>

          {/* Main Tab Switcher */}
          <ExploreTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            destinationsCount={destinations.length}
            hotelsCount={hotels.length}
          />

          {/* Tab 1: 10 Địa danh tiêu biểu */}
          {activeTab === 'destinations' && (
            <DestinationsView
              destinations={destinations}
              categories={categories}
              loading={loadingDestinations}
              initialSearch={initialSearch}
              initialCategory={initialCat}
            />
          )}

          {/* Tab 2: Khu nghỉ dưỡng & Khách sạn */}
          {activeTab === 'hotels' && (
            <HotelsView
              hotels={hotels}
              loading={loadingHotels}
              onHotelWishlistChange={handleHotelWishlistChange}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
