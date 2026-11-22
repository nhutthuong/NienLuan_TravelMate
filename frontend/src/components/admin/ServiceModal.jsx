import React, { useState, useEffect } from 'react';
import { X, Save, Check, AlertCircle } from 'lucide-react';

const PREFERENCE_TAGS = ['Thiên nhiên', 'Khám phá', 'Nghỉ dưỡng', 'Văn hóa'];

const ServiceModal = ({
  isOpen,
  onClose,
  editingService,
  serviceForm,
  setServiceForm,
  destinations,
  onSave
}) => {
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNameError('');
      setPriceError('');
      setFormError('');
    }
  }, [isOpen, editingService]);

  if (!isOpen) return null;

  const toggleTagSelection = (tag) => {
    if (serviceForm.tags.includes(tag)) {
      setServiceForm({ ...serviceForm, tags: serviceForm.tags.filter(t => t !== tag) });
    } else {
      setServiceForm({ ...serviceForm, tags: [...serviceForm.tags, tag] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!serviceForm.name || !serviceForm.name.trim()) {
      setNameError('Vui lòng điền vào trường này');
      hasError = true;
    }
    if (!serviceForm.price || !String(serviceForm.price).trim()) {
      setPriceError('Vui lòng điền vào trường này');
      hasError = true;
    }
    if (hasError) {
      setFormError('Vui lòng điền đầy đủ Tên khách sạn và Giá phòng tham khảo.');
      return;
    }
    setNameError('');
    setPriceError('');
    setFormError('');
    onSave(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 text-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold font-heading text-slate-800">
            {editingService ? 'Chỉnh sửa Khách sạn' : 'Thêm Khách sạn mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-4 pt-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-900">Thông tin chưa đầy đủ</p>
                <p className="mt-0.5 text-rose-700">{formError}</p>
              </div>
              <button
                type="button"
                onClick={() => setFormError('')}
                className="text-rose-400 hover:text-rose-700 p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Tên Khách sạn / Khu nghỉ dưỡng <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) => {
                  setServiceForm({ ...serviceForm, name: e.target.value });
                  if (nameError) setNameError('');
                  if (formError) setFormError('');
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  nameError
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500'
                    : 'border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500'
                }`}
              />
              {nameError && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-600 animate-fadeIn">
                  <AlertCircle size={14} className="shrink-0 text-rose-500" />
                  <span>{nameError}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Thuộc địa danh gốc
              </label>
              <select
                value={serviceForm.locationId}
                onChange={(e) => setServiceForm({ ...serviceForm, locationId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Giá phòng tham khảo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={serviceForm.price}
                  onChange={(e) => {
                    setServiceForm({ ...serviceForm, price: e.target.value });
                    if (priceError) setPriceError('');
                    if (formError) setFormError('');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    priceError
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500'
                      : 'border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500'
                  }`}
                />
                {priceError && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-600 animate-fadeIn">
                    <AlertCircle size={14} className="shrink-0 text-rose-500" />
                    <span>{priceError}</span>
                  </div>
                )}
              </div>
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
