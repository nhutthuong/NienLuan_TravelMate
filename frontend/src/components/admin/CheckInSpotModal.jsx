import React from 'react';
import { X, Save } from 'lucide-react';

const CheckInSpotModal = ({
  isOpen,
  onClose,
  editingCheckIn,
  checkInForm,
  setCheckInForm,
  destinations,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold font-heading text-slate-800">
            {editingCheckIn ? 'Chỉnh sửa Điểm Check-in' : 'Thêm Điểm Check-in mới'}
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
              Tên điểm check-in / tham quan
            </label>
            <input
              type="text"
              required
              value={checkInForm.name}
              onChange={(e) => setCheckInForm({ ...checkInForm, name: e.target.value })}
              placeholder="Ví dụ: Đảo Ti Tốp, Hang Múa, Chùa Cầu..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Thuộc địa danh gốc
            </label>
            <select
              value={checkInForm.locationId}
              onChange={(e) => setCheckInForm({ ...checkInForm, locationId: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Mô tả nét độc đáo & trải nghiệm
            </label>
            <textarea
              rows="3"
              required
              value={checkInForm.desc}
              onChange={(e) => setCheckInForm({ ...checkInForm, desc: e.target.value })}
              placeholder="Nét hấp dẫn của điểm check-in này..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Giá vé / Chi phí tham quan
              </label>
              <input
                type="text"
                required
                value={checkInForm.ticketPrice}
                onChange={(e) => setCheckInForm({ ...checkInForm, ticketPrice: e.target.value })}
                placeholder="Miễn phí hoặc 100.000đ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Thời điểm / Giờ mở cửa
              </label>
              <input
                type="text"
                required
                value={checkInForm.bestTime}
                onChange={(e) => setCheckInForm({ ...checkInForm, bestTime: e.target.value })}
                placeholder="08:00 - 17:00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Đường dẫn ảnh đại diện (URL)
            </label>
            <input
              type="text"
              required
              value={checkInForm.image}
              onChange={(e) => setCheckInForm({ ...checkInForm, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
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
              <span>Lưu điểm check-in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInSpotModal;
