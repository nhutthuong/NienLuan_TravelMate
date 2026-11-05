import React from "react";
import { Search, Check } from "lucide-react";

const FALLBACK_CATEGORIES = [
  "Thiên nhiên",
  "Văn hóa",
  "Nghỉ dưỡng",
  "Khám phá",
  "Biển đảo",
  "Ẩm thực",
];

const PreferencesTab = ({
  searchKeyword,
  onSearchKeywordChange,
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  onClearCategories,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Tìm nhanh theo từ khóa địa danh
        </label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Nhập tên địa danh (Ví dụ: Hạ Long, Tràng An, Sapa...)"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Chọn chủ đề loại hình du lịch (Có thể chọn nhiều)
          </label>
          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={onClearCategories}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Bỏ chọn tất cả ({selectedCategories.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.length > 0
            ? categories.map((cat) => {
                const catId = cat.maLoaiHinh || cat.maloaihinh || cat.ten;
                const isSelected =
                  selectedCategories.includes(catId) ||
                  selectedCategories.includes(cat.ten);

                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => onToggleCategory(catId)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check size={13} className="stroke-[3]" />}
                    <span>{cat.ten}</span>
                  </button>
                );
              })
            : FALLBACK_CATEGORIES.map((tag) => {
                const isSelected = selectedCategories.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onToggleCategory(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check size={13} className="stroke-[3]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="btn-primary py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
        >
          <Search size={16} />
          <span>
            {selectedCategories.length > 1
              ? `Lọc theo ${selectedCategories.length} sở thích`
              : "Lọc điểm đến phù hợp"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default PreferencesTab;
