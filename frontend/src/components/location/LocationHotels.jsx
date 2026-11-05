import React from 'react';
import {
  Building,
  ChevronRight,
  Heart,
  Star,
  MapPin,
  Check,
  ExternalLink,
} from 'lucide-react';

const LocationHotels = ({
  hotels = [],
  defaultImage = '/images/vinh_ha_long.jpg',
  onOpenModal,
  onNavigateHotel,
  onSubItemWishlist,
  onBookingRedirect,
  formatCurrency,
}) => {
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-emerald-600" />
            Không gian nghỉ dưỡng
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Cơ sở lưu trú & Khách sạn nghỉ dưỡng
          </h2>
        </div>
        {hotels.length > 0 && (
          <button
            onClick={onOpenModal}
            className="group flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer w-fit"
          >
            Xem tất cả {hotels.length} khách sạn
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {hotels.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-gray-500">
          Chưa có thông tin khách sạn hoặc resort lưu trú cho địa danh này.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.maKhachSan}
              onClick={() => onNavigateHotel(hotel.maKhachSan)}
              className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow group"
            >
              <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden bg-slate-100">
                <img
                  src={hotel.anhDaiDien || defaultImage}
                  alt={hotel.ten}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => onSubItemWishlist(e, 'hotel', hotel.maKhachSan)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition ${
                    hotel.isFavorited
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-black/30 hover:bg-black/50 text-white'
                  }`}
                  title="Lưu khách sạn"
                >
                  <Heart
                    className={`w-4 h-4 ${hotel.isFavorited ? 'fill-rose-500' : ''}`}
                  />
                </button>
                {hotel.diemNoiBat && (
                  <span className="absolute bottom-3 left-3 bg-white/95 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {hotel.diemNoiBat}
                  </span>
                )}
              </div>

              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {hotel.ten}
                    </h3>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (hotel.soSao || 4)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {hotel.diemDanhGia && (
                        <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                          {parseFloat(hotel.diemDanhGia).toFixed(1)} / 5.0
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">{hotel.diaChi}</span>
                  </p>

                  {/* Tien nghi */}
                  {Array.isArray(hotel.tienNghi) && hotel.tienNghi.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      {hotel.tienNghi.slice(0, 4).map((am, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {typeof am === 'string' ? am : am.ten}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Price & Booking Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-dashed border-gray-200 mt-2 gap-3">
                  <div>
                    <span className="text-2xl font-extrabold text-rose-600">
                      {formatCurrency(hotel.giaThamKhao)}
                    </span>
                    <span className="text-xs text-gray-400 block">
                      {hotel.donViTinh || '/đêm'}
                    </span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={(e) =>
                        onBookingRedirect(e, hotel.bookingUrl, hotel.maKhachSan)
                      }
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Đặt phòng</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LocationHotels;

