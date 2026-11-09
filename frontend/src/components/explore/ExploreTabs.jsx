import React from 'react';
import { Compass, Building } from 'lucide-react';

const ExploreTabs = ({ activeTab, onTabChange, destinationsCount = 0, hotelsCount = 0 }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-2 shadow-inner">
        <button
          type="button"
          onClick={() => onTabChange('destinations')}
          className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeTab === 'destinations'
              ? 'bg-white text-primary shadow-sm scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
        >
          <Compass size={20} className={activeTab === 'destinations' ? 'text-primary' : 'text-slate-500'} />
          <span>10 Địa danh tiêu biểu</span>
          {destinationsCount > 0 && (
            <span
              className={`text-xs sm:text-sm px-2.5 py-0.5 rounded-full font-semibold ${activeTab === 'destinations' ? 'bg-sky-50 text-sky-700' : 'bg-slate-300/60 text-slate-600'
                }`}
            >
              {destinationsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('hotels')}
          className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${activeTab === 'hotels'
              ? 'bg-white text-teal-700 shadow-sm scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
        >
          <Building size={20} className={activeTab === 'hotels' ? 'text-teal-700' : 'text-slate-500'} />
          <span>Khu nghỉ dưỡng và Khách sạn</span>
          {hotelsCount > 0 && (
            <span
              className={`text-xs sm:text-sm px-2.5 py-0.5 rounded-full font-semibold ${activeTab === 'hotels' ? 'bg-teal-50 text-teal-700' : 'bg-slate-300/60 text-slate-600'
                }`}
            >
              {hotelsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ExploreTabs);

