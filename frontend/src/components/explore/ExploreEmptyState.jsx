import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const ExploreEmptyState = ({ searchQuery, onReset }) => {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm mb-16 max-w-2xl mx-auto p-8">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Không tìm thấy kết quả phù hợp
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
        {searchQuery
          ? `Không tìm thấy dịch vụ hoặc địa điểm nào khớp với từ khóa "${searchQuery}". Hãy thử từ khóa khác hoặc bỏ bớt tiêu chí lọc.`
          : 'Hiện tại chưa có dịch vụ nào phù hợp với toàn bộ tiêu chí lọc bạn đã chọn. Vui lòng mở rộng phạm vi tìm kiếm.'}
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Đặt lại toàn bộ bộ lọc</span>
      </button>
    </div>
  );
};

export default ExploreEmptyState;

