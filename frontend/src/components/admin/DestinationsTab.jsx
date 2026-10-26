import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Star, ExternalLink, Edit3, Trash2 } from 'lucide-react';

const DestinationsTab = ({
  destinations,
  searchQuery,
  setSearchQuery,
  onOpenAdd,
  onOpenEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm địa danh, tỉnh thành, phân loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
          />
        </div>

        <button
          onClick={onOpenAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>Thêm địa danh</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-5">Địa danh &amp; Hình ảnh</th>
              <th className="py-3.5 px-5">Tỉnh / Thành</th>
              <th className="py-3.5 px-5">Phân loại</th>
              <th className="py-3.5 px-5">Đánh giá</th>
              <th className="py-3.5 px-5">Dịch vụ con</th>
              <th className="py-3.5 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {destinations.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-slate-400 text-sm">
                  Không tìm thấy địa danh nào phù hợp.
                </td>
              </tr>
            ) : (
              destinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                    #{dest.id}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">
                          {dest.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          Mã địa danh: #{dest.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-700">
                    {dest.province}
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
                      {dest.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-600">
                    {dest.totalHotels} lưu trú
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/location/${dest.id}`}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Xem trang chi tiết"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => onOpenEdit(dest)}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Sửa địa danh"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(dest.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa địa danh"
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
    </div>
  );
};

export default DestinationsTab;
