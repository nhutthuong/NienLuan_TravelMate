import React from 'react';
import { MapPin, Heart, Star, Sparkles, Clock, Ticket, ArrowRight } from 'lucide-react';

const ExploreAttractionCard = ({ attraction, onToggleWishlist, onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate(`/service/attraction/${attraction.maDiemTQ}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-300 transition-all duration-300 group cursor-pointer flex flex-col"
    >
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img
          src={attraction.anhDaiDien || '/images/cau_vang.jpg'}
          alt={attraction.ten}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(attraction.maDiemTQ);
          }}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-sm transition ${
            attraction.isFavorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          title="Lưu vào danh sách yêu thích"
        >
          <Heart
            className={`w-4 h-4 ${attraction.isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Match score badge */}
        {attraction.matchScore > 0 && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phù hợp sở thích</span>
          </div>
        )}

        {/* Rating badge */}
        {attraction.diemDanhGia && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{parseFloat(attraction.diemDanhGia).toFixed(1)}</span>
            <span className="text-[10px] text-gray-300 font-normal">
              ({attraction.soDanhGia || 0})
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold mb-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{attraction.tenDiaDiem || attraction.tinhThanh}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug mb-2 line-clamp-1">
            {attraction.ten}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {attraction.diemNoiBat || attraction.moTa || 'Điểm tham quan hấp dẫn nổi bật.'}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3.5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="line-clamp-1">{attraction.gioMoCua || 'Cả ngày'}</span>
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {attraction.giaVe || 'Miễn phí'}
            </span>
          </div>

          <div className="flex justify-end items-center pt-1 text-xs">
            <span className="text-sky-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAttractionCard;

