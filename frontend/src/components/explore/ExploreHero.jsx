import React from 'react';
import { Search } from 'lucide-react';

const ExploreHero = ({ searchQuery, setSearchQuery, onSearchSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <div className="mb-10 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
        Khám Phá Điểm Đến & Dịch Vụ Tuyệt Vời
      </h1>
      <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
        Bộ lọc thông minh đa chiều giúp bạn tìm kiếm danh lam thắng cảnh, điểm check-in và khách sạn nghỉ dưỡng phù hợp nhất với sở thích cá nhân.
      </p>

      {/* Search Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 overflow-hidden p-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all"
      >
        <div className="pl-4 pr-2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm tên danh thắng, điểm check-in, khách sạn hoặc địa chỉ..."
          className="w-full py-2.5 px-2 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer flex-shrink-0"
        >
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default ExploreHero;

