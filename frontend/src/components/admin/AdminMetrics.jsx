import React from 'react';
import { 
  MapPin, 
  Hotel, 
  MessageSquare,
  Users, 
  TrendingUp, 
  ShieldAlert,
  Star,
  AlertCircle
} from 'lucide-react';

const AdminMetrics = ({
  destinationsCount,
  servicesCount,
  reviewsCount,
  reviewsAverageRating,
  flaggedReviewsCount,
  usersCount,
  bannedUsersCount
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Metric 1: Địa danh */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục Địa danh</span>
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <MapPin size={20} />
          </div>
        </div>
        <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">{destinationsCount} Địa điểm</h3>
        <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1 mt-1">
          Bộ dữ liệu 10 danh lam ResNet50
        </span>
      </div>

      {/* Metric 2: Khách sạn nghỉ dưỡng */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách sạn nghỉ dưỡng</span>
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
            <Hotel size={20} />
          </div>
        </div>
        <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">{servicesCount} Dịch vụ</h3>
        <span className="text-xs text-sky-600 font-medium inline-flex items-center gap-1 mt-1">
          Tiện ích hồ bơi &amp; thư giãn
        </span>
      </div>

      {/* Metric 3: Đánh giá & Bình luận (MỚI) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đánh giá &amp; Bình luận</span>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <MessageSquare size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-2xl font-bold font-heading text-slate-800">{reviewsCount}</h3>
          <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-0.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {reviewsAverageRating}
          </span>
        </div>
        {flaggedReviewsCount > 0 ? (
          <span className="text-xs text-rose-500 font-semibold inline-flex items-center gap-1 mt-1">
            <AlertCircle size={12} /> {flaggedReviewsCount} nghi vấn spam
          </span>
        ) : (
          <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 mt-1">
            Tất cả đã kiểm duyệt
          </span>
        )}
      </div>

      {/* Metric 4: Người dùng */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Thành viên</span>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Users size={20} />
          </div>
        </div>
        <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">{usersCount} Tài khoản</h3>
        <span className="text-xs text-rose-500 font-medium inline-flex items-center gap-1 mt-1">
          <ShieldAlert size={12} /> {bannedUsersCount} tài khoản bị khóa
        </span>
      </div>

      {/* Metric 5: Hiệu suất ResNet50 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ chính xác AI</span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp size={20} />
          </div>
        </div>
        <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">98.2%</h3>
        <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 mt-1">
          ResNet50 Top-1 Avg
        </span>
      </div>
    </div>
  );
};

export default AdminMetrics;
