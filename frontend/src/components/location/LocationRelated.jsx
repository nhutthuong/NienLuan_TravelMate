import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const LocationRelated = ({
  relatedLocations = [],
  defaultImage = '/images/vinh_ha_long.jpg',
}) => {
  if (!relatedLocations || relatedLocations.length === 0) return null;

  return (
    <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Gợi ý cùng chủ đề
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Điểm đến di sản tương đồng bạn sẽ thích
          </h2>
        </div>
        <Link
          to="/explore"
          className="text-sky-700 font-semibold text-sm hover:underline flex items-center gap-1"
        >
          Xem cả 10 danh thắng <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {relatedLocations.map((sim) => (
          <Link
            key={sim.maDiaDiem}
            to={`/location/${sim.maDiaDiem}`}
            className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-300 group flex flex-col"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={sim.anhUrl || defaultImage}
                alt={sim.ten}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 text-[11px] font-semibold rounded">
                {sim.tinhThanh}
              </span>
            </div>
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <h4 className="font-bold text-gray-800 group-hover:text-sky-700 transition-colors line-clamp-1">
                {sim.ten}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                {sim.danhHieu || 'Điểm đến hấp dẫn'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LocationRelated;

