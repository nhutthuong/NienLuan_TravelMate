import React, { useState } from 'react';

const formatNumberVN = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
};

const PriceRangeFilter = ({
  minPrice = 0,
  maxPrice = 25000000,
  maxPossiblePrice = 25000000,
  step = 500000,
  onChange,
  onReset,
  title = 'Khoảng giá',
  subtitle = '1 phòng, 1 đêm',
  unit = 'VND',
}) => {
  const [prevMin, setPrevMin] = useState(minPrice);
  const [prevMax, setPrevMax] = useState(maxPrice);
  const [minInput, setMinInput] = useState(() => formatNumberVN(minPrice));
  const [maxInput, setMaxInput] = useState(() => formatNumberVN(maxPrice));

  // Sync inputs when props change externally without cascading effect renders
  if (prevMin !== minPrice) {
    setPrevMin(minPrice);
    setMinInput(formatNumberVN(minPrice));
  }
  if (prevMax !== maxPrice) {
    setPrevMax(maxPrice);
    setMaxInput(formatNumberVN(maxPrice));
  }

  const handleMinSliderChange = (e) => {
    const val = Math.min(Number(e.target.value), maxPrice - step);
    const clamped = Math.max(0, val);
    setMinInput(formatNumberVN(clamped));
    if (onChange) {
      onChange({ min: clamped, max: maxPrice });
    }
  };

  const handleMaxSliderChange = (e) => {
    const val = Math.max(Number(e.target.value), minPrice + step);
    const clamped = Math.min(maxPossiblePrice, val);
    setMaxInput(formatNumberVN(clamped));
    if (onChange) {
      onChange({ min: minPrice, max: clamped });
    }
  };

  const handleMinInputDirectChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setMinInput('');
      return;
    }
    const num = parseInt(raw, 10);
    setMinInput(formatNumberVN(num));
    if (onChange) {
      onChange({ min: Math.min(num, maxPossiblePrice), max: maxPrice });
    }
  };

  const handleMinInputBlur = () => {
    const num = parseInt((minInput || '0').replace(/\D/g, ''), 10) || 0;
    const clamped = Math.max(0, Math.min(num, maxPrice - step));
    setMinInput(formatNumberVN(clamped));
    if (onChange) {
      onChange({ min: clamped, max: maxPrice });
    }
  };

  const handleMaxInputDirectChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setMaxInput('');
      return;
    }
    const num = parseInt(raw, 10);
    setMaxInput(formatNumberVN(num));
    if (onChange) {
      onChange({ min: minPrice, max: Math.min(num, maxPossiblePrice) });
    }
  };

  const handleMaxInputBlur = () => {
    const num = parseInt((maxInput || '0').replace(/\D/g, ''), 10) || maxPossiblePrice;
    const clamped = Math.min(maxPossiblePrice, Math.max(num, minPrice + step));
    setMaxInput(formatNumberVN(clamped));
    if (onChange) {
      onChange({ min: minPrice, max: clamped });
    }
  };

  const isFiltered = minPrice > 0 || maxPrice < maxPossiblePrice;
  const minPercent = Math.min(100, Math.max(0, (minPrice / maxPossiblePrice) * 100));
  const maxPercent = Math.min(100, Math.max(0, (maxPrice / maxPossiblePrice) * 100));

  return (
    <div className="pb-6 border-b border-slate-100">
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{title}</h3>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {isFiltered && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
          >
            Đặt lại
          </button>
        )}
      </div>

      {/* Dual Range Slider Track */}
      <div className="relative pt-6 pb-3 px-1">
        {/* Background Line */}
        <div className="h-2 w-full bg-slate-200 rounded-full relative" />

        {/* Active Colored Bar */}
        <div
          className="absolute top-6 h-2 bg-sky-500 rounded-full pointer-events-none"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min Price Slider Input */}
        <input
          type="range"
          min={0}
          max={maxPossiblePrice}
          step={step}
          value={minPrice}
          onChange={handleMinSliderChange}
          className="absolute top-4 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none cursor-pointer z-20 
            [&::-webkit-slider-thumb]:pointer-events-auto 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-[2.5px] 
            [&::-webkit-slider-thumb]:border-sky-500 
            [&::-webkit-slider-thumb]:shadow-md 
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:hover:scale-110 
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:pointer-events-auto 
            [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:h-5 
            [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-[2.5px] 
            [&::-moz-range-thumb]:border-sky-500 
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:hover:scale-110"
        />

        {/* Max Price Slider Input */}
        <input
          type="range"
          min={0}
          max={maxPossiblePrice}
          step={step}
          value={maxPrice}
          onChange={handleMaxSliderChange}
          className="absolute top-4 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none cursor-pointer z-30 
            [&::-webkit-slider-thumb]:pointer-events-auto 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-[2.5px] 
            [&::-webkit-slider-thumb]:border-sky-500 
            [&::-webkit-slider-thumb]:shadow-md 
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:hover:scale-110 
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:pointer-events-auto 
            [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:h-5 
            [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-[2.5px] 
            [&::-moz-range-thumb]:border-sky-500 
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:hover:scale-110"
        />
      </div>

      {/* Direct Editable Price Inputs */}
      <div className="flex items-center justify-between gap-2.5 mt-2">
        <div className="flex-1 bg-white border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 rounded-full px-3 py-1.5 flex items-center justify-between shadow-xs transition-all">
          <input
            type="text"
            inputMode="numeric"
            value={minInput}
            onChange={handleMinInputDirectChange}
            onBlur={handleMinInputBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent outline-none pr-1"
            placeholder="0"
            title="Nhập giá tối thiểu cụ thể"
          />
          <span className="text-[11px] font-bold text-slate-400 shrink-0 select-none">{unit}</span>
        </div>
        <span className="text-slate-400 font-bold px-0.5">-</span>
        <div className="flex-1 bg-white border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 rounded-full px-3 py-1.5 flex items-center justify-between shadow-xs transition-all">
          <input
            type="text"
            inputMode="numeric"
            value={maxInput}
            onChange={handleMaxInputDirectChange}
            onBlur={handleMaxInputBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent outline-none pr-1"
            placeholder={formatNumberVN(maxPossiblePrice)}
            title="Nhập giá tối đa cụ thể"
          />
          <span className="text-[11px] font-bold text-slate-400 shrink-0 select-none">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PriceRangeFilter);
