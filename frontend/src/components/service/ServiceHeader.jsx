import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Star,
  MapPin,
  ExternalLink,
  Heart,
} from 'lucide-react';

const ServiceHeader = ({
  data,
  isHotel,
  averageRating,
  reviewsCount,
  isFavorited,
  wishlistLoading,
  onToggleWishlist,
  onDirections,
}) => {
  return (
    <>
      {/* Breadcrumb Back Link */}
      <div className="mb-4">
        <Link
          to={data.maDiaDiem ? `/location/${data.maDiaDiem}` : '/explore'}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại {data.tenDiaDiem ? `danh thắng ${data.tenDiaDiem}` : 'Khám phá'}</span>
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                isHotel
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-sky-100 text-sky-800'
              }`}
            >
              {isHotel ? 'Cơ sở lưu trú & Khách sạn nghỉ dưỡng' : 'Điểm tham quan & Khám phá'}
            </span>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const ratingScore = isHotel ? data.soSao : data.diemDanhGia || 5;
                const fillPercent = Math.max(0, Math.min(100, (ratingScore - star + 1) * 100));
                return (
                  <div key={star} className="relative w-4 h-4">
                    <Star className="w-4 h-4 text-gray-200 fill-gray-200 absolute top-0 left-0" />
                    <div
                      className="overflow-hidden absolute top-0 left-0 h-4"
                      style={{ width: `${fillPercent}%` }}
                    >
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                );
              })}
              <span className="text-xs font-bold text-gray-700 ml-1">
                {averageRating} / 5.0
              </span>
              <span className="text-xs text-gray-400">
                ({reviewsCount} đánh giá)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            {data.ten}
          </h1>

          <p className="text-gray-600 text-sm flex flex-wrap items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{data.diaChi}</span>
            {data.tenDiaDiem && <span>• {data.tenDiaDiem}</span>}
            {data.tinhThanh && <span>, {data.tinhThanh}</span>}
            <button
              onClick={onDirections}
              className="ml-2 text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem trên bản đồ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onToggleWishlist}
            disabled={wishlistLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition border cursor-pointer ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-500'
              }`}
            />
            <span>{isFavorited ? 'Đã lưu yêu thích' : 'Lưu lại'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceHeader;

