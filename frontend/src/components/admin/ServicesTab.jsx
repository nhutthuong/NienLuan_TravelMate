import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Star,
  ExternalLink,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  Building2,
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

const ServicesTab = ({
  services = [],
  destinations = [],
  searchQuery = '',
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

    if (Array.isArray(destinations) && destinations.length > 0) {
      destinations.forEach((d) => {
        const dId = String(d.id || d.maDiaDiem || '');
        const dName = d.name || d.ten || dId;
        if (dId) {
          map.set(dId, { id: dId, name: dName });
        }
      });
    }

    services.forEach((s) => {
      const locId = String(s.locationId || '');
      const locName = s.locationName || locId;
      if (locId && !map.has(locId)) {
        map.set(locId, { id: locId, name: locName });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [destinations, services]);

  // Đếm số lượng khách sạn theo từng địa danh
  const locationCounts = useMemo(() => {
    const counts = {};
    services.forEach((s) => {
      const idKey = String(s.locationId || '');
      const nameKey = s.locationName || '';
      if (idKey) counts[idKey] = (counts[idKey] || 0) + 1;
      if (nameKey && nameKey !== idKey) counts[nameKey] = (counts[nameKey] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Tên địa danh đang lọc
  const activeLocationName = useMemo(() => {
    if (selectedLocation === 'all') return '';
    const target = locationOptions.find((o) => o.id === selectedLocation);
    return target ? target.name : selectedLocation;
  }, [selectedLocation, locationOptions]);

  // Lọc dữ liệu theo địa danh và từ khóa tìm kiếm
  const filteredServices = useMemo(() => {
    let result = services;

    if (selectedLocation !== 'all') {
      result = result.filter((item) => {
        const matchId = String(item.locationId) === String(selectedLocation);
        const targetOpt = locationOptions.find((o) => o.id === selectedLocation);
        const matchName = targetOpt && item.locationName && item.locationName.toLowerCase() === targetOpt.name.toLowerCase();
        return matchId || matchName;
      });
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const locMatch = (item.locationName || '').toLowerCase().includes(q);
        const addrMatch = (item.diaChi || '').toLowerCase().includes(q);
        const highlightMatch = (item.diemNoiBat || '').toLowerCase().includes(q);
        const tagMatch = Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(q));
        const amenMatch = Array.isArray(item.coreAmenities) && item.coreAmenities.some((a) => (typeof a === 'string' ? a : a.ten || '').toLowerCase().includes(q));
        return nameMatch || locMatch || addrMatch || highlightMatch || tagMatch || amenMatch;
      });
    }

    return result;
  }, [services, selectedLocation, searchQuery, locationOptions]);

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, itemsPerPage]);

  // Phân trang
  const totalItems = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentServices = filteredServices.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar & Bộ lọc */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Tìm theo tên khách sạn, địa danh, tiện ích, sở thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Dropdown lọc theo địa danh gốc */}
          <div className="relative sm:w-64">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-600 pointer-events-none">
              <Filter size={15} />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all cursor-pointer font-medium appearance-none"
            >
              <option value="all">Tất cả địa danh ({services.length})</option>
              {locationOptions.map((opt) => {
                const count = locationCounts[opt.id] || locationCounts[opt.name] || 0;
                return (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* Nút thêm mới */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onOpenAdd}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-sky-200 transition-all cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>Thêm khách sạn</span>
          </button>
        </div>
      </div>

      {/* Thông tin số lượng & Bộ lọc đang kích hoạt */}
      {(selectedLocation !== 'all' || searchQuery) && (
        <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Đang hiển thị {filteredServices.length} trên tổng số {services.length} khách sạn</span>
            {selectedLocation !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-medium">
                Địa danh: {activeLocationName}
                <button
                  type="button"
                  onClick={() => setSelectedLocation('all')}
                  className="hover:text-sky-950 p-0.5 ml-0.5 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                Từ khóa: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-amber-950 p-0.5 ml-0.5 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedLocation('all');
              setSearchQuery('');
            }}
            className="text-sky-600 hover:text-sky-800 font-medium hover:underline cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Bảng danh sách khách sạn - Vừa khít khung hình, không cuộn ngang */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-2.5 sm:px-3 whitespace-nowrap w-20">Mã &amp; Nhóm</th>
              <th className="py-3 px-2.5 sm:px-3">Khách Sạn &amp; Đánh Giá</th>
              <th className="py-3 px-2.5 sm:px-3 whitespace-nowrap">Thuộc Địa Danh</th>
              <th className="py-3 px-2.5 sm:px-3 whitespace-nowrap">Giá Tham Khảo</th>
              <th className="py-3 px-2.5 sm:px-3 whitespace-nowrap">Chuyển Hướng OTA</th>
              <th className="py-3 px-2.5 sm:px-3 text-right whitespace-nowrap w-20">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {totalItems === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                  {selectedLocation !== 'all' ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>Không tìm thấy khách sạn nào thuộc địa danh <span className="font-semibold text-slate-600">"{activeLocationName}"</span>.</p>
                      <button
                        type="button"
                        onClick={() => setSelectedLocation('all')}
                        className="text-xs text-sky-600 hover:text-sky-700 font-semibold underline cursor-pointer"
                      >
                        Bỏ lọc để xem tất cả các địa danh
                      </button>
                    </div>
                  ) : (
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <Building2 size={36} className="text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">Không tìm thấy khách sạn nào phù hợp</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Thử thay đổi từ khóa tìm kiếm hoặc chọn địa danh khác.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              currentServices.map((service) => {
                return (
                  <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Mã ID & Phân loại badge */}
                    <td className="py-3 px-2.5 sm:px-3 whitespace-nowrap w-20">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          #{service.id}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-semibold border border-sky-100 whitespace-nowrap shrink-0">
                          <Building2 size={10} className="text-sky-600 shrink-0" />
                          <span>Resort</span>
                        </span>
                      </div>
                    </td>

                    {/* Khách sạn & Đánh giá */}
                    <td className="py-3 px-2.5 sm:px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
                          <img
                            src={service.image || '/images/vinh_ha_long.jpg'}
                            alt={service.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/vinh_ha_long.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-slate-900 text-sm block truncate max-w-[200px] xl:max-w-[260px]" title={service.name}>
                            {service.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap leading-none">
                              <Star size={10} className="fill-amber-400 text-amber-500 shrink-0" />
                              <span className="whitespace-nowrap">{service.soSao || service.rating || 5.0} sao</span>
                            </span>
                            {service.diemNoiBat && (
                              <span className="text-[11px] text-slate-400 truncate min-w-0 flex-1 hidden sm:inline" title={service.diemNoiBat}>
                                • {service.diemNoiBat}
                              </span>
                            )}
                          </div>
                          {service.diaChi && (
                            <span className="text-[11px] text-slate-400 block truncate max-w-[220px] xl:max-w-[260px] mt-0.5" title={service.diaChi}>
                              {service.diaChi}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Thuộc địa danh */}
                    <td className="py-3 px-2.5 sm:px-3 font-semibold text-slate-700 whitespace-nowrap">
                      {service.locationName ? (
                        <button
                          type="button"
                          onClick={() => setSelectedLocation(service.locationId || service.locationName)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-100 text-xs font-semibold transition-colors cursor-pointer"
                          title={`Nhấn để chỉ lọc các khách sạn thuộc ${service.locationName}`}
                        >
                          <MapPin size={12} className="text-sky-600 shrink-0" />
                          <span className="truncate max-w-[110px]">{service.locationName}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Chưa gán</span>
                      )}
                    </td>

                    {/* Giá phòng tham khảo */}
                    <td className="py-3 px-2.5 sm:px-3 whitespace-nowrap">
                      <div className="font-bold text-sky-700 text-sm">
                        {service.price}
                        <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                          {service.donViTinh || '/đêm'}
                        </span>
                      </div>
                    </td>

                    {/* Chuyển hướng OTA Affiliate */}
                    <td className="py-3 px-2.5 sm:px-3 whitespace-nowrap">
                      {service.affiliateUrl ? (
                        <a
                          href={service.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-semibold bg-sky-50 hover:bg-sky-100 px-2.5 py-1.5 rounded-lg border border-sky-100 transition-colors"
                          title={service.affiliateUrl}
                        >
                          <span>Affiliate OTA</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Chưa có</span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 px-2.5 sm:px-3 text-right whitespace-nowrap w-20">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(service)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Sửa khách sạn"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(service.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa khách sạn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Phân trang hỗ trợ bởi Tailwind CSS - Đồng bộ 100% với tab Điểm check-in */}
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
            khách sạn
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

export default ServicesTab;
