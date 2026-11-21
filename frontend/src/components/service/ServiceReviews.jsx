import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const ServiceReviews = ({
  reviewsList = [],
  averageRating,
  isAuthenticated,
  currentUser,
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
  onReviewUpdate,
  onReviewDelete,
  onNavigateLogin,
  formatDate,
}) => {
  // Inline edit state for reviews in list
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineRating, setInlineRating] = useState(5);
  const [inlineHoverRating, setInlineHoverRating] = useState(0);
  const [inlineComment, setInlineComment] = useState('');
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState('');

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Start inline edit for a review card
  const handleStartInlineEdit = (review) => {
    setInlineEditingId(review.maDanhGia);
    setInlineRating(Math.round(review.danhGia) || 5);
    setInlineHoverRating(0);
    setInlineComment(review.binhLuan || '');
    setInlineError('');
  };

  // Cancel inline edit
  const handleCancelInlineEdit = () => {
    setInlineEditingId(null);
    setInlineError('');
  };

  // Save inline edit
  const handleSaveInlineEdit = async (review) => {
    if (!inlineComment.trim()) {
      setInlineError('Vui lòng nhập nội dung nhận xét của bạn.');
      return;
    }
    try {
      setInlineSubmitting(true);
      setInlineError('');
      const ok = await onReviewUpdate(inlineRating, inlineComment, review.maDanhGia);
      if (ok) {
        setInlineEditingId(null);
      }
    } catch (err) {
      setInlineError(err.message || 'Không thể cập nhật đánh giá.');
    } finally {
      setInlineSubmitting(false);
    }
  };

  // Confirm delete review
  const handleConfirmDelete = async () => {
    if (!itemToDelete || !onReviewDelete) return;
    try {
      setIsDeleting(true);
      const ok = await onReviewDelete(itemToDelete.maDanhGia);
      if (ok) {
        setItemToDelete(null);
        setInlineEditingId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      {/* Header section */}
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

      {/* Global success / error message */}
      {reviewSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{reviewSuccessMsg}</span>
        </div>
      )}
      {reviewErrorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{reviewErrorMsg}</span>
        </div>
      )}

      {/* Form gui danh gia / binh luan moi: Luon san sang de gui binh luan moi */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 mb-8">
        <h3 className="font-bold text-gray-900 text-base mb-2">
          Chia sẻ trải nghiệm của bạn
        </h3>

        {isAuthenticated ? (
          <form onSubmit={onReviewSubmit} className="space-y-4">
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

      {/* Danh sach tat ca danh gia */}
      <div className="space-y-4">
        {reviewsList.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và chia sẻ nhận xét!
          </div>
        ) : (
          reviewsList.map((review) => {
            const isMyReview = currentUser && review.maNguoiDung === currentUser.maNguoiDung;
            const isInlineEditing = inlineEditingId === review.maDanhGia;

            return (
              <div
                key={review.maDanhGia}
                className={`p-5 rounded-2xl border transition-all ${
                  isMyReview
                    ? 'bg-sky-50/40 border-sky-200 shadow-xs'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                {/* Header card danh gia */}
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">
                          {review.hoTen || 'Thành viên TravelMate'}
                        </h4>
                        {isMyReview && (
                          <span className="text-[11px] font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                            Bạn
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Hien thi sao neu khong phai dang chinh sua inline */}
                    {!isInlineEditing && (
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
                    )}

                    {/* Cac thao tac cho danh gia cua chinh user */}
                    {isMyReview && !isInlineEditing && (
                      <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
                        <button
                          type="button"
                          onClick={() => handleStartInlineEdit(review)}
                          className="p-1.5 text-sky-700 hover:bg-sky-100 rounded-lg transition text-xs font-medium flex items-center gap-1 cursor-pointer"
                          title="Chỉnh sửa đánh giá này"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(review)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition text-xs font-medium flex items-center gap-1 cursor-pointer"
                          title="Xóa đánh giá này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Xóa</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Noi dung danh gia hoac form inline edit */}
                {isInlineEditing ? (
                  <div className="mt-3 pt-3 border-t border-sky-200/80 space-y-3">
                    {inlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                        {inlineError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Thay đổi số sao
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onMouseEnter={() => setInlineHoverRating(star)}
                            onMouseLeave={() => setInlineHoverRating(0)}
                            onClick={() => setInlineRating(star)}
                            className="p-0.5 focus:outline-none transition cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                star <= (inlineHoverRating || inlineRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-semibold text-gray-600 ml-2">
                          {inlineHoverRating || inlineRating} / 5 sao
                        </span>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        value={inlineComment}
                        onChange={(e) => setInlineComment(e.target.value)}
                        placeholder="Cập nhật nhận xét của bạn..."
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelInlineEdit}
                        disabled={inlineSubmitting}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-200/70 border border-gray-300 transition cursor-pointer disabled:opacity-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveInlineEdit(review)}
                        disabled={inlineSubmitting}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {inlineSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{review.binhLuan}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal xac nhan xoa danh gia */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-center w-12 h-12 bg-rose-100 text-rose-600 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Xóa đánh giá của bạn?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
              Bạn có chắc chắn muốn xóa nhận xét và điểm đánh giá này? Thao tác này không thể hoàn tác và điểm trung bình của dịch vụ sẽ được tính toán lại.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(itemToDelete.danhGia)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 font-bold ml-1.5">
                  {itemToDelete.danhGia} sao
                </span>
              </div>
              <p className="text-xs text-gray-700 line-clamp-2 italic">
                "{itemToDelete.binhLuan}"
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => !isDeleting && setItemToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceReviews;
