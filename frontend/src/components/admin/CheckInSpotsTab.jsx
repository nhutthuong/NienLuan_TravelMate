import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Navigation,
  Edit3,
  Trash2,
  Clock,
  Ticket,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  ChevronDown,
  X,
  Filter,
} from 'lucide-react';

const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
};

const CheckInSpotsTab = ({
  checkInSpots,
  destinations = [],
  searchQuery,
  setSearchQuery,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Danh sách các tùy chọn địa danh gốc
  const locationOptions = useMemo(() => {
    const map = new Map();

    // 1. Thêm từ danh sách địa danh gốc nếu có
    if (Array.isArray(destinations) && destinations.length > 0) {
      destinations.forEach((d) => {
        const dId = String(d.id || d.maDiaDiem || '');
        const dName = d.name || d.ten || dId;
        if (dId) {
          map.set(dId, { id: dId, name: dName });
        }
      });
    }

    // 2. Quét thêm từ checkInSpots phòng trường hợp có điểm check-in thuộc địa danh chưa có trong destinations
    checkInSpots.forEach((s) => {
      const locId = String(s.locationId || '');
      const locName = s.locationName || locId;
      if (locId && !map.has(locId)) {
        map.set(locId, { id: locId, name: locName });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [destinations, checkInSpots]);

  // Đếm số lượng điểm check-in theo từng địa danh
  const locationCounts = useMemo(() => {
    const counts = {};
    checkInSpots.forEach((s) => {
      const idKey = String(s.locationId || '');
      const nameKey = s.locationName || '';
      if (idKey) counts[idKey] = (counts[idKey] || 0) + 1;
      if (nameKey && nameKey !== idKey) counts[nameKey] = (counts[nameKey] || 0) + 1;
    });
    return counts;
  }, [checkInSpots]);

  // Lọc dữ liệu theo địa danh gốc đã chọn
  const filteredSpots = useMemo(() => {
    if (selectedLocation === 'all') return checkInSpots;
    return checkInSpots.filter((spot) => {
      const matchId = String(spot.locationId) === String(selectedLocation);
      const targetOpt = locationOptions.find((o) => o.id === selectedLocation);
      const matchName = targetOpt && spot.locationName && spot.locationName.toLowerCase() === targetOpt.name.toLowerCase();
      return matchId || matchName;
    });
  }, [checkInSpots, selectedLocation, locationOptions]);

  // Tự động quay về trang 1 khi người dùng gõ từ khóa tìm kiếm hoặc đổi địa danh
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation]);

  const totalItems = filteredSpots.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentSpots = filteredSpots.slice(startIndex, endIndex);

  const activeLocationName = selectedLocation !== 'all'
    ? (locationOptions.find((o) => o.id === selectedLocation)?.name || selectedLocation)
    : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Nhóm tìm kiếm và bộ lọc theo địa danh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên điểm check-in, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
            />
          </div>

          {/* Bộ lọc dropdown theo địa danh gốc */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative flex items-center min-w-[210px] rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-colors shadow-2xs">
              <MapPin size={15} className="ml-3 text-sky-600 shrink-0 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-transparent pl-2.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Tất cả địa danh ({checkInSpots.length})</option>
                {locationOptions.map((loc) => {
                  const count = locationCounts[loc.id] || locationCounts[loc.name] || 0;
                  return (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {count > 0 ? `(${count})` : '(0)'}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>

            {selectedLocation !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedLocation('all')}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Bỏ lọc địa danh"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Nút thêm điểm check-in */}
        <button
          onClick={() => onOpenAdd(selectedLocation !== 'all' ? selectedLocation : undefined)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus size={18} />
          <span>Thêm điểm check-in</span>
        </button>
      </div>

      {/* Thanh báo trạng thái đang lọc theo địa danh */}
      {selectedLocation !== 'all' && (
        <div className="px-5 py-2.5 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs text-sky-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-500 flex items-center gap-1">
              <Filter size={12} className="text-sky-600" />
              Đang lọc theo địa danh:
            </span>
            <span className="font-bold bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 text-sky-700 shadow-2xs">
              {activeLocationName}
            </span>
            <span className="text-slate-500">
              ({totalItems} điểm check-in tìm thấy)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedLocation('all')}
            className="text-sky-600 hover:text-sky-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Hiển thị tất cả</span>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Table - Gọn gàng, vừa khít khung hình không xuất hiện thanh trượt ngang */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 whitespace-nowrap w-28">Mã &amp; Nhóm</th>
              <th className="py-3.5 px-4">Điểm Check-in &amp; Hình ảnh</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Địa danh gốc</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Vé tham quan</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Khung giờ đẹp</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {totalItems === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                  {selectedLocation !== 'all' ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>Không tìm thấy điểm check-in nào thuộc địa danh <span className="font-semibold text-slate-600">"{activeLocationName}"</span>.</p>
                      <button
                        type="button"
                        onClick={() => setSelectedLocation('all')}
                        className="text-xs text-sky-600 hover:text-sky-700 font-semibold underline cursor-pointer"
                      >
                        Bỏ lọc để xem tất cả các địa danh
                      </button>
                    </div>
                  ) : (
                    'Không tìm thấy điểm check-in nào phù hợp với bộ lọc tìm kiếm.'
                  )}
                </td>
              </tr>
            ) : (
              currentSpots.map((spot) => (
                <tr key={spot.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Mã ID & Nhóm badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        #{spot.id}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-semibold border border-sky-100 whitespace-nowrap shrink-0">
                        <Navigation size={10} className="text-sky-600 shrink-0" />
                        <span className="whitespace-nowrap">Check-in</span>
                      </span>
                    </div>
                  </td>

                  {/* Điểm Check-in & Hình ảnh */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
                        <img
                          src={spot.image || '/images/vinh_ha_long.jpg'}
                          alt={spot.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/vinh_ha_long.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-sm block truncate hover:text-sky-600 transition-colors">
                          {spot.name}
                        </span>
                        {spot.diaChi && (
                          <span className="text-[11px] text-slate-400 block truncate mt-0.5" title={spot.diaChi}>
                            {spot.diaChi}
                          </span>
                        )}
                        {spot.viDo && spot.kinhDo && (
                          <span className="text-[10px] text-sky-700 font-mono block mt-0.5">
                            GPS: {Number(spot.viDo).toFixed(4)}°, {Number(spot.kinhDo).toFixed(4)}°
                          </span>
                        )}
                        {/* Hiển thị hoạt động trải nghiệm */}
                        {Array.isArray(spot.hoatDongList) && spot.hoatDongList.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-md">
                              <Sparkles size={9} className="text-amber-600 shrink-0" />
                              <span>{spot.hoatDongList.length} trải nghiệm</span>
                            </span>
                            {spot.hoatDongList.slice(0, 2).map((act, aIdx) => {
                              const actName = typeof act === 'string' ? act : act?.ten || '';
                              const actNote = typeof act === 'object' ? act?.ghiChu : '';
                              return (
                                <span
                                  key={aIdx}
                                  className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-1.5 py-0.5 rounded truncate max-w-[130px] border border-slate-200/60"
                                  title={actNote ? `${actName} (${actNote})` : actName}
                                >
                                  {actName}
                                </span>
                              );
                            })}
                            {spot.hoatDongList.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                +{spot.hoatDongList.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Thuộc địa danh gốc */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {spot.locationName ? (
                      <button
                        type="button"
                        onClick={() => setSelectedLocation(spot.locationId || spot.locationName)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-100 text-xs font-semibold transition-colors cursor-pointer"
                        title={`Nhấn để chỉ lọc các điểm check-in thuộc ${spot.locationName}`}
                      >
                        <MapPin size={13} className="text-sky-600 shrink-0" />
                        <span>{spot.locationName}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa gắn</span>
                    )}
                  </td>

                  {/* Vé tham quan */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-medium">
                      <Ticket size={12} className="text-emerald-600 shrink-0" />
                      <span>{spot.ticketPrice || 'Miễn phí'}</span>
                    </span>
                  </td>

                  {/* Khung giờ đẹp */}
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400 shrink-0" />
                      <span>{spot.bestTime || '08:00 – 17:00'}</span>
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenEdit(spot)}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa điểm check-in"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(spot)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa điểm check-in"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Phân trang hỗ trợ bởi Tailwind CSS */}
      <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        {/* Thông tin số lượng hiển thị & Chọn số phần tử trên 1 trang */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
          <div>
            Hiển thị{' '}
            <span className="font-semibold text-slate-800">
              {totalItems === 0 ? 0 : startIndex + 1}
            </span>{' '}
            –{' '}
            <span className="font-semibold text-slate-800">{endIndex}</span>{' '}
            trên{' '}
            <span className="font-semibold text-slate-800">{totalItems}</span>{' '}
            điểm check-in
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-slate-500 whitespace-nowrap">Số phần tử / trang:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-sm hover:border-slate-300"
            >
              <option value={5}>5 mục / trang</option>
              <option value={8}>8 mục / trang</option>
              <option value={10}>10 mục / trang</option>
              <option value={15}>15 mục / trang</option>
              <option value={20}>20 mục / trang</option>
            </select>
          </div>
        </div>

        {/* Các nút chuyển trang (Trang trước, 1, 2, 3..., Trang sau) */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Về trang đầu */}
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang đầu"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Trang trước */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Danh sách số trang */}
            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers(safeCurrentPage, totalPages).map((p, idx) => {
                if (p === '...') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1 text-slate-400 text-xs select-none font-medium"
                    >
                      ...
                    </span>
                  );
                }
                const isActive = p === safeCurrentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-200'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Trang sau */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safeCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight size={16} />
            </button>

            {/* Tới trang cuối */}
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang cuối"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInSpotsTab;
