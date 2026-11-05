import React from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";

const DestinationsSection = ({ destinations }) => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div className="text-primary font-semibold text-sm mb-2 flex items-center gap-1">
            <Search size={16} />
            Hệ thống danh thắng AI
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            10 Địa danh tiêu biểu được hỗ trợ nhận diện
          </h2>
          <p className="text-slate-500 max-w-2xl">
            Chỉ cần chụp hoặc tải ảnh bất kỳ, mạng ResNet50 sẽ nhận dạng chuẩn
            xác trong chưa đầy 1 giây kèm đầy đủ thông tin lưu trú.
          </p>
        </div>
        <Link
          to="/explore"
          className="text-primary font-semibold flex items-center gap-1 hover:underline whitespace-nowrap"
        >
          Xem toàn bộ 10 địa danh <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {destinations.map((dest, index) => (
          <Link
            to={dest.id ? `/location/${dest.id}` : "/explore"}
            className="bg-white rounded-xl shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary transition-all cursor-pointer flex flex-col overflow-hidden group"
            key={dest.id || index}
          >
            <div className="h-40 w-full overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {dest.name}
              </h3>
              <div className="text-sm text-slate-500 flex flex-col gap-1 mt-1">
                <span>{dest.location}</span>
                <span className="text-slate-400">{dest.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
