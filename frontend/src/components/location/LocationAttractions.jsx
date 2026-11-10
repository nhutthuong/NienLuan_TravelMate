import React from 'react';
import { Camera, ChevronRight, Clock, Heart, Star, Ticket } from 'lucide-react';

const LocationAttractions = ({
  attractions = [],
  defaultImage = '/images/vinh_ha_long.jpg',
  onOpenModal,
  onNavigateSpot,
  onSubItemWishlist,
}) => {
  return (
    <section>
      <div className="flex justify-between items-end mb-5">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-sky-600" />
            Hành trình khám phá
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Điểm tham quan &amp; Check-in tiêu biểu
          </h2>
        </div>
        {attractions.length > 0 && (
          <button
            onClick={onOpenModal}
            className="group flex items-center gap-1.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer"
          >
            Xem tất cả {attractions.length} địa điểm
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {attractions.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-gray-500">
          Chưa có thông tin điểm tham quan nào cho địa danh này.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {attractions.map((spot) => (
            <div
              key={spot.maDiemTQ}
              onClick={() => onNavigateSpot(spot.maDiemTQ)}
              className="bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={spot.anhDaiDien || defaultImage}
                  alt={spot.ten}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => onSubItemWishlist(e, 'attraction', spot.maDiemTQ)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition ${
                    spot.isFavorited
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-black/30 hover:bg-black/50 text-white'
                  }`}
                  title="Lưu điểm tham quan"
                >
                  <Heart
                    className={`w-4 h-4 ${spot.isFavorited ? 'fill-rose-500' : ''}`}
                  />
                </button>
                {spot.diemDanhGia && (
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    {parseFloat(spot.diemDanhGia).toFixed(1)}
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
                    {spot.ten}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {spot.diemNoiBat || spot.moTa || 'Điểm check-in nổi bật không thể bỏ qua.'}
                  </p>
                </div>

                {/* Structured Hours & Ticket Info without awkward line wrapping */}
                <div className="pt-3 border-t border-slate-100 text-xs space-y-2 mt-auto">
                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span className="flex items-center gap-1.5 shrink-0 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Giờ mở cửa</span>
                    </span>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">
                      {spot.gioMoCua || 'Mở cửa cả ngày'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 shrink-0 text-slate-500">
                      <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Vé tham quan</span>
                    </span>
                    <span
                      className="font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg text-right truncate max-w-[62%]"
                      title={spot.giaVe || 'Miễn phí'}
                    >
                      {spot.giaVe || 'Miễn phí'}
                    </span>
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

export default LocationAttractions;

