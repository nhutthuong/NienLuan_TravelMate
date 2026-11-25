import React from 'react';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Check,
  Ticket,
  Clock,
  Waves,
  Mountain,
  Footprints,
  Anchor,
  Utensils,
  Sun,
  Camera,
  Eye,
  Landmark,
  Zap,
  Bike,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const getActivityIcon = (iconName) => {
  switch (iconName) {
    case 'waves': return <Waves className="w-4 h-4 text-sky-600" />;
    case 'mountain': return <Mountain className="w-4 h-4 text-emerald-600" />;
    case 'footprints': return <Footprints className="w-4 h-4 text-amber-600" />;
    case 'anchor': return <Anchor className="w-4 h-4 text-blue-600" />;
    case 'utensils': return <Utensils className="w-4 h-4 text-rose-600" />;
    case 'compass': return <Compass className="w-4 h-4 text-teal-600" />;
    case 'sun': return <Sun className="w-4 h-4 text-amber-500" />;
    case 'camera': return <Camera className="w-4 h-4 text-purple-600" />;
    case 'eye': return <Eye className="w-4 h-4 text-indigo-600" />;
    case 'landmark': return <Landmark className="w-4 h-4 text-yellow-700" />;
    case 'zap': return <Zap className="w-4 h-4 text-orange-500" />;
    case 'bike': return <Bike className="w-4 h-4 text-green-600" />;
    default: return <Sparkles className="w-4 h-4 text-amber-500" />;
  }
};

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
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Hoạt động &amp; Trải nghiệm nổi bật:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {data.hoatDong.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100 hover:border-amber-300 transition-all shadow-xs"
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-center flex-shrink-0">
                        {getActivityIcon(act.icon)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-900 font-bold text-sm block leading-snug">
                          {act.ten}
                        </span>
                        {act.ghiChu && (
                          <span className="text-xs text-gray-600 block mt-1 leading-relaxed">
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

        {/* Bản đồ định vị GPS từ CSDL (Hiển thị cho cả Khách sạn và Điểm tham quan) */}
        {data.viDo !== undefined && data.viDo !== null && data.kinhDo !== undefined && data.kinhDo !== null && (
          <div className="mt-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vị trí định vị GPS trên bản đồ
                </span>
                <span className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {Number(data.viDo).toFixed(4)}°N, {Number(data.kinhDo).toFixed(4)}°E
                </span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${data.viDo},${data.kinhDo}+(${encodeURIComponent(data.ten)})&hl=vi`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Mở Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              <iframe
                src={`https://maps.google.com/maps?q=${data.viDo},${data.kinhDo}&hl=vi&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Bản đồ ${data.ten}`}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ServiceInfo;

