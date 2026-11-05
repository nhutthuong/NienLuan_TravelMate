import React from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';

const ServiceReviews = ({
  reviewsList = [],
  averageRating,
  isAuthenticated,
  reviewRating,
  setReviewRating,
  hoverRating,
  setHoverRating,
  reviewComment,
  setReviewComment,
  submittingReview,
  reviewSuccessMsg,
  reviewErrorMsg,
  onReviewSubmit,
  onNavigateLogin,
  formatDate,
}) => {
  return (
    <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-sky-600" />
            Đánh giá từ khách hàng
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Nhận xét chân thực từ cộng đồng thành viên TravelMate
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-2xl font-bold text-lg border border-amber-200/80 w-fit">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span>{averageRating}</span>
          <span className="text-xs text-amber-600 font-normal">/ 5.0</span>
        </div>
      </div>

      {/* Form gui danh gia */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 mb-8">
        <h3 className="font-bold text-gray-900 text-base mb-2">
          Chia sẻ trải nghiệm của bạn
        </h3>

        {isAuthenticated ? (
          <form onSubmit={onReviewSubmit} className="space-y-4">
            {reviewSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
                {reviewSuccessMsg}
              </div>
            )}
            {reviewErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
                {reviewErrorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Số sao đánh giá
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(star)}
                    className="p-1 focus:outline-none transition cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating || reviewRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-gray-500 ml-2">
                  {hoverRating || reviewRating} / 5 sao
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Nội dung nhận xét
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận về dịch vụ, phong cảnh, ẩm thực hoặc chất lượng phòng nghỉ..."
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Bạn cần đăng nhập tài khoản thành viên để viết nhận xét và chấm điểm cho dịch vụ này.
            </p>
            <button
              onClick={onNavigateLogin}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>

      {/* Danh sach danh gia */}
      <div className="space-y-4">
        {reviewsList.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và chia sẻ nhận xét!
          </div>
        ) : (
          reviewsList.map((review) => (
            <div
              key={review.maDanhGia}
              className="bg-slate-50 p-5 rounded-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.avatarUrl ? (
                    <img
                      src={review.avatarUrl}
                      alt={review.hoTen}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.hoTen ? review.hoTen.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {review.hoTen || 'Thành viên TravelMate'}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(review.danhGia)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                "{review.binhLuan}"
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ServiceReviews;

