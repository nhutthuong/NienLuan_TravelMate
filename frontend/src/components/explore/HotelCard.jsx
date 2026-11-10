import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, ExternalLink, Sparkles } from 'lucide-react';

const formatCurrency = (amount) => {
  if (!amount) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const HotelCard = ({
  hotel,
  matchedList = [],
  onToggleWishlist,
  onNavigate,
  defaultImage = '/images/vinh_ha_long.jpg',
  isCompact = false,
}) => {
  const navigate = useNavigate();

  const hotelId = hotel.maKhachSan || hotel.makhachsan;
  const hotelImg = hotel.anhDaiDien || hotel.anh_dai_dien || defaultImage;
  const hotelName = hotel.ten || hotel.name;
  const destinationName =
    hotel.tenDiaDiem || hotel.ten_dia_diem || hotel.tinhThanh || hotel.tinhthanh;
  const address = hotel.diaChi || hotel.diachi;
  const stars = Math.min(5, Math.max(1, Math.round(parseFloat(hotel.soSao || hotel.sosao || 5))));
  const rating = parseFloat(hotel.diemDanhGia || hotel.diem_danh_gia || hotel.soSao || 4.8).toFixed(1);
  const reviewCount = hotel.soDanhGia || hotel.so_danh_gia || 100;
  const price = hotel.giaThamKhao || hotel.giathamkhao;
  const priceUnit = hotel.donViTinh || hotel.donvitinh || '/đêm';
  const highlight = hotel.diemNoiBat || hotel.diemnoibat;
  const isFav = Boolean(hotel.isFavorited || hotel.is_favorited);
  const amenities = Array.isArray(hotel.tienNghi) ? hotel.tienNghi : [];

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(hotelId);
    } else {
      navigate(`/service/hotel/${hotelId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-xl hover:border-teal-600/40 transition-all duration-300 group cursor-pointer flex flex-col ${
        isCompact ? 'h-full' : ''
      }`}
    >
      {/* Image & Overlay Badges */}
      <div className={`relative overflow-hidden bg-slate-100 ${isCompact ? 'h-48' : 'h-60'}`}>
        <img
          src={hotelImg}
          alt={hotelName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Destination Badge */}
        {destinationName && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-teal-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 z-10">
            <MapPin size={13} className="text-teal-700" />
            <span>{destinationName}</span>
          </div>
        )}

        {/* Personalized Match Badge */}
        {matchedList && matchedList.length > 0 && (
          <div className={`absolute left-3 z-10 max-w-[85%] ${destinationName ? 'top-12' : 'top-3'}`}>
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
              onToggleWishlist(e, hotelId);
            }}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
              isFav
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-black/35 hover:bg-black/55 text-white'
            }`}
            title="Lưu khách sạn yêu thích"
          >
            <Heart size={18} className={isFav ? 'fill-rose-500' : ''} />
          </button>
        )}

        {/* Highlight Tag */}
        {highlight && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <span className="inline-block bg-teal-950/85 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-medium truncate max-w-full">
              {highlight}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Stars & Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={15}
                  className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-md border border-amber-200/50">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              {rating} ({reviewCount})
            </span>
          </div>

          {/* Hotel Name */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-1.5">
            {hotelName}
          </h3>

          {/* Address */}
          {address && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm mb-3">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          )}

          {/* Amenities Chips */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {amenities.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-medium truncate max-w-[160px]"
                >
                  {typeof item === 'string' ? item : item.ten}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-bold">
                  +{amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Short Description */}
          {hotel.moTa && !isCompact && (
            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
              {hotel.moTa}
            </p>
          )}
        </div>

        {/* Bottom Price & Action Buttons */}
        <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Giá từ
            </span>
            <div className="text-base sm:text-xl font-black text-teal-700 leading-tight">
              {formatCurrency(price)}
              <span className="text-xs font-normal text-slate-400 ml-1">
                {priceUnit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hotel.bookingUrl && (
              <a
                href={hotel.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                title="Đặt phòng trực tuyến"
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-700 hover:text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Chi tiết</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HotelCard);

