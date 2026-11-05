import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  MapPin,
  Clock,
  Compass,
  Check,
  ExternalLink,
  ChevronLeft,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Phone,
  X,
  Image as ImageIcon,
  Building,
  Ticket
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const ServiceDetail = () => {
  const { type, id } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isHotel = type === 'hotel';
  const isAttraction = type === 'attraction' || type === 'spot';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Gallery Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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

      // Re-fetch details to show updated reviews and average rating
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

  // Build images list for the 5-photo grid
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
    // Pad to 5 images so grid never has empty slots
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
          {/* Breadcrumb Back Link */}
          <div className="mb-4">
            <Link
              to={data.maDiaDiem ? `/location/${data.maDiaDiem}` : '/explore'}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại {data.tenDiaDiem ? `danh thắng ${data.tenDiaDiem}` : 'Khám phá'}</span>
            </Link>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    isHotel
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {isHotel ? 'Cơ sở lưu trú & Khách sạn nghỉ dưỡng' : 'Điểm tham quan & Khám phá'}
                </span>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const ratingScore = isHotel ? data.soSao : data.diemDanhGia || 5;
                    const fillPercent = Math.max(0, Math.min(100, (ratingScore - star + 1) * 100));
                    return (
                      <div key={star} className="relative w-4 h-4">
                        <Star className="w-4 h-4 text-gray-200 fill-gray-200 absolute top-0 left-0" />
                        <div
                          className="overflow-hidden absolute top-0 left-0 h-4"
                          style={{ width: `${fillPercent}%` }}
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                      </div>
                    );
                  })}
                  <span className="text-xs font-bold text-gray-700 ml-1">
                    {averageRating} / 5.0
                  </span>
                  <span className="text-xs text-gray-400">
                    ({data.soDanhGia || reviewsList.length} đánh giá)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                {data.ten}
              </h1>

              <p className="text-gray-600 text-sm flex flex-wrap items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{data.diaChi}</span>
                {data.tenDiaDiem && <span>• {data.tenDiaDiem}</span>}
                {data.tinhThanh && <span>, {data.tinhThanh}</span>}
                <button
                  onClick={handleDirections}
                  className="ml-2 text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem trên bản đồ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition border cursor-pointer ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-500'
                  }`}
                />
                <span>{isFavorited ? 'Đã lưu yêu thích' : 'Lưu lại'}</span>
              </button>
            </div>
          </div>

          {/* Image Gallery 5-Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-3xl overflow-hidden mb-10 h-[300px] sm:h-[420px] md:h-[480px] shadow-sm">
            {/* Anh to ben trai */}
            <div
              onClick={() => {
                setActivePhotoIndex(0);
                setShowGalleryModal(true);
              }}
              className="md:col-span-2 h-full cursor-pointer group overflow-hidden relative bg-slate-100"
            >
              <img
                src={images[0]}
                alt={`${data.ten} 1`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
            </div>

            {/* 2 anh cot giua */}
            <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
              <div
                onClick={() => {
                  setActivePhotoIndex(1);
                  setShowGalleryModal(true);
                }}
                className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
              >
                <img
                  src={images[1]}
                  alt={`${data.ten} 2`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
              </div>
              <div
                onClick={() => {
                  setActivePhotoIndex(2);
                  setShowGalleryModal(true);
                }}
                className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
              >
                <img
                  src={images[2]}
                  alt={`${data.ten} 3`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
              </div>
            </div>

            {/* 2 anh cot phai */}
            <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
              <div
                onClick={() => {
                  setActivePhotoIndex(3);
                  setShowGalleryModal(true);
                }}
                className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
              >
                <img
                  src={images[3]}
                  alt={`${data.ten} 4`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
              </div>
              {/* Anh cuoi co overlay Xem tat ca */}
              <div
                onClick={() => {
                  setActivePhotoIndex(4);
                  setShowGalleryModal(true);
                }}
                className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
              >
                <img
                  src={images[4]}
                  alt={`${data.ten} 5`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/45 hover:bg-black/60 transition duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-base flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Xem tất cả ảnh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: 2 Columns */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content Column */}
            <div className="flex-1 space-y-10">
              {/* Thong tin gioi thieu */}
              <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-sky-600" />
                  Thông tin giới thiệu
                </h2>
                <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line mb-6">
                  {data.moTa}
                </div>

                {data.diemNoiBat && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
                    <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm mb-0.5">Điểm nhấn trải nghiệm:</h4>
                      <p className="text-sm leading-relaxed">{data.diemNoiBat}</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Tien nghi (Hotel) hoac Hoat dong (Attraction) */}
              <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  {isHotel ? (
                    <>
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      Tiện nghi & Dịch vụ chuẩn nghỉ dưỡng
                    </>
                  ) : (
                    <>
                      <Ticket className="w-6 h-6 text-sky-600" />
                      Hoạt động & Thông tin tham quan
                    </>
                  )}
                </h2>

                {/* Neu la Hotel: Tien nghi */}
                {isHotel && (
                  <div>
                    {Array.isArray(data.tienNghi) && data.tienNghi.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.tienNghi.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                          >
                            <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-gray-800 font-semibold text-sm block">
                                {typeof item === 'string' ? item : item.ten}
                              </span>
                              {item.ghiChu && (
                                <span className="text-xs text-gray-500 block mt-0.5">
                                  {item.ghiChu}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Tiện nghi cơ bản gồm phòng nghỉ cao cấp, dịch vụ dọn phòng và lễ tân.
                      </p>
                    )}
                  </div>
                )}

                {/* Neu la Attraction: Hoat dong, gio mo cua, gia ve */}
                {isAttraction && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          Giờ mở cửa đón khách
                        </span>
                        <span className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-sky-600" />
                          {data.gioMoCua || 'Cả ngày (06:00 – 18:00)'}
                        </span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          Giá vé tham khảo
                        </span>
                        <span className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                          <Ticket className="w-4 h-4 text-emerald-600" />
                          {data.giaVe || 'Miễn phí'}
                        </span>
                      </div>
                    </div>

                    {Array.isArray(data.hoatDong) && data.hoatDong.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                          Các trải nghiệm nổi bật:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {data.hoatDong.map((act, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-sky-50/50 rounded-2xl border border-sky-100/60"
                            >
                              <div className="mt-0.5 w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-gray-800 font-semibold text-sm block">
                                  {act.ten}
                                </span>
                                {act.ghiChu && (
                                  <span className="text-xs text-gray-500 block mt-0.5">
                                    {act.ghiChu}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Review Section */}
              <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-sky-600" />
                      Đánh giá từ khách hàng
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Nhận xét chân thực từ cộng đồng thành viên TravelMate
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-2xl font-bold text-lg border border-amber-200/80 w-fit">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{averageRating}</span>
                    <span className="text-xs text-amber-600 font-normal">/ 5.0</span>
                  </div>
                </div>

                {/* Form gui danh gia */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 mb-8">
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    Chia sẻ trải nghiệm của bạn
                  </h3>

                  {isAuthenticated ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {reviewSuccessMsg && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
                          {reviewSuccessMsg}
                        </div>
                      )}
                      {reviewErrorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
                          {reviewErrorMsg}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Số sao đánh giá
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setReviewRating(star)}
                              className="p-1 focus:outline-none transition cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  star <= (hoverRating || reviewRating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-semibold text-gray-500 ml-2">
                            {hoverRating || reviewRating} / 5 sao
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Nội dung nhận xét
                        </label>
                        <textarea
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Chia sẻ cảm nhận về dịch vụ, phong cảnh, ẩm thực hoặc chất lượng phòng nghỉ..."
                          className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          <span>{submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
                      <p className="text-gray-600 text-sm mb-3">
                        Bạn cần đăng nhập tài khoản thành viên để viết nhận xét và chấm điểm cho dịch vụ này.
                      </p>
                      <button
                        onClick={() => navigate('/login', { state: { from: locationState.pathname } })}
                        className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  )}
                </div>

                {/* Danh sach danh gia */}
                <div className="space-y-4">
                  {reviewsList.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và chia sẻ nhận xét!
                    </div>
                  ) : (
                    reviewsList.map((review) => (
                      <div
                        key={review.maDanhGia}
                        className="bg-slate-50 p-5 rounded-2xl border border-slate-100"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {review.avatarUrl ? (
                              <img
                                src={review.avatarUrl}
                                alt={review.hoTen}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                                {review.hoTen ? review.hoTen.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">
                                {review.hoTen || 'Thành viên TravelMate'}
                              </h4>
                              <span className="text-xs text-gray-400">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(review.danhGia)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          "{review.binhLuan}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Right Sidebar - Sticky Booking Widget */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8">
                {/* Price Section */}
                <div className="mb-6">
                  <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider mb-3 inline-block">
                    {isHotel ? 'ƯU ĐÃI NGHỈ DƯỠNG' : 'THAM QUAN TRẢI NGHIỆM'}
                  </span>

                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-rose-600">
                      {isHotel ? formatCurrency(data.giaThamKhao) : data.giaVe || 'Miễn phí'}
                    </span>
                    {isHotel && (
                      <span className="text-gray-500 font-medium pb-1 text-sm">
                        {data.donViTinh || '/đêm'}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs">
                    * Mức giá tham khảo, có thể thay đổi tùy thời điểm mùa cao điểm.
                  </div>
                </div>

                {/* Location summary card */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Khu vực:</span>
                    <span className="font-bold text-gray-800">{data.tenDiaDiem || data.tinhThanh}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Đánh giá chung:</span>
                    <span className="font-bold text-amber-700">
                      {averageRating} / 5.0 ({data.soDanhGia || reviewsList.length} lượt)
                    </span>
                  </div>
                  {isHotel && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500">Phân hạng:</span>
                      <span className="font-bold text-gray-800">{data.soSao} sao quốc tế</span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  {isHotel ? (
                    <button
                      onClick={handleAffiliateBooking}
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Đặt phòng qua đối tác</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleDirections}
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 bg-sky-600 hover:bg-sky-700 shadow-sky-200/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Chỉ đường & Đến tham quan</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full py-3 rounded-xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Liên hệ tư vấn</span>
                  </button>
                </div>

                {/* Trust Points */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="text-xs text-gray-500 space-y-2.5">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Thông tin địa điểm đã được kiểm chứng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Đặt phòng an toàn qua các cổng đối tác uy tín</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Hỗ trợ gợi ý lịch trình thông minh cùng TravelMate</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowGalleryModal(false)}
        >
          <div
            className="max-w-4xl w-full relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition cursor-pointer p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full max-h-[75vh] rounded-2xl overflow-hidden mb-4 bg-black flex items-center justify-center">
              <img
                src={images[activePhotoIndex]}
                alt={`${data.ten} full`}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto p-2 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${
                    activePhotoIndex === idx ? 'border-sky-400 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition cursor-pointer p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Hỗ trợ thông tin du lịch</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Bạn cần giải đáp về chính sách dịch vụ, đặt vé đoàn hoặc thông tin đặt phòng tại{' '}
              <strong className="text-gray-900">{data.ten}</strong>?
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                <span className="text-xs text-gray-500 block">Đường dây nóng hỗ trợ khách hàng:</span>
                <span className="font-bold text-sky-700 text-base">1900 6868 (8:00 - 21:00)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                <span className="text-xs text-gray-500 block">Email tư vấn lịch trình:</span>
                <span className="font-bold text-gray-800">support@travelmate.com</span>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ServiceDetail;
