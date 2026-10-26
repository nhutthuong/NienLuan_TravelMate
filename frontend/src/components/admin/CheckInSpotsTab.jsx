import React from 'react';
import { Search, Plus, MapPin, Navigation, Edit3, Trash2 } from 'lucide-react';

const CheckInSpotsTab = ({
  checkInSpots,
  searchQuery,
  setSearchQuery,
  onOpenAdd,
  onOpenEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm tên điểm check-in, địa danh gốc, nét độc đáo..."
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
          <span>Thêm điểm check-in</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-5">Điểm Check-in &amp; Hình ảnh</th>
              <th className="py-3.5 px-5">Thuộc Địa Danh Gốc</th>
              <th className="py-3.5 px-5">Mô tả nét độc đáo</th>
              <th className="py-3.5 px-5">Vé tham quan</th>
              <th className="py-3.5 px-5">Khung giờ đẹp</th>
              <th className="py-3.5 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {checkInSpots.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-slate-400 text-sm">
                  Không tìm thấy điểm check-in nào.
                </td>
              </tr>
            ) : (
              checkInSpots.map((spot) => (
                <tr key={spot.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                    #{spot.id}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={spot.image}
                        alt={spot.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">
                          {spot.name}
                        </span>
                        <span className="text-xs text-sky-600 font-medium inline-flex items-center gap-1">
                          <Navigation size={11} /> Điểm check-in con
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100 text-xs">
                      <MapPin size={13} className="text-sky-600" />
                      <span>{spot.locationName}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 max-w-sm">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {spot.desc}
                    </p>
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-700 whitespace-nowrap text-xs">
                    {spot.ticketPrice}
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                    {spot.bestTime}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenEdit(spot)}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Sửa điểm check-in"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(spot.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
    </div>
  );
};

export default CheckInSpotsTab;
