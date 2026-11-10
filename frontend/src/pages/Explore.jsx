import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExploreTabs from '../components/explore/ExploreTabs';
import DestinationsView from '../components/explore/DestinationsView';
import HotelsView from '../components/explore/HotelsView';

const Explore = ({ defaultTab = 'destinations' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

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

  // Key to trigger re-fetch when user auth or user preferences change
  const userKey = user ? `${user.maNguoiDung}_${(user.soThich || []).join(',')}` : 'guest';

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
  }, [userKey]);

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
      .catch(() => { })
      .finally(() => {
        if (isMounted) setLoadingHotels(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userKey]);

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
      <div className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

          {/* Tab 2: Khu nghỉ dưỡng và Khách sạn */}
          {activeTab === 'hotels' && (
            <HotelsView
              hotels={hotels}
              categories={categories}
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
