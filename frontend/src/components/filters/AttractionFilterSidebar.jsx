import React from 'react';
import { Ticket, Clock, Star, Check, Layers, RotateCcw } from 'lucide-react';

const AttractionFilterSidebar = ({
  // Ticket Filter
  ticketType = 'all', // 'all' | 'free' | 'paid'
  onTicketTypeChange,
  ticketCounts = { all: 0, free: 0, paid: 0 },

  // Opening Hours Filter
  hourType = 'all', // 'all' | 'all_day' | 'fixed'
  onHourTypeChange,
  hourCounts = { all: 0, all_day: 0, fixed: 0 },

  // Rating Filter
  minRating = 0, // 0 | 4.0 | 4.5 | 5.0
  onMinRatingChange,
  ratingCounts = { all: 0, 5: 0, 4.5: 0, 4: 0 },

  // Category / Loai Hinh Filter
  availableCategories = [], // array of [categoryName, count]
  selectedCategories = [],
  onToggleCategory,
  onResetCategories,

  // Reset all
  onResetAll,
  hasActiveFilters = false,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Vé tham quan (Ticket Price) */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
            <Ticket size={16} className="text-emerald-600" />
            <span>Vé tham quan</span>
          </div>
          {ticketType !== 'all' && (
            <button
              type="button"
              onClick={() => onTicketTypeChange && onTicketTypeChange('all')}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
            >
              Tất cả
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onTicketTypeChange && onTicketTypeChange('all')}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
              ticketType === 'all'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            Tất cả ({ticketCounts.all || 0})
          </button>
          <button
            type="button"
            onClick={() => onTicketTypeChange && onTicketTypeChange('free')}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
              ticketType === 'free'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            Miễn phí ({ticketCounts.free || 0})
          </button>
          <button
            type="button"
            onClick={() => onTicketTypeChange && onTicketTypeChange('paid')}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
              ticketType === 'paid'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            Có phí ({ticketCounts.paid || 0})
          </button>
        </div>
      </div>

      {/* 2. Đánh giá (Rating Score) */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span>Đánh giá tối thiểu</span>
          </div>
          {minRating > 0 && (
            <button
              type="button"
              onClick={() => onMinRatingChange && onMinRatingChange(0)}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {[
            { val: 0, label: 'Tất cả mức đánh giá', count: ratingCounts.all },
            { val: 5.0, label: '5 sao tuyệt đối', count: ratingCounts[5] },
            { val: 4.5, label: 'Từ 4.5 sao trở lên', count: ratingCounts[4.5] },
            { val: 4.0, label: 'Từ 4.0 sao trở lên', count: ratingCounts[4] },
          ].map((item) => {
            const isSelected = minRating === item.val;
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => onMinRatingChange && onMinRatingChange(item.val)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className="text-slate-400 font-normal">({item.count || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Giờ mở cửa (Opening Hours) */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
            <Clock size={16} className="text-sky-600" />
            <span>Thời gian mở cửa</span>
          </div>
          {hourType !== 'all' && (
            <button
              type="button"
              onClick={() => onHourTypeChange && onHourTypeChange('all')}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
            >
              Tất cả
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {[
            { key: 'all', label: 'Tất cả khung giờ', count: hourCounts.all },
            { key: 'all_day', label: 'Mở cửa tự do / Cả ngày', count: hourCounts.all_day },
            { key: 'fixed', label: 'Có khung giờ quy định', count: hourCounts.fixed },
          ].map((item) => {
            const isSelected = hourType === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onHourTypeChange && onHourTypeChange(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className="text-slate-400 font-normal">({item.count || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Loại hình du lịch / Trải nghiệm (Loai Hinh Du Lich) */}
      {availableCategories.length > 0 && (
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
              <Layers size={16} className="text-teal-700" />
              <span>Loại hình trải nghiệm</span>
            </div>
            {selectedCategories.length > 0 && onResetCategories && (
              <button
                type="button"
                onClick={onResetCategories}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
              >
                Bỏ chọn ({selectedCategories.length})
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {availableCategories.map(([catName, count]) => {
              const isChecked = selectedCategories.includes(catName);

              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => onToggleCategory && onToggleCategory(catName)}
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
                    <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug truncate" title={catName}>
                      {catName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-semibold">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Global reset if any active filters */}
      {hasActiveFilters && onResetAll && (
        <div>
          <button
            type="button"
            onClick={onResetAll}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Đặt lại toàn bộ tiêu chí check-in</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(AttractionFilterSidebar);

