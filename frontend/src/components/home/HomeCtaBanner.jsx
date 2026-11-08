import React from "react";
import { Link } from "react-router-dom";

const HomeCtaBanner = () => {
  return (
    <section className="px-6 pb-20 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-teal-700 to-sky-700 rounded-3xl p-12 flex flex-col md:flex-row justify-between items-center text-white shadow-xl gap-8">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Gợi ý địa điểm du lịch
            <br />
            theo sở thích cá nhân
          </h2>
          <p className="text-lg text-white/90 max-w-xl">
            Sau khi nhận diện danh lam thắng cảnh, TravelMate sẽ chọn lọc các
            khách sạn, dịch vụ, địa điểm check-in theo sở thích của bạn
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <Link
            to="/explore?tab=hotels"
            className="bg-white text-teal-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-md text-center"
          >
            Khám phá danh sách Khách sạn
          </Link>
          <Link
            to="/explore?tab=destinations"
            className="bg-transparent border border-white/50 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all text-center"
          >
            Xem 10 địa điểm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCtaBanner;
