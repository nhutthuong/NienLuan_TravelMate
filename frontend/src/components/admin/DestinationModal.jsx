import React from 'react';
import { X, Save } from 'lucide-react';

const DestinationModal = ({
  isOpen,
  onClose,
  editingDestination,
  destForm,
  setDestForm,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold font-heading text-slate-800">
            {editingDestination ? 'Chỉnh sửa Địa danh' : 'Thêm Địa danh mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Tên địa danh (Khớp nhãn ResNet50)
            </label>
            <input
              type="text"
              required
              value={destForm.name}
              onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Tỉnh / Thành
              </label>
              <input
                type="text"
                required
                value={destForm.province}
                onChange={(e) => setDestForm({ ...destForm, province: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Điểm đánh giá
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={destForm.rating}
                onChange={(e) => setDestForm({ ...destForm, rating: parseFloat(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Danh mục di sản / Phân loại
            </label>
            <input
              type="text"
              required
              value={destForm.category}
              onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Đường dẫn ảnh đại diện
            </label>
            <input
              type="text"
              required
              value={destForm.image}
              onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
            >
              <Save size={16} />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationModal;
