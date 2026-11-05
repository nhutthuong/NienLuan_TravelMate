import React from 'react';
import { MapPin, Clock, Compass, ShieldCheck, Check } from 'lucide-react';

const LocationSidebar = ({
  location,
  onOpenMap,
  onOpenHotelsModal,
}) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-24 flex flex-col gap-6">
        {/* Ban do mini */}
        <div
          onClick={onOpenMap}
          className="bg-sky-50 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition border border-sky-100 group"
        >
          <div className="flex justify-between items-center text-sm font-semibold text-sky-900 mb-3">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              Tọa độ GPS:
            </span>
            <span className="text-xs font-mono text-sky-700">
              {location.viDo ? `${location.viDo.toFixed(3)}°, ${location.kinhDo.toFixed(3)}°` : 'Bấm để xem'}
            </span>
          </div>

          <div className="bg-gradient-to-br from-sky-400 to-sky-600 h-36 rounded-2xl flex flex-col items-center justify-center text-white font-bold mb-4 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
            <MapPin className="w-8 h-8 mb-1 animate-bounce" />
            <span className="text-sm">Mở Bản đồ tương tác</span>
            <span className="text-[11px] font-normal opacity-90">Xem vị trí & chỉ đường</span>
          </div>

          <div className="text-sm text-slate-700 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Mùa du lịch đẹp:
              </span>
              <span className="font-bold text-xs text-slate-800">
                {location.thoiDiemLyTuong || 'Quanh năm'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                Khu vực:
              </span>
              <span className="font-bold text-xs text-slate-800">
                {location.tinhThanh}
              </span>
            </div>
          </div>
        </div>

        {/* Bo loc & Tien ich nghi duong */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Tiêu chí nghỉ dưỡng
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            Đã tự động loại bỏ các tiện ích không phù hợp, ưu tiên trải nghiệm thư giãn tĩnh tâm.
          </p>

          <div className="space-y-3.5">
            {[
              { title: 'Hồ bơi vô cực view danh thắng', sub: 'Tầm nhìn bao quát biển/núi' },
              { title: 'Spa & Liệu pháp thảo mộc Onsen', sub: 'Tái tạo năng lượng và thanh lọc' },
              { title: 'Ẩm thực hữu cơ thực dưỡng', sub: 'Món ngon địa phương tuyển chọn' },
            ].map((filter, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{filter.title}</div>
                  <div className="text-xs text-gray-400">{filter.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenHotelsModal}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm mt-6 transition shadow-sm cursor-pointer"
          >
            Xem danh sách khách sạn đạt chuẩn
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSidebar;

