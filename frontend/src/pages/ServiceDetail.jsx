import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// Modular child components
import ServiceHeader from '../components/service/ServiceHeader';
import ServiceGallery from '../components/service/ServiceGallery';
import ServiceInfo from '../components/service/ServiceInfo';
import ServiceReviews from '../components/service/ServiceReviews';
import ServiceSidebar from '../components/service/ServiceSidebar';
import ServiceContactModal from '../components/service/ServiceContactModal';

const ServiceDetail = () => {
  const { type, id } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isHotel = type === 'hotel';
  const isAttraction = type === 'attraction' || type === 'spot';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  // Consultation Modal
  const [showContactModal, setShowContactModal] = useState(false);

  const fetchServiceDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result = null;
      if (isHotel) {
        result = await api.hotels.getById(id);
      } else {
        result = await api.attractions.getById(id);
      }

      setData(result);
      setIsFavorited(Boolean(result.isFavorited));
    } catch (err) {
      console.error('Loi khi tai thong tin dich vu:', err.message);
      setError(err.message || 'Khong the tai thong tin dich vu');
    } finally {
      setLoading(false);
    }
  }, [id, isHotel]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchServiceDetail();
  }, [fetchServiceDetail]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: locationState.pathname } });
      return;
    }
    if (!data) return;

    try {
      setWishlistLoading(true);
      const payload = isHotel
        ? { maKhachSan: data.maKhachSan }
        : { maDiemTQ: data.maDiemTQ };
      const res = await api.wishlist.toggle(payload);
      setIsFavorited(Boolean(res.isFavorited));
    } catch (err) {
      console.error('Loi toggle wishlist dich vu:', err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAffiliateBooking = () => {
    if (data?.bookingUrl && data.bookingUrl !== '#' && data.bookingUrl.startsWith('http')) {
      window.open(data.bookingUrl, '_blank', 'noopener,noreferrer');
    } else {
      const partnerSearch = `https://www.google.com/search?q=${encodeURIComponent(
        `${data.ten} ${data.diaChi || ''} đặt phòng`
      )}`;
      window.open(partnerSearch, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${data.ten} ${data.diaChi || ''} ${data.tinhThanh || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: locationState.pathname } });
      return;
    }

    if (!reviewComment.trim()) {
      setReviewErrorMsg('Vui lòng nhập nội dung nhận xét của bạn.');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewErrorMsg('');
      setReviewSuccessMsg('');

      if (isHotel) {
        await api.hotels.addReview(data.maKhachSan, {
          danhGia: reviewRating,
          binhLuan: reviewComment.trim(),
        });
      } else {
        await api.attractions.addReview(data.maDiemTQ, {
          danhGia: reviewRating,
          binhLuan: reviewComment.trim(),
        });
      }

      setReviewSuccessMsg('Cảm ơn bạn! Đánh giá đã được gửi thành công.');
      setReviewComment('');
      setReviewRating(5);

      await fetchServiceDetail();
    } catch (err) {
      setReviewErrorMsg(err.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getImagesList = () => {
    const list = [];
    if (data?.media && Array.isArray(data.media) && data.media.length > 0) {
      data.media.forEach((m) => {
        if (m.url) list.push(m.url);
      });
    }
    if (data?.anhDaiDien && !list.includes(data.anhDaiDien)) {
      list.unshift(data.anhDaiDien);
    }
    if (list.length === 0) {
      list.push('/images/vinh_ha_long.jpg');
    }
    const defaults = [
      '/images/vinh_ha_long.jpg',
      '/images/cau_vang.jpg',
      '/images/hoi_an.jpg',
      '/images/trang_an.jpg',
      '/images/phu_quoc.jpg',
    ];
    let idx = 0;
    while (list.length < 5) {
      list.push(defaults[idx % defaults.length]);
      idx++;
    }
    return list;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin chi tiết dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-24 text-center font-sans">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-gray-600 text-sm mb-6">
            Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/explore"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Khám phá dịch vụ khác
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

  const images = getImagesList();
  const reviewsList = data.danhGia || [];
  const averageRating = parseFloat(data.diemDanhGia || (isHotel ? data.soSao : 5.0)).toFixed(1);

  return (
    <>
      <main className="bg-slate-50 pt-28 pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ServiceHeader
            data={data}
            isHotel={isHotel}
            averageRating={averageRating}
            reviewsCount={data.soDanhGia || reviewsList.length}
            isFavorited={isFavorited}
            wishlistLoading={wishlistLoading}
            onToggleWishlist={handleToggleWishlist}
            onDirections={handleDirections}
          />

          {/* Gallery */}
          <ServiceGallery
            images={images}
            serviceName={data.ten}
          />

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content Column */}
            <div className="flex-1 space-y-10">
              <ServiceInfo
                data={data}
                isHotel={isHotel}
                isAttraction={isAttraction}
              />

              <ServiceReviews
                reviewsList={reviewsList}
                averageRating={averageRating}
                isAuthenticated={isAuthenticated}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                submittingReview={submittingReview}
                reviewSuccessMsg={reviewSuccessMsg}
                reviewErrorMsg={reviewErrorMsg}
                onReviewSubmit={handleReviewSubmit}
                onNavigateLogin={() =>
                  navigate('/login', { state: { from: locationState.pathname } })
                }
                formatDate={formatDate}
              />
            </div>

            {/* Right Sidebar */}
            <ServiceSidebar
              data={data}
              isHotel={isHotel}
              averageRating={averageRating}
              reviewsCount={data.soDanhGia || reviewsList.length}
              onAffiliateBooking={handleAffiliateBooking}
              onDirections={handleDirections}
              onOpenContactModal={() => setShowContactModal(true)}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </main>

      {/* Consultation Modal */}
      {showContactModal && (
        <ServiceContactModal
          serviceName={data.ten}
          onClose={() => setShowContactModal(false)}
        />
      )}

      <Footer />
    </>
  );
};

export default ServiceDetail;
