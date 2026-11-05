import React from 'react';
import { Compass } from 'lucide-react';

const LocationOverview = ({ location }) => {
  return (
    <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="mb-4">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-sky-600" />
          Thông tin tổng quan & Lịch sử
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">
          Vẻ đẹp & Giá trị Di sản {location.ten}
        </h2>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-sky-500 text-gray-700 leading-relaxed">
        <p className="whitespace-pre-line text-base">{location.moTa}</p>
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 gap-2">
          <span>
            Địa phận hành chính:{' '}
            <strong className="text-gray-800">{location.tinhThanh}</strong>
          </span>
          {location.danhHieu && (
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              {location.danhHieu}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationOverview;

