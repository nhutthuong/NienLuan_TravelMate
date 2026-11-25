import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  MapPin,
  Sparkles,
  Info,
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon,
  Star,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
  Building2,
  DollarSign,
  Compass,
  Check,
  ExternalLink,
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { maLoaiHinh: 'LH0001', ten: 'Thiên nhiên' },
  { maLoaiHinh: 'LH0002', ten: 'Văn hóa' },
  { maLoaiHinh: 'LH0003', ten: 'Lịch sử' },
  { maLoaiHinh: 'LH0004', ten: 'Nghỉ dưỡng' },
  { maLoaiHinh: 'LH0005', ten: 'Khám phá' },
  { maLoaiHinh: 'LH0006', ten: 'Mạo hiểm' },
  { maLoaiHinh: 'LH0007', ten: 'Biển đảo' },
  { maLoaiHinh: 'LH0008', ten: 'Ẩm thực' },
  { maLoaiHinh: 'LH0009', ten: 'Tâm linh' },
  { maLoaiHinh: 'LH0010', ten: 'Di sản' },
  { maLoaiHinh: 'LH0011', ten: 'Sinh thái' },
];

const DEFAULT_AMENITIES = [
  { maTienNghi: 'TN0001', ten: 'Hồ bơi vô cực view biển/núi', icon: 'waves' },
  { maTienNghi: 'TN0002', ten: 'Spa & Trị liệu thảo mộc', icon: 'sparkles' },
  { maTienNghi: 'TN0003', ten: 'Bãi biển riêng biệt lập', icon: 'umbrella' },
  { maTienNghi: 'TN0004', ten: 'Suối khoáng nóng tự nhiên', icon: 'flame' },
  { maTienNghi: 'TN0005', ten: 'Nhà hàng Fine Dining cao cấp', icon: 'utensils' },
  { maTienNghi: 'TN0006', ten: 'Quầy bar ngắm hoàng hôn', icon: 'wine' },
  { maTienNghi: 'TN0007', ten: 'Xe riêng đưa đón sân bay', icon: 'car' },
  { maTienNghi: 'TN0008', ten: 'Bồn tắm ngâm khoáng view thiên nhiên', icon: 'bath' },
  { maTienNghi: 'TN0009', ten: 'Bữa sáng buffet thượng hạng', icon: 'coffee' },
  { maTienNghi: 'TN0010', ten: 'Trà chiều & Bánh ngọt kiểu Âu', icon: 'cup-soda' },
];

