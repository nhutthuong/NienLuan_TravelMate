import React from 'react';
import { Search, Plus, MapPin, Star, ExternalLink, Edit3, Trash2 } from 'lucide-react';

const ServicesTab = ({
  services,
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
            placeholder="Tìm khách sạn, địa danh, thẻ sở thích..."
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
          <span>Thêm khách sạn</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-5">Tên Dịch Vụ / Khách sạn</th>
              <th className="py-3.5 px-5">Thuộc Địa Danh</th>
              <th className="py-3.5 px-5">Thẻ Sở Thích</th>
              <th className="py-3.5 px-5">Tiện ích thư giãn</th>
              <th className="py-3.5 px-5">Giá phòng</th>
              <th className="py-3.5 px-5">Chuyển hướng OTA</th>
              <th className="py-3.5 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400 text-sm">
                  Không tìm thấy khách sạn hoặc dịch vụ nào.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                    #{service.id}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">
                          {service.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span>{service.rating}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="text-sky-600" />
                      <span>{service.locationName}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1">
                      {service.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <div className="text-xs text-slate-500 line-clamp-2">
                      {service.coreAmenities.join(' • ')}
                    </div>
                  </td>
                  <td className="py-4 px-5 font-bold text-sky-600 whitespace-nowrap">
                    {service.price}
                  </td>
                  <td className="py-4 px-5">
                    <a
                      href={service.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-semibold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100"
                    >
                      <span>Affiliate</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenEdit(service)}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Sửa khách sạn"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(service.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa khách sạn"
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

export default ServicesTab;
