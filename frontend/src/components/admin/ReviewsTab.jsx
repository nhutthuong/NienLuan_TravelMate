import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  MessageSquare, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Filter, 
  Hotel, 
  MapPin, 
  Eye, 
  X, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const ReviewsTab = ({
  reviews,
  searchQuery,
  setSearchQuery,
  onToggleReviewStatus,
  onDeleteReview
}) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'hotel', 'attraction'
  const [filterRating, setFilterRating] = useState('all'); // 'all', '5', '4', '3', 'low'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Approved', 'Flagged'
  const [selectedReview, setSelectedReview] = useState(null);

  // Lọc dữ liệu theo tìm kiếm và bộ lọc đa chiều
  const filteredReviews = reviews.filter((rev) => {
    // 1. Tìm kiếm theo text
    const matchesSearch = 
      rev.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Lọc theo loại đối tượng
    if (filterType !== 'all' && rev.targetType !== filterType) {
      return false;
    }

    // 3. Lọc theo số sao
    if (filterRating === '5' && rev.rating < 5.0) return false;
    if (filterRating === '4' && (rev.rating < 4.0 || rev.rating >= 5.0)) return false;
    if (filterRating === '3' && (rev.rating < 3.0 || rev.rating >= 4.0)) return false;
    if (filterRating === 'low' && rev.rating >= 3.0) return false;

    // 4. Lọc theo trạng thái kiểm duyệt
    if (filterStatus !== 'all' && rev.status !== filterStatus) {
      return false;
    }

    return true;
  });

  // Tính toán chỉ số thống kê nhanh
  const totalCount = reviews.length;
  const hotelCount = reviews.filter(r => r.targetType === 'hotel').length;
  const attractionCount = reviews.filter(r => r.targetType === 'attraction').length;
  const flaggedCount = reviews.filter(r => r.status === 'Flagged').length;
  const avgRating = totalCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      {/* Mini Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng Đánh Giá</span>
            <div className="text-xl font-bold text-slate-800 mt-0.5">{totalCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <MessageSquare size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Điểm Đánh Giá TB</span>
            <div className="text-xl font-bold text-amber-500 flex items-center gap-1 mt-0.5">
              <Star size={18} className="fill-amber-400 text-amber-400" />
              <span>{avgRating} / 5.0</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Star size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Khách Sạn / Điểm TQ</span>
            <div className="text-sm font-bold text-slate-800 mt-1">
              <span className="text-sky-600">{hotelCount} KS</span> • <span className="text-indigo-600">{attractionCount} Điểm TQ</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Hotel size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Cần Xử Lý / Spam</span>
            <div className="text-xl font-bold text-rose-600 mt-0.5">
              {flaggedCount} bình luận
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <ShieldAlert size={18} />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên thành viên, email, khách sạn, điểm đến..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Target Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Phân loại:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Tất cả mục</option>
                <option value="hotel">Khách sạn nghỉ dưỡng</option>
                <option value="attraction">Điểm tham quan con</option>
              </select>
            </div>

            {/* Filter by Stars */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Số sao:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Tất cả sao</option>
                <option value="5">5 sao</option>
                <option value="4">4 - 4.9 sao</option>
                <option value="3">3 - 3.9 sao</option>
                <option value="low">Dưới 3 sao</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Trạng thái:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Approved">Đã duyệt hiển thị</option>
                <option value="Flagged">Nghi vấn vi phạm / Spam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Thành viên Đánh giá</th>
                <th className="py-3.5 px-5">Đối tượng &amp; Địa danh</th>
                <th className="py-3.5 px-5">Số sao &amp; Nội dung nhận xét</th>
                <th className="py-3.5 px-5">Thời gian</th>
                <th className="py-3.5 px-5">Kiểm duyệt</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <MessageSquare size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">Không tìm thấy đánh giá hoặc bình luận nào phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                      #{rev.id}
                    </td>

                    {/* Member */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">
                            {rev.userName}
                          </span>
                          <span className="text-xs text-slate-400 block truncate max-w-[160px]">
                            {rev.userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Target */}
                    <td className="py-4 px-5">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rev.targetType === 'hotel'
                              ? 'bg-sky-50 text-sky-700 border border-sky-100'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}>
                            {rev.targetType === 'hotel' ? 'Khách sạn' : 'Điểm check-in'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-0.5">
                            <MapPin size={11} /> {rev.locationName}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-800 text-xs block">
                          {rev.targetName}
                        </span>
                      </div>
                    </td>

                    {/* Rating & Comment */}
                    <td className="py-4 px-5 max-w-md">
                      <div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-1">
                            {rev.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{rev.createdAt}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        rev.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {rev.status === 'Approved' ? (
                          <>
                            <CheckCircle size={12} />
                            <span>Hiển thị</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} />
                            <span>Nghi vấn Spam</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Xem chi tiết */}
                        <button
                          onClick={() => setSelectedReview(rev)}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Xem chi tiết bình luận"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Toggle Duyệt / Đánh dấu vi phạm */}
                        <button
                          onClick={() => onToggleReviewStatus(rev.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            rev.status === 'Approved'
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-rose-500 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={rev.status === 'Approved' ? 'Đánh dấu nghi vấn spam' : 'Duyệt hiển thị'}
                        >
                          {rev.status === 'Approved' ? (
                            <ShieldAlert size={16} />
                          ) : (
                            <ShieldCheck size={16} />
                          )}
                        </button>

                        {/* Xóa bình luận */}
                        <button
                          onClick={() => onDeleteReview(rev.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐÁNH GIÁ */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800 animate-scaleUp">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
                <MessageSquare size={18} className="text-sky-600" />
                <span>Chi tiết Đánh giá #{selectedReview.id}</span>
              </h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* User info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={selectedReview.userAvatar}
                  alt={selectedReview.userName}
                  className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedReview.userName}</h4>
                  <p className="text-xs text-slate-400">{selectedReview.userEmail}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gửi lúc: {selectedReview.createdAt}</p>
                </div>
              </div>

              {/* Target info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                  <span className="text-slate-400 block font-medium">Đối tượng:</span>
                  <span className="font-bold text-sky-800 mt-0.5 block">{selectedReview.targetName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Địa danh:</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">{selectedReview.locationName}</span>
                </div>
              </div>

              {/* Rating stars */}
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Điểm số đánh giá
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(selectedReview.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-800 ml-1">
                    {selectedReview.rating} / 5.0 sao
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Nội dung bình luận
                </span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                  "{selectedReview.comment}"
                </div>
              </div>

              {/* Status info */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Trạng thái hiện tại:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                  selectedReview.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {selectedReview.status === 'Approved' ? 'Đã duyệt hiển thị' : 'Nghi vấn Spam'}
                </span>
              </div>
            </div>

            {/* Actions footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onDeleteReview(selectedReview.id);
                  setSelectedReview(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Xóa bình luận này</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onToggleReviewStatus(selectedReview.id);
                    setSelectedReview({
                      ...selectedReview,
                      status: selectedReview.status === 'Approved' ? 'Flagged' : 'Approved'
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedReview.status === 'Approved'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {selectedReview.status === 'Approved' ? (
                    <>
                      <ShieldAlert size={14} />
                      <span>Đánh dấu vi phạm</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      <span>Duyệt hiển thị</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
