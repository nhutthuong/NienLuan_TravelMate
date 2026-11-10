import React from 'react';
import { Star, Check } from 'lucide-react';

const StarRatingFilter = ({
  selectedStars = [],
  starCounts = {},
  onToggleStar,
  onReset,
  stars = [5, 4, 3],
  title = 'Hạng sao',
}) => {
  return (
    <div className="pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
          {title}
        </h3>
        {selectedStars.length > 0 && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
          >
            Bỏ chọn
          </button>
        )}
      </div>

      <div className="space-y-2">
        {stars.map((starNum) => {
          const isChecked = selectedStars.includes(starNum);
          const count = starCounts[starNum] !== undefined ? starCounts[starNum] : 0;

          return (
            <button
              key={starNum}
              type="button"
              onClick={() => onToggleStar && onToggleStar(starNum)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
                isChecked
                  ? 'bg-amber-50/90 border-amber-300 text-slate-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all ${
                    isChecked ? 'bg-amber-500 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check size={11} className="stroke-[3.5]" />}
                </span>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: starNum }).map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <span className="text-xs sm:text-sm font-bold text-slate-800 ml-1">
                  {starNum} sao
                </span>
              </div>

              <span className="text-xs text-slate-400 font-semibold">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(StarRatingFilter);

