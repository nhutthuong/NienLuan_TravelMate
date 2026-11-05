import React from 'react';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Check,
  Ticket,
  Clock,
} from 'lucide-react';

const ServiceInfo = ({ data, isHotel, isAttraction }) => {
  return (
    <>
      {/* Thong tin gioi thieu */}
      <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Compass className="w-6 h-6 text-sky-600" />
          Thông tin giới thiệu
        </h2>
        <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line mb-6">
          {data.moTa}
        </div>

        {data.diemNoiBat && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm mb-0.5">Điểm nhấn trải nghiệm:</h4>
              <p className="text-sm leading-relaxed">{data.diemNoiBat}</p>
            </div>
          </div>
        )}
      </section>

      {/* Tien nghi (Hotel) hoac Hoat dong (Attraction) */}
      <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {isHotel ? (
            <>
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Tiện nghi & Dịch vụ chuẩn nghỉ dưỡng
            </>
          ) : (
            <>
              <Ticket className="w-6 h-6 text-sky-600" />
              Hoạt động & Thông tin tham quan
            </>
          )}
        </h2>

        {/* Hotel: Tien nghi */}
        {isHotel && (
          <div>
            {Array.isArray(data.tienNghi) && data.tienNghi.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.tienNghi.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-gray-800 font-semibold text-sm block">
                        {typeof item === 'string' ? item : item.ten}
                      </span>
                      {item.ghiChu && (
                        <span className="text-xs text-gray-500 block mt-0.5">
                          {item.ghiChu}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Tiện nghi cơ bản gồm phòng nghỉ cao cấp, dịch vụ dọn phòng và lễ tân.
              </p>
            )}
          </div>
        )}

        {/* Attraction: Hoat dong, gio mo cua, gia ve */}
        {isAttraction && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Giờ mở cửa đón khách
                </span>
                <span className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  {data.gioMoCua || 'Cả ngày (06:00 – 18:00)'}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Giá vé tham khảo
                </span>
                <span className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  {data.giaVe || 'Miễn phí'}
                </span>
              </div>
            </div>

            {Array.isArray(data.hoatDong) && data.hoatDong.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Các trải nghiệm nổi bật:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.hoatDong.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-sky-50/50 rounded-2xl border border-sky-100/60"
                    >
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-gray-800 font-semibold text-sm block">
                          {act.ten}
                        </span>
                        {act.ghiChu && (
                          <span className="text-xs text-gray-500 block mt-0.5">
                            {act.ghiChu}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default ServiceInfo;

