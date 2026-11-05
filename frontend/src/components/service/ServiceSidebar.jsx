import React from 'react';
import { ExternalLink, MapPin, Phone, Check } from 'lucide-react';

const ServiceSidebar = ({
  data,
  isHotel,
  averageRating,
  reviewsCount,
  onAffiliateBooking,
  onDirections,
  onOpenContactModal,
  formatCurrency,
}) => {
  return (
    <div className="w-full lg:w-[380px] flex-shrink-0">
      <div className="sticky top-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8">
        {/* Price Section */}
        <div className="mb-6">
          <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider mb-3 inline-block">
            {isHotel ? 'ƯU ĐÃI NGHỈ DƯỠNG' : 'THAM QUAN TRẢI NGHIỆM'}
          </span>

          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-extrabold text-rose-600">
              {isHotel ? formatCurrency(data.giaThamKhao) : data.giaVe || 'Miễn phí'}
            </span>
            {isHotel && (
              <span className="text-gray-500 font-medium pb-1 text-sm">
                {data.donViTinh || '/đêm'}
              </span>
            )}
          </div>
          <div className="text-gray-400 text-xs">
            * Mức giá tham khảo, có thể thay đổi tùy thời điểm mùa cao điểm.
          </div>
        </div>

        {/* Location summary card */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-500">Khu vực:</span>
            <span className="font-bold text-gray-800">{data.tenDiaDiem || data.tinhThanh}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-500">Đánh giá chung:</span>
            <span className="font-bold text-amber-700">
              {averageRating} / 5.0 ({reviewsCount} lượt)
            </span>
          </div>
          {isHotel && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-500">Phân hạng:</span>
              <span className="font-bold text-gray-800">{data.soSao} sao quốc tế</span>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          {isHotel ? (
            <button
              onClick={onAffiliateBooking}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Đặt phòng qua đối tác</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onDirections}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 bg-sky-600 hover:bg-sky-700 shadow-sky-200/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Chỉ đường & Đến tham quan</span>
            </button>
          )}

          <button
            onClick={onOpenContactModal}
            className="w-full py-3 rounded-xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-gray-500" />
            <span>Liên hệ tư vấn</span>
          </button>
        </div>

        {/* Trust Points */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <ul className="text-xs text-gray-500 space-y-2.5">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Thông tin địa điểm đã được kiểm chứng</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Đặt phòng an toàn qua các cổng đối tác uy tín</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Hỗ trợ gợi ý lịch trình thông minh cùng TravelMate</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceSidebar;

