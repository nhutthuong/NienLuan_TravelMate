import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Ticket, Star, Heart, Sparkles, ChevronRight } from 'lucide-react';

const AttractionCard = ({
  spot,
  matchedList = [],
  onToggleWishlist,
  onNavigate,
  defaultImage = '/images/vinh_ha_long.jpg',
  isCompact = false,
}) => {
  const navigate = useNavigate();

  const spotId = spot.maDiemTQ || spot.madiemtq;
  const spotImg = spot.anhDaiDien || spot.anh_dai_dien || defaultImage;
  const spotName = spot.ten || spot.name;
  const highlight = spot.diemNoiBat || spot.diemnoibat || spot.moTa;
  const rating = parseFloat(spot.diemDanhGia || spot.diem_danh_gia || 5.0).toFixed(1);
  const reviewCount = spot.soDanhGia || spot.so_danh_gia || 0;
  const ticket = spot.giaVe || spot.giave || 'Miễn phí';
  const hours = spot.gioMoCua || spot.giomocua || 'Mở cửa cả ngày';
  const isFav = Boolean(spot.isFavorited || spot.is_favorited);
  const categories = Array.isArray(spot.loaiHinh) ? spot.loaiHinh : [];

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(spotId);
    } else {
      navigate(`/service/attraction/${spotId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-xl hover:border-sky-500/40 transition-all duration-300 group cursor-pointer flex flex-col ${
        isCompact ? 'h-full' : ''
      }`}
    >
      {/* Image & Overlays */}
      <div className={`relative overflow-hidden bg-slate-100 ${isCompact ? 'h-48' : 'h-56'}`}>
        <img
          src={spotImg}
          alt={spotName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Type Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-sky-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 z-10">
          <span>Điểm tham quan</span>
        </div>

        {/* Matched Preference Badge */}
        {matchedList && matchedList.length > 0 && (
          <div className="absolute top-12 left-3 z-10 max-w-[85%]">
            <div className="bg-slate-900/90 backdrop-blur-md text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md border border-amber-300/40 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">Khớp với sở thích: {matchedList.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(e, spotId);
            }}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
              isFav
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-black/35 hover:bg-black/55 text-white'
            }`}
            title="Lưu điểm tham quan"
          >
            <Heart size={18} className={isFav ? 'fill-rose-500' : ''} />
          </button>
        )}

        {/* Rating Floating Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
            <Star size={13} className="fill-amber-300 text-amber-300" />
            <span>{rating}</span>
            {reviewCount > 0 && <span className="text-slate-300 text-[11px] font-normal">({reviewCount})</span>}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {categories.slice(0, 2).map((cat, i) => (
                <span
                  key={i}
                  className="bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-md text-[11px]"
                >
                  {cat}
                </span>
              ))}
              {categories.length > 2 && (
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[11px]">
                  +{categories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1 mb-1.5">
            {spotName}
          </h3>

          {/* Highlight / Description */}
          {highlight && (
            <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
              {highlight}
            </p>
          )}
        </div>

        {/* Details & Hours / Ticket Footer */}
        <div className="border-t border-slate-100 pt-3 space-y-2 mt-auto text-xs">
          {/* Hours */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock size={13} />
              <span>Giờ mở cửa</span>
            </span>
            <span className="font-semibold text-slate-800 whitespace-nowrap">{hours}</span>
          </div>

          {/* Ticket */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Ticket size={13} />
              <span>Vé tham quan</span>
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md max-w-[65%] truncate text-right">
              {ticket}
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-sky-700 hover:text-sky-800 font-bold text-xs sm:text-sm flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Xem chi tiết</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AttractionCard);

