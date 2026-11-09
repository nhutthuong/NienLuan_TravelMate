import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// Modular child components
import LocationHero from '../components/location/LocationHero';
import LocationOverview from '../components/location/LocationOverview';
import LocationAttractions from '../components/location/LocationAttractions';
import LocationHotels from '../components/location/LocationHotels';
import LocationRelated from '../components/location/LocationRelated';
import LocationSidebar from '../components/location/LocationSidebar';
import LocationMapModal from '../components/location/LocationMapModal';
import LocationExploreModal from '../components/location/LocationExploreModal';

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
      <div className="flex-1 flex flex-col bg-slate-50 justify-between">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 font-sans flex-1">
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
        <Footer />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 justify-between">
        <div className="max-w-4xl mx-auto px-4 pt-36 pb-24 text-center font-sans flex-1">
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
        <Footer />
      </div>
    );
  }

  const spotsList = location.attractions || [];
  const hotelsList = location.hotels || [];
  const rawRelatedList = location.relatedLocations || [];

  // Logic hiển thị địa điểm liên quan:
  // - Nếu đến từ nhận diện AI (isFromAI): hiển thị 2 địa điểm còn lại trong Top 2, Top 3 + 2 địa điểm tương đồng chủ đề
  // - Nếu xem trực tiếp (không tải ảnh nhận diện): hiển thị 4 địa điểm tương đồng chủ đề
  const aiTopK = Array.isArray(locationState.state?.topK) ? locationState.state.topK : [];
  const currentId = resolveLocationId(id);

  let displayRelatedLocations = [];
  if (isFromAI && aiTopK.length > 1) {
    // 1. Lấy 2 địa điểm còn lại trong Top 2 và Top 3 dự đoán của mô hình AI (khác địa điểm hiện tại)
    const otherAiLocations = aiTopK
      .filter((k) => k.maDiaDiem !== currentId)
      .slice(0, 2)
      .map((k, idx) => ({
        maDiaDiem: k.maDiaDiem,
        ten: k.ten || k.locationName,
        tinhThanh: k.tinhThanh || 'Việt Nam',
        danhHieu: k.danhHieu || `Độ tin cậy AI: ${k.confidence}%`,
        anhUrl: k.anhUrl || '/images/vinh_ha_long.jpg',
        isFromAiTopK: true,
        topRank: idx + 2,
        confidence: k.confidence,
      }));

    // Tập hợp các ID đã có (địa điểm hiện tại + 2 địa điểm Top 2, Top 3)
    const usedIds = new Set(otherAiLocations.map((item) => item.maDiaDiem));
    usedIds.add(currentId);

    // 2. Lấy thêm 2 địa điểm theo mức độ tương đồng chủ đề (không trùng với Top 2, Top 3)
    const remainingSimilar = rawRelatedList
      .filter((r) => !usedIds.has(r.maDiaDiem))
      .slice(0, 2);

    displayRelatedLocations = [...otherAiLocations, ...remainingSimilar];
  } else {
    // Nếu chọn xem trực tiếp: render 4 địa điểm theo mức độ tương đồng
    displayRelatedLocations = rawRelatedList.slice(0, 4);
  }

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
    <div className="flex-1 flex flex-col bg-slate-50 justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 text-gray-800 font-sans flex-1">
        {/* Hero Section */}
        <LocationHero
          location={location}
          isFromAI={isFromAI}
          aiConfidence={aiConfidence}
          isFavorited={isFavorited}
          wishlistLoading={wishlistLoading}
          onToggleWishlist={handleToggleWishlist}
          attractionsCount={spotsList.length}
          hotelsCount={hotelsList.length}
          onScanAnother={() => navigate('/?tab=ai')}
        />

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Left Column */}
          <div className="flex-1 space-y-10">
            <LocationOverview location={location} />

            <LocationAttractions
              attractions={spotsList}
              defaultImage={location.anhUrl}
              onOpenModal={() => {
                setActiveTab('spots');
                setShowAllModal(true);
              }}
              onNavigateSpot={(spotId) => navigate(`/service/attraction/${spotId}`)}
              onSubItemWishlist={handleSubItemWishlist}
            />

            <LocationHotels
              hotels={hotelsList}
              defaultImage={location.anhUrl}
              onOpenModal={() => {
                setActiveTab('hotels');
                setShowAllModal(true);
              }}
              onNavigateHotel={(hotelId) => navigate(`/service/hotel/${hotelId}`)}
              onSubItemWishlist={handleSubItemWishlist}
              onBookingRedirect={handleBookingRedirect}
              formatCurrency={formatCurrency}
            />

            <LocationRelated
              relatedLocations={displayRelatedLocations}
              defaultImage={location.anhUrl}
            />
          </div>

          {/* Right Sidebar */}
          <LocationSidebar
            location={location}
            onOpenMap={() => setShowMapPopup(true)}
            onOpenHotelsModal={() => {
              setActiveTab('hotels');
              setShowAllModal(true);
            }}
          />
        </div>

        {/* Interactive Map Modal */}
        {showMapPopup && (
          <LocationMapModal
            location={location}
            onClose={() => setShowMapPopup(false)}
          />
        )}

        {/* Explore All Modal Drawer */}
        {showAllModal && (
          <LocationExploreModal
            locationName={location.ten}
            defaultImage={location.anhUrl}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchKeyword={modalSearch}
            setSearchKeyword={setModalSearch}
            filteredSpots={filteredSpots}
            filteredHotels={filteredHotels}
            spotsCount={spotsList.length}
            hotelsCount={hotelsList.length}
            onClose={() => setShowAllModal(false)}
            onNavigate={(path) => navigate(path)}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LocationDetail;
