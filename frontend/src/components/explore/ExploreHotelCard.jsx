import React from 'react';
import {
  MapPin,
  Heart,
  Star,
  Sparkles,
  ExternalLink,
  Check,
  ArrowRight,
} from 'lucide-react';

const ExploreHotelCard = ({
  hotel,
  onToggleWishlist,
  onNavigate,
  onBookingRedirect,
  formatCurrency,
}) => {
  return (
    <div
      onClick={() => onNavigate(`/service/hotel/${hotel.maKhachSan}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group cursor-pointer flex flex-col"
    >
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img
          src={hotel.anhDaiDien || '/images/vinh_ha_long.jpg'}
          alt={hotel.ten}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(hotel.maKhachSan);
          }}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-sm transition ${
            hotel.isFavorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          title="Lưu vào danh sách yêu thích"
        >
          <Heart
            className={`w-4 h-4 ${hotel.isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Match score badge */}
        {hotel.matchScore > 0 && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phù hợp sở thích</span>
          </div>
        )}

        {/* Stars pill */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>{hotel.soSao || 4} sao</span>
          {hotel.diemDanhGia && (
            <span className="text-gray-300 font-normal">
              • {parseFloat(hotel.diemDanhGia).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{hotel.tenDiaDiem || hotel.tinhThanh}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-1">
            {hotel.ten}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-1 mb-3">
            {hotel.diaChi}
          </p>

          {/* Quick Amenities */}
          {Array.isArray(hotel.tienNghi) && hotel.tienNghi.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {hotel.tienNghi.slice(0, 2).map((am, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="line-clamp-1">{typeof am === 'string' ? am : am.ten}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center">
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-rose-600">
              {formatCurrency(hotel.giaThamKhao)}
            </span>
            <span className="text-xs text-slate-400 block">{hotel.donViTinh || '/đêm'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookingRedirect(hotel.bookingUrl, hotel.maKhachSan);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>Đặt phòng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHotelCard;

