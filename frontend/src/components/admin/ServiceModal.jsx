import React from 'react';
import { X, Save, Check } from 'lucide-react';
import { PREFERENCE_TAGS } from './adminMockData';

const ServiceModal = ({
  isOpen,
  onClose,
  editingService,
  serviceForm,
  setServiceForm,
  destinations,
  onSave
}) => {
  if (!isOpen) return null;

  const toggleTagSelection = (tag) => {
    if (serviceForm.tags.includes(tag)) {
      setServiceForm({ ...serviceForm, tags: serviceForm.tags.filter(t => t !== tag) });
    } else {
      setServiceForm({ ...serviceForm, tags: [...serviceForm.tags, tag] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 text-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold font-heading text-slate-800">
            {editingService ? 'Chỉnh sửa Khách sạn & Dịch vụ' : 'Thêm Khách sạn mới'}
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
              Tên Khách sạn / Khu nghỉ dưỡng
            </label>
            <input
              type="text"
              required
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Thuộc địa danh gốc
              </label>
              <select
                value={serviceForm.locationId}
                onChange={(e) => setServiceForm({ ...serviceForm, locationId: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Giá phòng tham khảo
              </label>
              <input
                type="text"
                required
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Gán thẻ sở thích (Khớp bộ lọc 4 nhóm sở thích)
            </label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_TAGS.map((tag) => {
                const isSelected = serviceForm.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTagSelection(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check size={13} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Tiện ích thư giãn cốt lõi (Ưu tiên hồ bơi, spa - không có gym)
            </label>
            <input
              type="text"
              required
              value={serviceForm.coreAmenities}
              onChange={(e) => setServiceForm({ ...serviceForm, coreAmenities: e.target.value })}
              placeholder="Hồ bơi vô cực ngoài trời, Khu spa thư giãn, Trị liệu khoáng nóng..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Đường dẫn liên kết tiếp thị Affiliate (Agoda / Booking.com)
            </label>
            <input
              type="url"
              required
              value={serviceForm.affiliateUrl}
              onChange={(e) => setServiceForm({ ...serviceForm, affiliateUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Ảnh khách sạn (URL)
            </label>
            <input
              type="text"
              required
              value={serviceForm.image}
              onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
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
              <span>Lưu khách sạn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
