import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  MapPin,
  Clock,
  Ticket,
  Sparkles,
  Info,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Compass,
  Navigation,
  Activity,
  Star,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
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

const DEFAULT_ACTIVITIES = [
  { maHoatDong: 'HD0001', ten: 'Chèo thuyền Kayak' },
  { maHoatDong: 'HD0002', ten: 'Đi cáp treo ngắm cảnh' },
  { maHoatDong: 'HD0003', ten: 'Trekking & Leo núi' },
  { maHoatDong: 'HD0004', ten: 'Lặn ngắm san hô' },
  { maHoatDong: 'HD0005', ten: 'Thưởng thức ẩm thực đường phố' },
  { maHoatDong: 'HD0006', ten: 'Chiêm bái cầu an' },
  { maHoatDong: 'HD0007', ten: 'Đi thuyền nan vãn cảnh' },
  { maHoatDong: 'HD0008', ten: 'Trượt cát & Lái xe địa hình ATV' },
  { maHoatDong: 'HD0009', ten: 'Chụp ảnh check-in hoàng hôn' },
  { maHoatDong: 'HD0010', ten: 'Khám phá hang động thạch nhũ' },
];

const CheckInSpotModal = ({
  isOpen,
  onClose,
  editingCheckIn,
  checkInForm,
  setCheckInForm,
  destinations = [],
  availableCategories = DEFAULT_CATEGORIES,
  availableActivities = DEFAULT_ACTIVITIES,
  onSave,
  isSaving = false,
}) => {
  const fileInputRef = useRef(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [newActivityInput, setNewActivityInput] = useState('');
  const [newActivityNoteInput, setNewActivityNoteInput] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [activityError, setActivityError] = useState(null);
  const [nameError, setNameError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNameError('');
      setFormError('');
      setUploadError(null);
      setActivityError(null);
    }
  }, [isOpen, editingCheckIn]);

  if (!isOpen) return null;

  const categoriesList = availableCategories.length > 0 ? availableCategories : DEFAULT_CATEGORIES;
  const activitiesList = availableActivities.length > 0 ? availableActivities : DEFAULT_ACTIVITIES;

  const mediaList = Array.isArray(checkInForm.mediaList) && checkInForm.mediaList.length > 0
    ? checkInForm.mediaList
    : (checkInForm.image ? [{ url: checkInForm.image, type: 'image' }] : []);

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
      let currentMedia = Array.isArray(checkInForm.mediaList) ? [...checkInForm.mediaList] : [];
      if (currentMedia.length === 1 && currentMedia[0].url === '/images/vinh_ha_long.jpg' && !currentMedia[0].file) {
        currentMedia = [];
      }
      const updatedMedia = [...currentMedia, ...newItems];
      setCheckInForm({
        ...checkInForm,
        mediaList: updatedMedia,
        image: updatedMedia[0]?.url || updatedMedia[0]?.preview || checkInForm.image,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    const currentMedia = Array.isArray(checkInForm.mediaList) ? [...checkInForm.mediaList] : [];
    const updatedMedia = [...currentMedia, { url: trimmed, type: 'image' }];
    setCheckInForm({
      ...checkInForm,
      mediaList: updatedMedia,
      image: updatedMedia[0]?.url || checkInForm.image,
    });
    setManualUrlInput('');
    setShowManualUrl(false);
  };

  const handleSetPrimaryMedia = (index) => {
    if (index === 0) return;
    const currentMedia = Array.isArray(checkInForm.mediaList) ? [...checkInForm.mediaList] : [];
    if (index >= currentMedia.length) return;
    const targetItem = currentMedia[index];
    currentMedia.splice(index, 1);
    currentMedia.unshift(targetItem);
    setCheckInForm({
      ...checkInForm,
      mediaList: currentMedia,
      image: currentMedia[0]?.url || currentMedia[0]?.preview || checkInForm.image,
    });
  };

  const handleRemoveMedia = (index) => {
    const currentMedia = Array.isArray(checkInForm.mediaList) ? [...checkInForm.mediaList] : [];
    currentMedia.splice(index, 1);
    setCheckInForm({
      ...checkInForm,
      mediaList: currentMedia,
      image: currentMedia[0]?.url || currentMedia[0]?.preview || '',
    });
  };

  const handleToggleCategory = (cat) => {
    const currentList = Array.isArray(checkInForm.maLoaiHinhList) ? [...checkInForm.maLoaiHinhList] : [];
    const index = currentList.indexOf(cat.maLoaiHinh);
    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(cat.maLoaiHinh);
    }
    setCheckInForm({ ...checkInForm, maLoaiHinhList: currentList });
  };

  const handleTogglePresetActivity = (preset) => {
    const presetName = preset.ten || preset.name || '';
    const currentList = Array.isArray(checkInForm.hoatDongList) ? [...checkInForm.hoatDongList] : [];
    const index = currentList.findIndex(
      (item) => (typeof item === 'string' ? item : item?.ten || '').toLowerCase() === presetName.toLowerCase()
    );

    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push({
        maHoatDong: preset.maHoatDong,
        ten: presetName,
        icon: preset.icon || 'sparkles',
        ghiChu: '',
        thuTu: currentList.length + 1,
      });
    }
    setCheckInForm({ ...checkInForm, hoatDongList: currentList });
  };

  const handleAddCustomActivity = () => {
    setActivityError(null);
    const trimmedName = newActivityInput.trim();
    if (!trimmedName) return;

    const currentList = Array.isArray(checkInForm.hoatDongList) ? [...checkInForm.hoatDongList] : [];
    const exists = currentList.some(
      (item) => (typeof item === 'string' ? item : item?.ten || '').toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setActivityError('Hoạt động trải nghiệm này đã có trong danh sách.');
      return;
    }

    currentList.push({
      ten: trimmedName,
      icon: 'sparkles',
      ghiChu: newActivityNoteInput.trim(),
      thuTu: currentList.length + 1,
    });
    setCheckInForm({ ...checkInForm, hoatDongList: currentList });
    setNewActivityInput('');
    setNewActivityNoteInput('');
  };

  const handleKeyDownActivity = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomActivity();
    }
  };

  const handleUpdateActivityNote = (index, noteText) => {
    const currentList = Array.isArray(checkInForm.hoatDongList) ? [...checkInForm.hoatDongList] : [];
    if (index >= 0 && index < currentList.length) {
      const item = currentList[index];
      currentList[index] = typeof item === 'string'
        ? { ten: item, icon: 'sparkles', ghiChu: noteText, thuTu: index + 1 }
        : { ...item, ghiChu: noteText };
      setCheckInForm({ ...checkInForm, hoatDongList: currentList });
    }
  };

  const handleRemoveActivity = (indexToRemove) => {
    const currentList = Array.isArray(checkInForm.hoatDongList) ? [...checkInForm.hoatDongList] : [];
    const updated = currentList.filter((_, idx) => idx !== indexToRemove);
    setCheckInForm({ ...checkInForm, hoatDongList: updated });
  };

  const selectedLocation = destinations.find(
    (d) => String(d.id) === String(checkInForm.locationId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = (checkInForm.name || '').trim();
    if (!trimmedName) {
      setNameError('Vui lòng điền vào trường này');
      setFormError('Vui lòng nhập tên điểm check-in (điểm tham quan).');
      return;
    }
    if (!checkInForm.locationId) {
      setFormError('Vui lòng chọn địa danh trực thuộc.');
      return;
    }
    setNameError('');
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
              <Navigation size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
                {editingCheckIn ? 'Chỉnh sửa Điểm Check-in' : 'Thêm Điểm Check-in Mới'}
                {editingCheckIn && (
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                    #{editingCheckIn.id}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý điểm tham quan con trực thuộc địa danh theo chuẩn tài liệu đặc tả
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
                <strong>Điểm tham quan con (DiemThamQuan):</strong> Trực thuộc một địa danh du lịch lớn, dùng để hiển thị chi tiết giá vé, khung giờ mở cửa, các hoạt động trải nghiệm và phục vụ gợi ý dịch vụ liên quan.
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
                <span>Tên điểm check-in</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={checkInForm.name || ''}
                  onChange={(e) => {
                    setCheckInForm({ ...checkInForm, name: e.target.value });
                    if (nameError) setNameError('');
                    if (formError) setFormError('');
                  }}
                  placeholder="VD: Chợ nổi Cái Răng, Đảo Ti Tốp, Hang Múa..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all placeholder:text-slate-400 ${
                    nameError
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500'
                      : 'border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
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
              <select
                value={checkInForm.locationId || ''}
                onChange={(e) => {
                  setCheckInForm({ ...checkInForm, locationId: e.target.value });
                  if (formError) setFormError('');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all cursor-pointer"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.province ? `(${d.province})` : ''} - #{d.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Group 2: Nét độc đáo & Giờ mở cửa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 h-5">
                <Sparkles size={13} className="text-amber-500 shrink-0" />
                <span>Nét nổi bật (diemNoiBat)</span>
              </label>
              <input
                type="text"
                value={checkInForm.diemNoiBat || ''}
                onChange={(e) => setCheckInForm({ ...checkInForm, diemNoiBat: e.target.value })}
                placeholder="VD: Chợ đầu mối sông nước lớn nhất miền Tây..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 h-5">
                <Clock size={13} className="text-slate-400 shrink-0" />
                <span>Giờ mở cửa (gioMoCua)</span>
              </label>
              <input
                type="text"
                value={checkInForm.bestTime || ''}
                onChange={(e) => setCheckInForm({ ...checkInForm, bestTime: e.target.value })}
                placeholder="VD: 05:00 – 09:00 hoặc 07:30 – 18:00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Group 3: Giá vé & Địa chỉ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 h-5">
                <Ticket size={13} className="text-emerald-500 shrink-0" />
                <span>Giá vé tham quan (giaVe)</span>
              </label>
              <input
                type="text"
                value={checkInForm.ticketPrice || ''}
                onChange={(e) => setCheckInForm({ ...checkInForm, ticketPrice: e.target.value })}
                placeholder="VD: Miễn phí (thuê thuyền 350.000đ - 500.000đ)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 h-5">
                <MapPin size={13} className="text-sky-500 shrink-0" />
                <span>Địa chỉ chi tiết (diaChi)</span>
              </label>
              <input
                type="text"
                value={checkInForm.diaChi || ''}
                onChange={(e) => setCheckInForm({ ...checkInForm, diaChi: e.target.value })}
                placeholder="VD: Sông Cần Thơ, P. Lê Bình, Q. Cái Răng..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Group 4: Tọa độ GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 h-5">
                <Navigation size={13} className="text-slate-400 shrink-0" />
                <span>Vĩ độ (viDo)</span>
              </label>
              <input
                type="number"
                step="any"
                value={checkInForm.viDo ?? ''}
                onChange={(e) => setCheckInForm({ ...checkInForm, viDo: e.target.value })}
                placeholder="VD: 10.005230"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 h-5">
                <Compass size={13} className="text-slate-400 shrink-0" />
                <span>Kinh độ (kinhDo)</span>
              </label>
              <input
                type="number"
                step="any"
                value={checkInForm.kinhDo ?? ''}
                onChange={(e) => setCheckInForm({ ...checkInForm, kinhDo: e.target.value })}
                placeholder="VD: 105.748390"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Group 5: Mô tả chi tiết & trải nghiệm */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô tả chi tiết & trải nghiệm (moTa)
            </label>
            <textarea
              rows="3"
              value={checkInForm.desc || ''}
              onChange={(e) => setCheckInForm({ ...checkInForm, desc: e.target.value })}
              placeholder="Mô tả cụ thể về trải nghiệm thú vị, câu chuyện lịch sử, các điểm cần lưu ý khi tham quan điểm check-in này..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Group 6: Bộ sưu tập Media & Hình ảnh (MediaDiemThamQuan) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={14} className="text-sky-600" />
                <span>Bộ sưu tập hình ảnh &amp; Media (MediaDiemThamQuan) <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-xs text-slate-500">
                Đã có: <strong className="text-sky-600 font-semibold">{mediaList.length}</strong> hình ảnh
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Tải lên các hình ảnh của điểm tham quan. Ảnh đầu tiên (vị trí số 1) sẽ là <strong>Ảnh đại diện chính (Cover/Thumbnail)</strong>. Bạn có thể nhấn <em>"Đặt làm ảnh chính"</em> để đổi ảnh bìa.
            </p>

            {/* Hidden multi-file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
              onChange={handleMultipleFilesChange}
            />

            {/* Thanh công cụ tải ảnh */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <UploadCloud size={15} />
                <span>Tải ảnh từ máy tính (chọn 1 hoặc nhiều ảnh)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LinkIcon size={13} />
                <span>{showManualUrl ? 'Đóng nhập URL' : 'Thêm bằng URL ảnh'}</span>
              </button>
            </div>

            {uploadError && (
              <div className="p-3 mb-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-500" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Form nhập URL thủ công */}
            {showManualUrl && (
              <div className="p-3 mb-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Dán đường dẫn URL ảnh (VD: /images/vinh_ha_long.jpg hoặc https://...)"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualUrl();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Thêm URL
                </button>
              </div>
            )}

            {/* Lưới hiển thị các hình ảnh trong bộ sưu tập (Gallery Grid) */}
            {mediaList.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 bg-slate-50/50">
                <ImageIcon size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium">Chưa có hình ảnh nào trong bộ sưu tập.</p>
                <p className="text-[11px] text-slate-400 mt-1">Bấm nút "Tải ảnh từ máy tính" ở trên để thêm ảnh đại diện.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 bg-slate-50/70 rounded-2xl border border-slate-200/90 max-h-72 overflow-y-auto">
                {mediaList.map((item, idx) => {
                  const isPrimary = idx === 0;
                  const imgSrc = item.preview || item.url || '/images/vinh_ha_long.jpg';
                  return (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border bg-white shadow-xs transition-all ${
                        isPrimary ? 'ring-2 ring-sky-500 border-sky-500' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full h-24 overflow-hidden bg-slate-100">
                        <img
                          src={imgSrc}
                          alt={`Media ${idx + 1}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/vinh_ha_long.jpg';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Primary / Set Primary Badge & Action */}
                      <div className="p-1.5 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                        {isPrimary ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md">
                            <Star size={10} className="fill-sky-600 text-sky-600" />
                            <span>Ảnh chính</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryMedia(idx)}
                            className="text-[10px] font-medium text-slate-500 hover:text-sky-600 hover:underline cursor-pointer truncate"
                            title="Đặt làm ảnh đại diện chính"
                          >
                            Đặt làm ảnh chính
                          </button>
                        )}

                        {/* Delete single media button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                          title="Xóa ảnh này khỏi bộ sưu tập"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* New file indicator */}
                      {item.file && (
                        <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Mới chọn
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Group 7: Phân loại Loại hình du lịch (DiemThamQuan_LoaiHinh) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Compass size={14} className="text-sky-600" />
                <span>Loại hình du lịch phù hợp (DiemThamQuan_LoaiHinh)</span>
              </label>
              <span className="text-xs text-slate-500">
                Đã chọn: <strong className="text-sky-600 font-semibold">{checkInForm.maLoaiHinhList?.length || 0}</strong> loại hình
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
              {categoriesList.map((cat) => {
                const isSelected = Array.isArray(checkInForm.maLoaiHinhList) && checkInForm.maLoaiHinhList.includes(cat.maLoaiHinh);
                return (
                  <button
                    key={cat.maLoaiHinh}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.ten}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 8: Hoạt động trải nghiệm (DiemThamQuan_HoatDong & HoatDong) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-amber-600" />
                <span>Hoạt động trải nghiệm (DiemThamQuan_HoatDong)</span>
              </label>
              <span className="text-xs text-slate-500">
                Đã gán: <strong className="text-amber-600 font-semibold">{checkInForm.hoatDongList?.length || 0}</strong> trải nghiệm
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Theo thiết kế CSDL, mỗi điểm check-in có thể gắn nhiều hoạt động trải nghiệm kèm theo <strong>Ghi chú (GhiChu)</strong> như khung giờ đẹp, lưu ý trang phục hay giá vé. Bạn có thể chọn nhanh từ danh mục mẫu hoặc tự tạo trải nghiệm riêng.
            </p>

            {/* Gợi ý chọn nhanh từ danh mục có sẵn */}
            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Chọn nhanh từ danh mục trải nghiệm phổ biến:
              </span>
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 max-h-36 overflow-y-auto">
                {activitiesList.map((preset) => {
                  const presetName = preset.ten || preset.name;
                  const isSelected = Array.isArray(checkInForm.hoatDongList) && checkInForm.hoatDongList.some(
                    (item) => (typeof item === 'string' ? item : item?.ten || '').toLowerCase() === presetName.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.maHoatDong || presetName}
                      type="button"
                      onClick={() => handleTogglePresetActivity(preset)}
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

            {/* Form thêm hoạt động trải nghiệm riêng & ghi chú */}
            <div className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200/60 space-y-2.5">
              <span className="text-xs font-bold text-amber-900 block">
                Thêm hoạt động trải nghiệm riêng biệt &amp; Ghi chú:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={newActivityInput}
                    onChange={(e) => setNewActivityInput(e.target.value)}
                    onKeyDown={handleKeyDownActivity}
                    placeholder="Tên hoạt động (VD: Đi xuồng ba lá...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newActivityNoteInput}
                    onChange={(e) => setNewActivityNoteInput(e.target.value)}
                    onKeyDown={handleKeyDownActivity}
                    placeholder="Ghi chú (VD: Khung giờ, giá...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddCustomActivity}
                    className="w-full h-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>

              {activityError && (
                <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{activityError}</span>
                </div>
              )}
            </div>

            {/* Danh sách các hoạt động đã gán cho điểm check-in */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Danh sách hoạt động của điểm tham quan ({checkInForm.hoatDongList?.length || 0}):
              </span>

              {(!checkInForm.hoatDongList || checkInForm.hoatDongList.length === 0) ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 italic">
                  Chưa có hoạt động trải nghiệm nào. Hãy chọn từ danh mục mẫu ở trên hoặc nhập trải nghiệm riêng.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                  {checkInForm.hoatDongList.map((item, idx) => {
                    const activityName = typeof item === 'string' ? item : item?.ten || item?.maHoatDong || '';
                    const activityNote = typeof item === 'object' ? (item?.ghiChu || '') : '';
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
                          <span className="text-xs font-bold text-slate-800 truncate" title={activityName}>
                            {activityName}
                          </span>
                        </div>

                        {/* Ô nhập / hiển thị GhiChu */}
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={activityNote}
                            onChange={(e) => handleUpdateActivityNote(idx, e.target.value)}
                            placeholder="Thêm ghi chú trải nghiệm (GhiChu)..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Xóa trải nghiệm này"
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

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mediaList.some(m => m.file) ? 'Đang tải ảnh & lưu...' : 'Đang lưu...'}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{editingCheckIn ? 'Lưu thay đổi' : 'Thêm điểm check-in'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInSpotModal;
