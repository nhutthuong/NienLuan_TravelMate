import React from 'react';
import { Sparkles, Check } from 'lucide-react';

const PreferenceToggle = ({
  isActive = false,
  onToggle,
  label = 'Ưu tiên theo sở thích',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full p-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-between cursor-pointer border select-none ${
        isActive
          ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white border-teal-700 shadow-md shadow-teal-700/20'
          : 'bg-teal-50/70 hover:bg-teal-50 text-teal-900 border-teal-200'
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <Sparkles size={16} className={isActive ? 'text-amber-300' : 'text-teal-700'} />
        <span>{label}</span>
      </div>
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
          isActive ? 'bg-white text-teal-700' : 'border-2 border-teal-400'
        }`}
      >
        {isActive && <Check size={11} className="stroke-[3.5]" />}
      </span>
    </button>
  );
};

export default React.memo(PreferenceToggle);

