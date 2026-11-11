import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Trash2, Sparkles, ChevronRight } from 'lucide-react';

const DestinationCard = ({
  destination,
  matchedList = [],
  onToggleWishlist,
  onRemove,
  onNavigate,
  defaultImage = '/images/vinh_ha_long.jpg',
}) => {
  const navigate = useNavigate();

  const destId = destination.maDiaDiem || destination.id;
  const destName = destination.ten || destination.title || destination.name;
  const location = destination.tinhThanh || destination.location;
  const image = destination.anhUrl || destination.anh_url || destination.image || defaultImage;
  const desc = destination.moTa || destination.mota || destination.desc || '';
  const isFav = Boolean(destination.isFavorited || destination.is_favorited);

  const categoriesList =
    Array.isArray(destination.loaiHinh) && destination.loaiHinh.length > 0
      ? destination.loaiHinh
      : Array.isArray(destination.loai_hinh) && destination.loai_hinh.length > 0
      ? destination.loai_hinh
      : destination.category
      ? [destination.category]
      : ['Khám phá'];

  const visibleCategories = categoriesList.slice(0, 2);
  const remainingCount = Math.max(0, categoriesList.length - visibleCategories.length);

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(destId);
    } else {
      navigate(`/location/${destId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-sky-500/40 transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      {/* Image & Overlays */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={destName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Personalized match badge on image overlay */}
        {matchedList.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="bg-slate-900/90 backdrop-blur-md text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md border border-amber-300/40">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">Khớp với sở thích: {matchedList.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Action Button: onRemove (Trash) or onToggleWishlist (Heart) */}
        {onRemove ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(destination);
            }}
            className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/95 hover:bg-rose-500 text-rose-500 hover:text-white shadow-sm backdrop-blur-sm transition-all cursor-pointer"
            title="Xóa khỏi danh sách yêu thích"
          >
            <Trash2 size={17} />
          </button>
        ) : onToggleWishlist ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(e, destId);
            }}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
              isFav
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-black/35 hover:bg-black/55 text-white'
            }`}
            title="Lưu địa điểm yêu thích"
          >
            <Heart size={18} className={isFav ? 'fill-rose-500' : ''} />
          </button>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
              {destName}
            </h3>
          </div>
          {location && (
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
              <MapPin size={15} className="text-slate-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {desc && (
            <p className="text-slate-600 text-sm mb-5 line-clamp-2 leading-relaxed">{desc}</p>
          )}
        </div>

        {/* Bottom Footer: Multiple Categories Chips + Hover Tooltip */}
        <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center mt-auto gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
            {visibleCategories.map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium truncate max-w-[110px]"
                title={cat}
              >
                {cat}
              </span>
            ))}

            {remainingCount > 0 && (
              <div
                className="relative group/tooltip inline-flex items-center cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="px-1.5 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold cursor-pointer transition-colors">
                  +{remainingCount}
                </span>

                {/* Hover Tooltip with full category details */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:flex flex-col z-30 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-xs backdrop-blur-md pointer-events-none border border-slate-700 min-w-[160px] max-w-[240px]">
                  <span className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                    Tất cả loại hình ({categoriesList.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {categoriesList.map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-white/15 px-1.5 py-0.5 rounded text-[11px] font-medium text-white"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-2.5 border-r border-b border-slate-700" />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-sky-600 hover:text-sky-700 font-bold text-xs sm:text-sm flex items-center gap-0.5 shrink-0 cursor-pointer ml-auto group-hover:translate-x-0.5 transition-transform"
          >
            <span>Chi tiết</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DestinationCard);