const ServiceModal = ({
  isOpen,
  onClose,
  editingService,
  serviceForm,
  setServiceForm,
  destinations = [],
  availableCategories = DEFAULT_CATEGORIES,
  availableAmenities = DEFAULT_AMENITIES,
  onSave,
  isSaving = false,
}) => {
  const fileInputRef = useRef(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [newAmenityInput, setNewAmenityInput] = useState('');
  const [newAmenityNoteInput, setNewAmenityNoteInput] = useState('');
  const [amenityError, setAmenityError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNameError('');
      setPriceError('');
      setFormError('');
      setUploadError(null);
      setAmenityError(null);
      setNewAmenityInput('');
      setNewAmenityNoteInput('');
      setShowManualUrl(false);
      setManualUrlInput('');
    }
  }, [isOpen, editingService]);

  if (!isOpen) return null;

  const categoriesList = availableCategories.length > 0 ? availableCategories : DEFAULT_CATEGORIES;
  // Strict rule: Resort concept only, strictly NO GYM
  const amenitiesList = (availableAmenities.length > 0 ? availableAmenities : DEFAULT_AMENITIES)
    .filter((a) => !a.ten?.toLowerCase().includes('gym') && !a.ten?.toLowerCase().includes('fitness'));

  const mediaList = Array.isArray(serviceForm.mediaList) && serviceForm.mediaList.length > 0
    ? serviceForm.mediaList
    : (serviceForm.image ? [{ url: serviceForm.image, type: 'image' }] : []);

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const newItems = [];
    const errors = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        errors.push(`Tệp "${file.name}" không hợp lệ (chỉ hỗ trợ JPG, PNG, WEBP).`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`Tệp "${file.name}" vượt quá 10MB.`);
        continue;
      }
      newItems.push({
        file,
        preview: URL.createObjectURL(file),
        url: '',
        type: 'image',
      });
    }

    if (errors.length > 0) {
      setUploadError(errors.join(' '));
    }

    if (newItems.length > 0) {
      let currentMedia = Array.isArray(serviceForm.mediaList) ? [...serviceForm.mediaList] : [];
      if (currentMedia.length === 1 && currentMedia[0].url === '/images/vinh_ha_long.jpg' && !currentMedia[0].file) {
        currentMedia = [];
      }
      const updatedMedia = [...currentMedia, ...newItems];
      setServiceForm({
        ...serviceForm,
        mediaList: updatedMedia,
        image: updatedMedia[0]?.url || updatedMedia[0]?.preview || serviceForm.image,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    const currentMedia = Array.isArray(serviceForm.mediaList) ? [...serviceForm.mediaList] : [];
    const updatedMedia = [...currentMedia, { url: trimmed, type: 'image' }];
    setServiceForm({
      ...serviceForm,
      mediaList: updatedMedia,
      image: updatedMedia[0]?.url || serviceForm.image,
    });
    setManualUrlInput('');
    setShowManualUrl(false);
  };

  const handleSetPrimaryMedia = (index) => {
    if (index === 0) return;
    const currentMedia = Array.isArray(serviceForm.mediaList) ? [...serviceForm.mediaList] : [];
    if (index >= currentMedia.length) return;
    const targetItem = currentMedia[index];
    currentMedia.splice(index, 1);
    currentMedia.unshift(targetItem);
    setServiceForm({
      ...serviceForm,
      mediaList: currentMedia,
      image: currentMedia[0]?.url || currentMedia[0]?.preview || serviceForm.image,
    });
  };

  const handleRemoveMedia = (index) => {
    const currentMedia = Array.isArray(serviceForm.mediaList) ? [...serviceForm.mediaList] : [];
    currentMedia.splice(index, 1);
    setServiceForm({
      ...serviceForm,
      mediaList: currentMedia,
      image: currentMedia[0]?.url || currentMedia[0]?.preview || '',
    });
  };

  const handleToggleCategory = (cat) => {
    const currentList = Array.isArray(serviceForm.maLoaiHinhList) ? [...serviceForm.maLoaiHinhList] : [];
    const catId = cat.maLoaiHinh || cat.id;
    const index = currentList.indexOf(catId);
    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(catId);
    }
    setServiceForm({ ...serviceForm, maLoaiHinhList: currentList });
  };

  const handleTogglePresetAmenity = (preset) => {
    const presetName = preset.ten || preset.name || '';
    const currentList = Array.isArray(serviceForm.tienNghiList) ? [...serviceForm.tienNghiList] : [];
    const index = currentList.findIndex(
      (item) => (typeof item === 'string' ? item : item?.ten || '').toLowerCase() === presetName.toLowerCase()
    );

    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push({
        maTienNghi: preset.maTienNghi,
        ten: presetName,
        icon: preset.icon || 'sparkles',
        ghiChu: '',
        thuTu: currentList.length + 1,
      });
    }
    setServiceForm({ ...serviceForm, tienNghiList: currentList });
  };

  const handleAddCustomAmenity = () => {
    setAmenityError(null);
    const trimmedName = newAmenityInput.trim();
    if (!trimmedName) return;

    const lower = trimmedName.toLowerCase();
    if (lower.includes('gym') || lower.includes('fitness') || lower.includes('thể hình')) {
      setAmenityError('Hệ thống quy định concept nghỉ dưỡng, thư giãn (tuyệt đối không áp dụng phòng gym / thể hình).');
      return;
    }

    const currentList = Array.isArray(serviceForm.tienNghiList) ? [...serviceForm.tienNghiList] : [];
    const exists = currentList.some(
      (item) => (typeof item === 'string' ? item : item?.ten || '').toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setAmenityError('Tiện ích này đã có trong danh sách.');
      return;
    }

    currentList.push({
      ten: trimmedName,
      icon: 'sparkles',
      ghiChu: newAmenityNoteInput.trim(),
      thuTu: currentList.length + 1,
    });
    setServiceForm({ ...serviceForm, tienNghiList: currentList });
    setNewAmenityInput('');
    setNewAmenityNoteInput('');
  };

  const handleKeyDownAmenity = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomAmenity();
    }
  };

  const handleUpdateAmenityNote = (index, note) => {
    const currentList = Array.isArray(serviceForm.tienNghiList) ? [...serviceForm.tienNghiList] : [];
    if (!currentList[index]) return;
    const item = currentList[index];
    if (typeof item === 'string') {
      currentList[index] = { ten: item, ghiChu: note, thuTu: index + 1 };
    } else {
      currentList[index] = { ...item, ghiChu: note };
    }
    setServiceForm({ ...serviceForm, tienNghiList: currentList });
  };

  const handleRemoveAmenity = (index) => {
    const currentList = Array.isArray(serviceForm.tienNghiList) ? [...serviceForm.tienNghiList] : [];
    currentList.splice(index, 1);
    setServiceForm({ ...serviceForm, tienNghiList: currentList });
  };

  const selectedLocation = destinations.find(
    (d) => String(d.id) === String(serviceForm.locationId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const trimmedName = (serviceForm.name || '').trim();

    if (!trimmedName) {
      setNameError('Vui lòng điền vào trường này');
      hasError = true;
    }
    if (!serviceForm.locationId) {
      setFormError('Vui lòng chọn địa danh trực thuộc.');
      hasError = true;
    }

    const rawPrice = serviceForm.price !== undefined && serviceForm.price !== null ? String(serviceForm.price).trim() : '';
    const numericPrice = parseInt(rawPrice.replace(/\D/g, ''), 10);
    if (!rawPrice || isNaN(numericPrice) || numericPrice < 0) {
      setPriceError('Vui lòng điền giá phòng hợp lệ');
      hasError = true;
    }

    if (hasError) {
      setFormError('Vui lòng điền đầy đủ Tên khách sạn, Địa danh và Giá phòng tham khảo.');
      return;
    }

    setNameError('');
    setPriceError('');
    setFormError('');
    onSave(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 text-slate-800 my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                {editingService ? 'Chỉnh sửa Khách sạn' : 'Thêm Khách sạn Mới'}
                {editingService && (
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                    #{editingService.id}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý khách sạn & khu nghỉ dưỡng theo chuẩn tài liệu đặc tả và CSDL
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form noValidate onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Validation Alert Banner (Tailwind Alert) */}
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
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

          {/* Context Banner */}
          <div className="p-3.5 bg-sky-50/80 border border-sky-200/70 rounded-2xl flex items-start gap-3">
            <Info size={18} className="text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900 leading-relaxed">
              <p>
                <strong>Khái niệm Nghỉ dưỡng (Resort Concept) & Tiếp thị liên kết (Affiliate Model):</strong> Khách sạn tập trung vào tiện nghi thư giãn nghỉ dưỡng đỉnh cao (hồ bơi vô cực, bãi biển riêng, spa trị liệu, suối khoáng nóng, nhà hàng fine dining, xe đưa đón sân bay - hoàn toàn không có phòng tập gym) và chuyển hướng đặt phòng qua Agoda/Booking.com.
              </p>
              {selectedLocation && (
                <p className="mt-1 font-semibold text-sky-700">
                  Địa danh liên kết: {selectedLocation.name} ({selectedLocation.province})
                </p>
              )}
            </div>
          </div>

          {/* Group 1: Tên & Địa danh gốc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <span>Tên khách sạn / Resort</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={serviceForm.name || ''}
                  onChange={(e) => {
                    setServiceForm({ ...serviceForm, name: e.target.value });
                    if (nameError) setNameError('');
                    if (formError) setFormError('');
                  }}
                  placeholder="VD: Vinpearl Resort & Spa, InterContinental..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
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

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <span>Thuộc địa danh gốc</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={serviceForm.locationId || (destinations[0]?.id || '')}
                  onChange={(e) => setServiceForm({ ...serviceForm, locationId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.province || 'Việt Nam'}) - #{d.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Group 2: Số sao, Giá tham khảo, Đơn vị tính */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <Star size={13} className="text-amber-500 fill-amber-400" />
                <span>Số sao</span>
              </label>
              <select
                value={serviceForm.soSao !== undefined ? serviceForm.soSao : 5.0}
                onChange={(e) => setServiceForm({ ...serviceForm, soSao: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="5">5.0 Sao (Thượng hạng)</option>
                <option value="4.5">4.5 Sao (Cao cấp)</option>
                <option value="4">4.0 Sao (Sang trọng)</option>
                <option value="3.5">3.5 Sao (Tiêu chuẩn cao)</option>
                <option value="3">3.0 Sao (Tiện nghi)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <DollarSign size={13} className="text-sky-600" />
                <span>Giá tham khảo (VNĐ)</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="50000"
                  min="0"
                  value={serviceForm.price !== undefined ? serviceForm.price : 1500000}
                  onChange={(e) => {
                    setServiceForm({ ...serviceForm, price: e.target.value });
                    if (priceError) setPriceError('');
                    if (formError) setFormError('');
                  }}
                  placeholder="VD: 1500000"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
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

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <span>Đơn vị tính</span>
              </label>
              <input
                type="text"
                value={serviceForm.donViTinh || '/đêm'}
                onChange={(e) => setServiceForm({ ...serviceForm, donViTinh: e.target.value })}
                placeholder="VD: /đêm, /phòng/đêm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Group 3: Điểm nổi bật & Link Affiliate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <Sparkles size={13} className="text-amber-500" />
                <span>Nét nổi bật đặc trưng</span>
              </label>
              <input
                type="text"
                value={serviceForm.diemNoiBat || ''}
                onChange={(e) => setServiceForm({ ...serviceForm, diemNoiBat: e.target.value })}
                placeholder="VD: Bãi biển riêng biệt lập, hồ bơi vô cực ngắm hoàng hôn..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <ExternalLink size={13} className="text-sky-600" />
                <span>Link Affiliate Đặt phòng (OTA)</span>
              </label>
              <input
                type="url"
                value={serviceForm.affiliateUrl || ''}
                onChange={(e) => setServiceForm({ ...serviceForm, affiliateUrl: e.target.value })}
                placeholder="https://www.agoda.com/vi-vn/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Group 4: Địa chỉ chi tiết */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
              <MapPin size={13} className="text-sky-600" />
              <span>Địa chỉ chi tiết</span>
            </label>
            <input
              type="text"
              value={serviceForm.diaChi || ''}
              onChange={(e) => setServiceForm({ ...serviceForm, diaChi: e.target.value })}
              placeholder="VD: Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Group 5: Tọa độ GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <Compass size={13} className="text-sky-600" />
                <span>Vĩ độ (Latitude)</span>
              </label>
              <input
                type="number"
                step="0.0000001"
                value={serviceForm.viDo !== undefined ? serviceForm.viDo : ''}
                onChange={(e) => setServiceForm({ ...serviceForm, viDo: e.target.value })}
                placeholder="VD: 10.3341"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
                <Compass size={13} className="text-sky-600" />
                <span>Kinh độ (Longitude)</span>
              </label>
              <input
                type="number"
                step="0.0000001"
                value={serviceForm.kinhDo !== undefined ? serviceForm.kinhDo : ''}
                onChange={(e) => setServiceForm({ ...serviceForm, kinhDo: e.target.value })}
                placeholder="VD: 103.8569"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Group 6: Mô tả */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1 h-5">
              <span>Mô tả chi tiết</span>
            </label>
            <textarea
              rows={3}
              value={serviceForm.moTa || ''}
              onChange={(e) => setServiceForm({ ...serviceForm, moTa: e.target.value })}
              placeholder="Giới thiệu không gian nghỉ dưỡng, dịch vụ đẳng cấp, tiện nghi và trải nghiệm của khách sạn..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed resize-none"
            />
          </div>

          {/* Group 7: Loại hình du lịch */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-600" />
                <span>Loại hình du lịch gắn kết</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Đã chọn {Array.isArray(serviceForm.maLoaiHinhList) ? serviceForm.maLoaiHinhList.length : 0} loại hình
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {categoriesList.map((cat) => {
                const catId = cat.maLoaiHinh || cat.id;
                const isSelected = Array.isArray(serviceForm.maLoaiHinhList) && serviceForm.maLoaiHinhList.includes(catId);
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-200'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.ten}</span>
                    {isSelected && <Check size={13} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 8: Tiện nghi nghỉ dưỡng (KhachSan_TienNghi) */}
          <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Tiện ích nghỉ dưỡng (KhachSan_TienNghi)</span>
                </label>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Đặc tả CSDL: Quản lý danh mục tiện ích gắn kèm thứ tự hiển thị và ghi chú chi tiết (Concept nghỉ dưỡng - không gym)
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-800">
                Đã gán {Array.isArray(serviceForm.tienNghiList) ? serviceForm.tienNghiList.length : 0} tiện ích
              </span>
            </div>

            {/* Gợi ý tiện ích mẫu phổ biến */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Gợi ý tiện ích phổ biến (Nhấn để thêm hoặc xóa nhanh):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {amenitiesList.map((preset) => {
                  const presetName = preset.ten || preset.name || '';
                  const isSelected = Array.isArray(serviceForm.tienNghiList) && serviceForm.tienNghiList.some(
                    (item) => (typeof item === 'string' ? item : item?.ten || '').toLowerCase() === presetName.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.maTienNghi || presetName}
                      type="button"
                      onClick={() => handleTogglePresetAmenity(preset)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                      }`}
                    >
                      <Sparkles size={11} className={isSelected ? 'text-amber-200' : 'text-amber-500'} />
                      <span>{presetName}</span>
                      {isSelected && <span className="text-[10px] ml-0.5">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form thêm tiện ích riêng biệt & ghi chú */}
            <div className="p-3.5 bg-white/80 rounded-2xl border border-amber-200/60 space-y-2.5">
              <span className="text-xs font-bold text-amber-900 block">
                Nhập tiện ích nghỉ dưỡng mới &amp; Ghi chú:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={newAmenityInput}
                    onChange={(e) => {
                      setNewAmenityInput(e.target.value);
                      if (amenityError) setAmenityError(null);
                    }}
                    onKeyDown={handleKeyDownAmenity}
                    placeholder="Tên tiện ích (VD: Bể sục Jacuzzi ngoài trời...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newAmenityNoteInput}
                    onChange={(e) => setNewAmenityNoteInput(e.target.value)}
                    onKeyDown={handleKeyDownAmenity}
                    placeholder="Ghi chú (VD: Tầng 5, mở cửa 06:00 - 22:00...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="w-full h-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>

              {amenityError && (
                <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{amenityError}</span>
                </div>
              )}
            </div>

            {/* Danh sách các tiện ích đã gán cho khách sạn */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Danh sách tiện ích của khách sạn ({serviceForm.tienNghiList?.length || 0}):
              </span>

              {(!serviceForm.tienNghiList || serviceForm.tienNghiList.length === 0) ? (
                <div className="p-4 bg-white/70 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 italic">
                  Chưa có tiện ích nào. Hãy chọn từ danh mục gợi ý ở trên hoặc nhập tiện ích riêng.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                  {serviceForm.tienNghiList.map((item, idx) => {
                    const amenityName = typeof item === 'string' ? item : item?.ten || item?.maTienNghi || '';
                    const amenityNote = typeof item === 'object' ? (item?.ghiChu || '') : '';
                    return (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-amber-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <Sparkles size={13} className="text-amber-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 truncate" title={amenityName}>
                            {amenityName}
                          </span>
                        </div>

                        {/* Ô nhập / hiển thị GhiChu */}
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={amenityNote}
                            onChange={(e) => handleUpdateAmenityNote(idx, e.target.value)}
                            placeholder="Thêm ghi chú tiện ích (GhiChu)..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Xóa tiện ích này"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Group 9: Thư viện hình ảnh */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-sky-600" />
                  <span>Hình ảnh khách sạn (MediaKhachSan)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ảnh đầu tiên sẽ dùng làm ảnh đại diện chính (ThuTu = 1)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-100/70 hover:bg-sky-200/70 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon size={12} />
                  <span>{showManualUrl ? 'Đóng URL' : 'Thêm URL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <UploadCloud size={13} />
                  <span>Tải ảnh từ máy</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleMultipleFilesChange}
                  className="hidden"
                />
              </div>
            </div>

            {uploadError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-500" />
                <span>{uploadError}</span>
              </div>
            )}

            {showManualUrl && (
              <div className="flex gap-2 p-2 bg-white rounded-xl border border-slate-200 animate-fadeIn">
                <input
                  type="url"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  placeholder="Dán đường dẫn ảnh https://... hoặc /images/..."
                  className="flex-1 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Thêm
                </button>
              </div>
            )}

            {mediaList.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white group"
              >
                <UploadCloud size={28} className="mx-auto text-slate-400 group-hover:text-sky-500 transition-colors mb-1.5" />
                <p className="text-xs font-semibold text-slate-600 group-hover:text-sky-600">
                  Nhấn để chọn một hoặc nhiều ảnh từ máy tính
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB mỗi ảnh)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {mediaList.map((item, idx) => {
                  const displaySrc = item.preview || item.url || '';
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 aspect-video bg-slate-100 transition-all ${
                        isPrimary ? 'border-sky-500 shadow-md ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={displaySrc}
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/vinh_ha_long.jpg';
                        }}
                      />
                      {isPrimary ? (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                          <CheckCircle2 size={10} />
                          <span>Ảnh chính</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryMedia(idx)}
                          className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/70 hover:bg-sky-600 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          Đặt làm ảnh chính
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-700 transition-all cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-md shadow-sky-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSaving ? 'Đang lưu...' : (editingService ? 'Cập nhật Khách sạn' : 'Lưu Khách sạn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
