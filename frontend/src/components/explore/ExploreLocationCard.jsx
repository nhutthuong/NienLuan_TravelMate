import React from 'react';
import { MapPin, Heart, Sparkles, Building, Ticket, ArrowRight } from 'lucide-react';

const ExploreLocationCard = ({ location, onToggleWishlist, onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate(`/location/${location.maDiaDiem}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-300 transition-all duration-300 group cursor-pointer flex flex-col"
    >
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img
          src={location.anhUrl || '/images/vinh_ha_long.jpg'}
          alt={location.ten}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(location.maDiaDiem);
          }}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-sm transition ${
            location.isFavorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          title="Lưu vào danh sách yêu thích"
        >
          <Heart
            className={`w-4 h-4 ${location.isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Match score badge */}
        {location.matchScore > 0 && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phù hợp sở thích</span>
          </div>
        )}

        {/* Bottom banner: province */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span>{location.tinhThanh}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {location.danhHieu && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 line-clamp-1">
                {location.danhHieu}
              </span>
            )}
            {Array.isArray(location.loaiHinh) &&
              location.loaiHinh.slice(0, 2).map((lh, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  {lh}
                </span>
              ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug mb-2 line-clamp-1">
            {location.ten}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {location.moTa}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-sky-600" />
              {location.totalAttractions || 0} điểm
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              {location.totalHotels || 0} KS
            </span>
          </span>

          <span className="text-sky-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExploreLocationCard;

