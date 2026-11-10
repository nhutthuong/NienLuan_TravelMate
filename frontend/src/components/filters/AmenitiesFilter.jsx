import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const AmenitiesFilter = ({
  amenities = [],
  selectedAmenities = [],
  onToggleAmenity,
  onReset,
  initialCount = 6,
  title = 'Tiện nghi',
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!amenities || amenities.length === 0) return null;

  const visibleAmenities = showAll ? amenities : amenities.slice(0, initialCount);
  const remainingCount = amenities.length - initialCount;

  return (
    <div className="pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
          {title}
        </h3>
        {selectedAmenities.length > 0 && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
          >
            Bỏ chọn ({selectedAmenities.length})
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {visibleAmenities.map(([name, count]) => {
          const isChecked = selectedAmenities.includes(name);

          return (
            <button
              key={name}
              type="button"
              onClick={() => onToggleAmenity && onToggleAmenity(name)}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer select-none group ${
                isChecked
                  ? 'bg-teal-50/90 text-teal-950 font-bold border border-teal-200/80 shadow-xs'
                  : 'hover:bg-slate-50 text-slate-700 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span
                  className={`w-4 h-4 rounded-[4px] shrink-0 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-teal-700 text-white'
                      : 'border border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isChecked && <Check size={11} className="stroke-[3.5]" />}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug truncate" title={name}>
                  {name}
                </span>
              </div>
              <span className="text-xs text-slate-400 shrink-0 font-semibold">
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {amenities.length > initialCount && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-2.5 text-xs sm:text-sm text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer hover:underline"
        >
          {showAll ? (
            <>
              <span>Thu gọn tiện nghi</span>
              <ChevronUp size={15} />
            </>
          ) : (
            <>
              <span>Xem thêm ({remainingCount}) tiện nghi</span>
              <ChevronDown size={15} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default React.memo(AmenitiesFilter);
