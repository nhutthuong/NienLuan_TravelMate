import React from 'react';
import {
  MapPin,
  Filter,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Star,
  DollarSign,
  Compass,
  Building,
  Ticket,
} from 'lucide-react';

const ExploreFilterBar = ({
  activeType,
  setActiveType,
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  onClearCategories,
  locationsList = [],
  selectedLocation,
  setSelectedLocation,
  priceRange,
  setPriceRange,
  selectedStars,
  setSelectedStars,
  sortOption,
  setSortOption,
  onResetAll,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-8 space-y-5">
      {/* 1. Main Type Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveType('locations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
              activeType === 'locations'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Địa danh du lịch</span>
          </button>

          <button
            onClick={() => setActiveType('attractions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
              activeType === 'attractions'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Điểm tham quan</span>
          </button>

          <button
            onClick={() => setActiveType('hotels')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
              activeType === 'hotels'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Khách sạn & Resort</span>
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={onResetAll}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>

      {/* 2. Categories Pills Carousel / Multi-select */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            Chủ đề & Sở thích du lịch ({selectedCategories.length > 0 ? `${selectedCategories.length} đã chọn` : 'Tất cả'})
          </span>

          {selectedCategories.length > 0 && (
            <button
              onClick={onClearCategories}
              className="text-xs text-sky-600 hover:text-sky-800 font-semibold cursor-pointer underline"
            >
              Bỏ chọn tất cả
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onClearCategories}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
              selectedCategories.length === 0
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Tất cả chủ đề
          </button>

          {categories.map((cat) => {
            const catId = cat.maLoaiHinh || cat.maloaihinh;
            const isSelected = selectedCategories.includes(catId);

            return (
              <button
                key={catId}
                onClick={() => onToggleCategory(catId)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{cat.ten}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Secondary Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
        {/* Loc theo Dia danh */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Khu vực / Tỉnh thành
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer appearance-none"
            >
              <option value="">Toàn quốc (10 danh thắng)</option>
              {locationsList.map((loc) => (
                <option key={loc.maDiaDiem} value={loc.maDiaDiem}>
                  {loc.ten} ({loc.tinhThanh})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Khoang gia (chi ap dung cho Khach san) */}
        {activeType === 'hotels' ? (
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Khoảng giá / đêm
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer appearance-none"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="under_1m">Dưới 1.000.000đ</option>
                <option value="1m_3m">1.000.000đ – 3.000.000đ</option>
                <option value="3m_5m">3.000.000đ – 5.000.000đ</option>
                <option value="above_5m">Trên 5.000.000đ</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        {/* Hang sao (chi ap dung cho Khach san) */}
        {activeType === 'hotels' ? (
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Hạng khách sạn
            </label>
            <div className="relative">
              <Star className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedStars}
                onChange={(e) => setSelectedStars(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer appearance-none"
              >
                <option value="">Tất cả hạng sao</option>
                <option value="5">5 sao sang trọng</option>
                <option value="4">4 sao trở lên</option>
                <option value="3">3 sao trở lên</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        {/* Sap xep */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sắp xếp theo
          </label>
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer appearance-none"
            >
              <option value="">Phù hợp sở thích của bạn</option>
              <option value="rating">Đánh giá cao nhất</option>
              {activeType === 'hotels' && (
                <>
                  <option value="price_asc">Giá: Thấp đến cao</option>
                  <option value="price_desc">Giá: Cao đến thấp</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreFilterBar;

