import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, Sparkles, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DestinationCard from './DestinationCard';

const DestinationsView = ({
  destinations = [],
  categories = [],
  loading = false,
  initialSearch = '',
  initialCategory = 'Tất cả',
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const userPreferences = useMemo(() => {
    return Array.isArray(user?.soThich) ? user.soThich : [];
  }, [user]);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    if (!initialCategory || initialCategory === 'Tất cả') return [];
    return initialCategory
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
  });
  const [onlyMyPreferences, setOnlyMyPreferences] = useState(false);

  // User preference category names
  const userPrefCategoryNames = useMemo(() => {
    if (!userPreferences.length) return [];
    return categories
      .filter((c) => {
        const cId = String(c.maLoaiHinh || c.id || '').trim().toLowerCase();
        const cName = String(c.ten || c.name || c || '').trim().toLowerCase();
        return userPreferences.some((p) => {
          const pStr = String(p).trim().toLowerCase();
          return pStr === cId || pStr === cName;
        });
      })
      .map((c) => c.ten || c.name || c);
  }, [categories, userPreferences]);

  // Compute matched preferences dynamically based on live userPreferences and categories
  const getMatchedPreferences = useCallback(
    (dest) => {
      if (!isAuthenticated || !userPreferences || userPreferences.length === 0) {
        return [];
      }

      const dNames = Array.isArray(dest.loaiHinh)
        ? dest.loaiHinh
        : Array.isArray(dest.loai_hinh)
        ? dest.loai_hinh
        : [dest.category || ''];

      const dIds = Array.isArray(dest.maLoaiHinh)
        ? dest.maLoaiHinh
        : Array.isArray(dest.ma_loai_hinh)
        ? dest.ma_loai_hinh
        : [];

      const matched = [];

      // 1. Direct match by ID and Name pairs
      dIds.forEach((id, idx) => {
        const name = dNames[idx] || id;
        const isMatched = userPreferences.some((p) => {
          const pStr = String(p).trim().toLowerCase();
          return pStr === String(id).trim().toLowerCase() || pStr === String(name).trim().toLowerCase();
        });
        if (isMatched && !matched.includes(name)) {
          matched.push(name);
        }
      });

      // 2. Direct match by category names
      dNames.forEach((name) => {
        const isMatched = userPreferences.some((p) => {
          const pStr = String(p).trim().toLowerCase();
          return pStr === String(name).trim().toLowerCase();
        });
        if (isMatched && !matched.includes(name)) {
          matched.push(name);
        }
      });

      // 3. Match via categories lookup table
      if (Array.isArray(categories) && categories.length > 0) {
        categories.forEach((cat) => {
          const cId = String(cat.maLoaiHinh || cat.id || '').trim().toLowerCase();
          const cName = String(cat.ten || cat.name || cat || '').trim().toLowerCase();
          const displayName = cat.ten || cat.name || cat;

          const isUserPref = userPreferences.some((p) => {
            const pStr = String(p).trim().toLowerCase();
            return pStr === cId || pStr === cName;
          });

          const isDest =
            dIds.some((id) => String(id).trim().toLowerCase() === cId) ||
            dNames.some((n) => String(n).trim().toLowerCase() === cName);

          if (isUserPref && isDest && !matched.includes(displayName)) {
            matched.push(displayName);
          }
        });
      }

      // 4. Fallback to backend matchedLoaiHinh if dynamic matched is empty
      if (matched.length === 0) {
        const backendMatched =
          Array.isArray(dest.matchedLoaiHinh) && dest.matchedLoaiHinh.length > 0
            ? dest.matchedLoaiHinh
            : Array.isArray(dest.matched_loai_hinh) && dest.matched_loai_hinh.length > 0
            ? dest.matched_loai_hinh
            : [];
        return backendMatched;
      }

      return matched;
    },
    [isAuthenticated, userPreferences, categories]
  );

  const areAllPrefsSelected = useMemo(() => {
    if (userPrefCategoryNames.length === 0) return false;
    return userPrefCategoryNames.every((name) =>
      selectedCategories.some((sel) => sel.toLowerCase() === name.toLowerCase())
    );
  }, [userPrefCategoryNames, selectedCategories]);

  // Toggle single category selection (checkbox style)
  const handleToggleCategory = (catName) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((c) => c.toLowerCase() === catName.toLowerCase());
      if (exists) {
        return prev.filter((c) => c.toLowerCase() !== catName.toLowerCase());
      } else {
        return [...prev, catName];
      }
    });
    setOnlyMyPreferences(false);
  };

  // Reset to "Tất cả"
  const handleSelectAll = () => {
    setSelectedCategories([]);
    setOnlyMyPreferences(false);
  };

  // Toggle user preferences
  const handleToggleUserPreferences = () => {
    if (areAllPrefsSelected || onlyMyPreferences) {
      setSelectedCategories([]);
      setOnlyMyPreferences(false);
    } else {
      setSelectedCategories(userPrefCategoryNames);
      setOnlyMyPreferences(true);
    }
  };

  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const name = (dest.ten || dest.name || '').toLowerCase();
        const location = (dest.tinhThanh || dest.location || '').toLowerCase();
        const query = searchQuery.trim().toLowerCase();

        const matchSearch = !query || name.includes(query) || location.includes(query);
        if (!matchSearch) return false;

        const destCategories = Array.isArray(dest.loaiHinh)
          ? dest.loaiHinh
          : Array.isArray(dest.loai_hinh)
          ? dest.loai_hinh
          : [dest.category || ''];

        const destCategoryIds = Array.isArray(dest.maLoaiHinh)
          ? dest.maLoaiHinh
          : Array.isArray(dest.ma_loai_hinh)
          ? dest.ma_loai_hinh
          : [];

        // Filter by user personal preferences shortcut
        if (onlyMyPreferences && selectedCategories.length === 0) {
          const matchUserPref =
            (dest.matchScore || 0) > 0 ||
            getMatchedPreferences(dest).length > 0 ||
            destCategoryIds.some((cid) =>
              userPreferences.some((p) => String(p).toLowerCase() === String(cid).toLowerCase())
            );
          if (!matchUserPref) return false;
        }

        // Multi-select category filtering (matches ANY selected category)
        if (selectedCategories.length > 0) {
          const matchesAny = selectedCategories.some((sel) => {
            const selLower = sel.toLowerCase();
            return (
              destCategories.some(
                (c) => c.toLowerCase() === selLower || c.toLowerCase().includes(selLower)
              ) ||
              destCategoryIds.some((cid) => cid.toLowerCase() === selLower)
            );
          });
          if (!matchesAny) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 1. Sort by count of matched selected categories (more matches first)
        if (selectedCategories.length > 0) {
          const countMatches = (dest) => {
            const dCats = (dest.loaiHinh || dest.loai_hinh || []).map((c) => c.toLowerCase());
            const dIds = (dest.maLoaiHinh || dest.ma_loai_hinh || []).map((c) => c.toLowerCase());
            return selectedCategories.filter((sel) => {
              const s = sel.toLowerCase();
              return dCats.some((c) => c === s || c.includes(s)) || dIds.some((cid) => cid === s);
            }).length;
          };

          const matchDiff = countMatches(b) - countMatches(a);
          if (matchDiff !== 0) return matchDiff;
        }

        // 2. Naturally prioritize destinations matching user preferences
        const matchCountA = getMatchedPreferences(a).length;
        const matchCountB = getMatchedPreferences(b).length;
        const scoreA = (a.matchScore || a.match_score || 0) + matchCountA * 10;
        const scoreB = (b.matchScore || b.match_score || 0) + matchCountB * 10;
        if (scoreA !== scoreB) return scoreB - scoreA;

        // 3. Alphabetical order
        return (a.ten || a.name || '').localeCompare(b.ten || b.name || '');
      });
  }, [destinations, searchQuery, selectedCategories, onlyMyPreferences, userPreferences, getMatchedPreferences]);

  return (
    <>
      {/* Search & Multi-select Category Filter Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 mb-5 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
          <input
            type="text"
            placeholder="Tìm kiếm địa danh, tỉnh thành..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm sm:text-base placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-thin">
          <Filter size={20} className="text-slate-400 mx-1 shrink-0 hidden md:block" />

          {/* Personalized Filter Button for Logged-in Members */}
          {isAuthenticated && userPreferences.length > 0 && (
            <button
              type="button"
              onClick={handleToggleUserPreferences}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-2.5 shrink-0 select-none shadow-xs ${
                areAllPrefsSelected || onlyMyPreferences
                  ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <Sparkles size={16} className={areAllPrefsSelected || onlyMyPreferences ? 'text-amber-300' : 'text-sky-600'} />
              <span>Ưu tiên theo sở thích của tôi</span>
            </button>
          )}

          {/* Tất cả / Bỏ lọc */}
          <button
            type="button"
            onClick={handleSelectAll}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 select-none shadow-xs ${
              selectedCategories.length === 0 && !onlyMyPreferences
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span>Tất cả</span>
          </button>

          {/* Multi-select Category Checkbox Pills */}
          {categories.map((cat) => {
            const catName = typeof cat === 'string' ? cat : cat.ten || cat.tenChuDe || cat.name;
            const catId = typeof cat === 'object' ? cat.maLoaiHinh || cat.id : cat;
            if (!catName || catName === 'Tất cả') return null;

            const isSelected = selectedCategories.some((c) => c.toLowerCase() === catName.toLowerCase());
            const isUserPref = userPreferences.some(
              (pref) => pref === catId || pref.toLowerCase() === catName.toLowerCase()
            );

            return (
              <button
                key={catId || catName}
                type="button"
                onClick={() => handleToggleCategory(catName)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-2.5 border select-none shrink-0 group shadow-xs ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Visual Checkbox Square */}
                <span
                  className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-white text-primary shadow-xs'
                      : 'bg-slate-50 border border-slate-300 text-transparent group-hover:border-slate-400'
                  }`}
                >
                  <Check
                    size={12}
                    className={`stroke-[3.5] transition-transform ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                  />
                </span>

                <span>{catName}</span>

                {isUserPref && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-amber-200'
                        : 'bg-sky-50 text-sky-600 border border-sky-100'
                    }`}
                  >
                    • Gu của bạn
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Clear Filter Button */}
          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ml-1 select-none"
              title="Bỏ chọn tất cả loại hình"
            >
              <X size={15} />
              <span>Xóa ({selectedCategories.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Info Status Bar */}
      <div className="mb-6 px-1 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedCategories.length > 0 ? (
            <>
              <Filter size={14} className="text-primary shrink-0" />
              <span>
                Đang lọc theo <strong>{selectedCategories.length} loại hình</strong> đã chọn:
              </span>
              <span className="font-semibold text-slate-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                {selectedCategories.join(', ')}
              </span>
            </>
          ) : isAuthenticated && userPreferences.length > 0 ? (
            <>
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <span>
                TravelMate đang ưu tiên gợi ý các điểm đến theo <strong>{userPreferences.length} sở thích</strong> đã lưu trong tài khoản của bạn.
              </span>
            </>
          ) : (
            <span>
              Hiển thị tất cả <strong>{destinations.length} địa danh</strong> tiêu biểu.
            </span>
          )}
        </div>

        {(selectedCategories.length > 0 || onlyMyPreferences) && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-primary hover:underline font-semibold cursor-pointer shrink-0"
          >
            Hiện tất cả địa danh ({destinations.length})
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={36} className="text-primary animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-500">Đang tải danh sách địa danh từ hệ thống...</p>
        </div>
      ) : filteredDestinations.length > 0 ? (
        /* Destinations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.maDiaDiem || dest.id}
              destination={dest}
              matchedList={getMatchedPreferences(dest)}
              onNavigate={(id) => navigate(`/location/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm mb-16">
          <div className="text-slate-300 mb-4 flex justify-center">
            <Search size={64} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy địa danh phù hợp</h3>
          <p className="text-slate-500 text-sm mb-4">
            Thử tìm kiếm với một từ khóa khác hoặc điều chỉnh các loại hình du lịch đã chọn.
          </p>
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Xem tất cả địa danh ({destinations.length})
          </button>
        </div>
      )}
    </>
  );
};

export default React.memo(DestinationsView);
