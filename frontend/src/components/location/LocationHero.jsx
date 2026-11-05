import React from 'react';
import {
  Heart,
  Camera,
  MapPin,
  Compass,
  Clock,
  Building,
  Sparkles,
} from 'lucide-react';

const LocationHero = ({
  location,
  isFromAI,
  aiConfidence,
  isFavorited,
  wishlistLoading,
  onToggleWishlist,
  attractionsCount,
  hotelsCount,
  onScanAnother,
}) => {
  return (
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
          onClick={onToggleWishlist}
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
          onClick={onScanAnother}
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
              {attractionsCount} điểm tham quan • {hotelsCount} khách sạn
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationHero;

