import React from 'react';

const AnalyticsTab = () => {
  const analyticsData = [
    { name: 'Vịnh Hạ Long', percentage: 24, count: 356 },
    { name: 'Tràng An (Ninh Bình)', percentage: 18, count: 267 },
    { name: 'Phố Cổ Hội An', percentage: 16, count: 237 },
    { name: 'Cầu Vàng (Đà Nẵng)', percentage: 14, count: 207 },
    { name: 'Đỉnh Fansipan', percentage: 10, count: 148 },
    { name: 'Phú Quốc', percentage: 8, count: 118 },
    { name: 'Các địa danh khác (Cần Thơ, Hà Nội, Mũi Né, Đà Lạt)', percentage: 10, count: 149 }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-800">
            Phân Bố Nhận Diện 10 Danh Thắng ResNet50
          </h3>
          <p className="text-xs text-slate-500">
            Tổng hợp từ các lượt người dùng tải ảnh phong cảnh lên hệ thống
          </p>
        </div>
        <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold rounded-full">
          1.482 lượt quét AI
        </span>
      </div>

      <div className="space-y-4">
        {analyticsData.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{item.name}</span>
              <span>{item.count} lượt ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsTab;
