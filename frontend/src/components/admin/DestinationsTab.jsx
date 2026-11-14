import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ExternalLink, Edit3, Trash2, Sparkles, MapPin, Calendar, Layers, ShieldAlert } from 'lucide-react';

const DestinationsTab = ({
  destinations,
  searchQuery,
  setSearchQuery,
  onOpenAdd,
  onOpenEdit,
  onDelete
}) => {
  const isAiTarget = (id) => {
    if (typeof id === 'number') return id <= 10;
    if (typeof id === 'string') {
      if (id.startsWith('DD00')) {
        const num = parseInt(id.replace('DD', ''), 10);
        return num <= 10;
      }
      const num = parseInt(id, 10);
      return !isNaN(num) && num <= 10;
    }
    return false;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên địa danh, tỉnh thành, danh hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
          />
        </div>

        <button
          onClick={onOpenAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>Thêm địa danh mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">Mã &amp; Nhóm</th>
              <th className="py-3.5 px-5 min-w-[220px]">Địa danh &amp; Hình ảnh</th>
              <th className="py-3.5 px-5">Tỉnh / Thành</th>
              <th className="py-3.5 px-5 min-w-[200px]">Danh hiệu &amp; Phân loại</th>
              <th className="py-3.5 px-5 min-w-[170px]">Quy mô &amp; Thời điểm</th>
              <th className="py-3.5 px-5">Dịch vụ con</th>
              <th className="py-3.5 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {destinations.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                  Không tìm thấy địa danh nào phù hợp với bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : (
              destinations.map((dest) => {
                const isAi = isAiTarget(dest.id);
                const categories = Array.isArray(dest.categories) && dest.categories.length > 0
                  ? dest.categories
                  : dest.category ? [dest.category] : ['Thiên nhiên'];

                return (
                  <tr key={dest.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & AI Badge */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs font-bold text-slate-600">
                          #{dest.id}
                        </span>
                        {isAi ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200/60 w-fit" title="10 Địa danh gốc huấn luyện mô hình AI ResNet50 (Chỉ sửa, không xóa)">
                            <Sparkles size={10} className="text-sky-600" />
                            <span>AI ResNet50</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold w-fit">
                            Mở rộng
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name & Thumbnail */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/vinh_ha_long.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 text-sm block truncate hover:text-sky-600 transition-colors">
                            {dest.name}
                          </span>
                          {dest.viDo && dest.kinhDo && (
                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <MapPin size={11} className="text-slate-400 shrink-0" />
                              <span className="truncate">{Number(dest.viDo).toFixed(4)}, {Number(dest.kinhDo).toFixed(4)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Province */}
                    <td className="py-4 px-5 font-semibold text-slate-700 whitespace-nowrap">
                      {dest.province}
                    </td>

                    {/* Danh hiệu & Categories */}
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        {dest.danhHieu && (
                          <span className="text-xs font-semibold text-slate-800 block line-clamp-1" title={dest.danhHieu}>
                            {dest.danhHieu}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {categories.slice(0, 3).map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60"
                            >
                              {cat}
                            </span>
                          ))}
                          {categories.length > 3 && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              +{categories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Quy mô & Thời điểm */}
                    <td className="py-4 px-5 text-xs">
                      <div className="space-y-1 text-slate-600">
                        {dest.quyMo && (
                          <div className="flex items-center gap-1.5 truncate" title={dest.quyMo}>
                            <Layers size={13} className="text-slate-400 shrink-0" />
                            <span className="truncate">{dest.quyMo}</span>
                          </div>
                        )}
                        {dest.thoiDiemLyTuong && (
                          <div className="flex items-center gap-1.5 truncate" title={dest.thoiDiemLyTuong}>
                            <Calendar size={13} className="text-sky-500 shrink-0" />
                            <span className="truncate font-medium text-slate-700">{dest.thoiDiemLyTuong}</span>
                          </div>
                        )}
                        {!dest.quyMo && !dest.thoiDiemLyTuong && (
                          <span className="text-slate-400 italic">Chưa cập nhật</span>
                        )}
                      </div>
                    </td>

                    {/* Services Count */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="text-xs">
                        <span className="font-semibold text-teal-700 block">
                          {dest.totalHotels || 0} khách sạn
                        </span>
                        <span className="text-amber-700 font-medium block">
                          {dest.totalAttractions || 0} điểm check-in
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/location/${dest.id}`}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Xem trang chi tiết trên Web"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => onOpenEdit(dest)}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Sửa thông tin địa danh"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(dest.id)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            isAi
                              ? 'text-slate-300 hover:text-rose-400 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={isAi ? "Địa danh gốc AI (Không thể xóa)" : "Xóa địa danh"}
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
    </div>
  );
};

export default DestinationsTab;
