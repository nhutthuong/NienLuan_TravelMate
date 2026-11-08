import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Check, Sparkles, UserCheck, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
  onSelectCategories,
  onClearCategories,
  onSubmit,
}) => {
  const { user, isAuthenticated } = useAuth();

  const userPreferences = useMemo(() => {
    return Array.isArray(user?.soThich) ? user.soThich : [];
  }, [user]);

  // Check if all user preferences are currently selected
  const isAllUserPrefsSelected = useMemo(() => {
    if (userPreferences.length === 0) return false;
    return userPreferences.every((prefId) => selectedCategories.includes(prefId));
  }, [userPreferences, selectedCategories]);

  const handleApplyUserPreferences = () => {
    if (!onSelectCategories || userPreferences.length === 0) return;

    if (isAllUserPrefsSelected) {
      // Toggle off
      onClearCategories();
    } else {
      // Combine existing with userPreferences or set to userPreferences
      const combined = Array.from(new Set([...selectedCategories, ...userPreferences]));
      onSelectCategories(combined);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
      {/* Personalization Status Card */}
      {isAuthenticated ? (
        userPreferences.length > 0 ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50/60 to-emerald-50 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Sở thích của {user?.hoTen || 'bạn'}</span>
                  <span className="text-[11px] font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                    {userPreferences.length} sở thích đã lưu
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bạn có thể áp dụng nhanh các sở thích đã lưu để TravelMate tự động ưu tiên các địa điểm phù hợp nhất.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyUserPreferences}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isAllUserPrefsSelected
                  ? 'bg-sky-600 text-white shadow-sky-600/20'
                  : 'bg-white text-sky-700 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              <Sparkles size={14} className={isAllUserPrefsSelected ? 'text-amber-300' : 'text-sky-600'} />
              <span>
                {isAllUserPrefsSelected
                  ? 'Đang ưu tiên theo sở thích của bạn'
                  : 'Ưu tiên theo sở thích của tôi'}
              </span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <UserCheck size={16} className="text-slate-400 shrink-0" />
              <span>Bạn chưa chọn sở thích cá nhân. Hãy chọn bên dưới để lọc, hoặc cập nhật hồ sơ để TravelMate tự động ghi nhớ.</span>
            </div>
          </div>
        )
      ) : (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles size={16} className="text-sky-600 shrink-0" />
            <span>Đăng nhập tài khoản để TravelMate tự động lưu và ưu tiên gợi ý các điểm đến theo sở thích của riêng bạn.</span>
          </div>
          <Link
            to="/login"
            className="font-bold text-primary hover:text-primary-dark hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Đăng nhập</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Keyword Search */}
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

      {/* Categories Selection */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Chọn chủ đề loại hình du lịch (Có thể chọn nhiều)
          </label>
          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={onClearCategories}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
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

                const isUserPref = userPreferences.includes(catId);

                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => onToggleCategory(catId)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5 cursor-pointer relative ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : isUserPref
                        ? "bg-sky-50/70 text-sky-800 border-sky-200 hover:bg-sky-100"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check size={13} className="stroke-[3]" />}
                    <span>{cat.ten}</span>
                    {isUserPref && !isSelected && (
                      <span className="text-[10px] text-sky-600 font-bold ml-0.5">• Gu của bạn</span>
                    )}
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

      {/* Submit Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {selectedCategories.length > 0 ? (
            <span>
              Đã chọn <strong className="text-slate-800">{selectedCategories.length}</strong> chủ đề để ưu tiên lọc
            </span>
          ) : (
            <span>Chưa chọn chủ đề, TravelMate sẽ hiển thị tất cả các điểm đến tiêu biểu</span>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-2 shadow-md w-full sm:w-auto justify-center cursor-pointer"
        >
          <Search size={16} />
          <span>
            {selectedCategories.length > 0
              ? `Lọc theo ${selectedCategories.length} sở thích`
              : "Lọc điểm đến phù hợp"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default PreferencesTab;
