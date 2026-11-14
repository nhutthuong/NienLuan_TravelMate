import React, { useRef, useState } from 'react';
import {
  X,
  Save,
  Sparkles,
  MapPin,
  Compass,
  Image as ImageIcon,
  Info,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const ALL_CATEGORY_OPTIONS = [
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

const DestinationModal = ({
  isOpen,
  onClose,
  editingDestination,
  destForm,
  setDestForm,
  onSave,
  availableCategories = ALL_CATEGORY_OPTIONS,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  const isAiLocation = Boolean(
    editingDestination &&
    (
      (typeof editingDestination.id === 'string' &&
        editingDestination.id.startsWith('DD00') &&
        parseInt(editingDestination.id.replace('DD', ''), 10) <= 10) ||
      (typeof editingDestination.id === 'number' && editingDestination.id <= 10)
    )
  );

  const categoriesList = availableCategories.length > 0 ? availableCategories : ALL_CATEGORY_OPTIONS;

  const fileInputRef = useRef(null);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Định dạng tệp không hợp lệ. Vui lòng chọn ảnh định dạng JPG, PNG hoặc WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng tệp vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setDestForm({
      ...destForm,
      imageFile: file,
      imagePreview: previewUrl,
    });
  };

  const handleResetImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDestForm({
      ...destForm,
      imageFile: null,
      imagePreview: null,
    });
  };

  const handleToggleCategory = (cat) => {
    const currentIds = Array.isArray(destForm.maLoaiHinhList) ? [...destForm.maLoaiHinhList] : [];
    const currentNames = Array.isArray(destForm.categories) ? [...destForm.categories] : [];

    const idIndex = currentIds.indexOf(cat.maLoaiHinh);
    const nameIndex = currentNames.indexOf(cat.ten);

    if (idIndex > -1) {
      currentIds.splice(idIndex, 1);
      if (nameIndex > -1) currentNames.splice(nameIndex, 1);
    } else {
      currentIds.push(cat.maLoaiHinh);
      if (nameIndex === -1) currentNames.push(cat.ten);
    }

    setDestForm({
      ...destForm,
      maLoaiHinhList: currentIds,
      categories: currentNames,
      category: currentNames[0] || 'Thiên nhiên',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 text-slate-800 animate-scaleUp overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Compass className="text-sky-600" size={22} />
              <span>{editingDestination ? 'Chỉnh sửa Địa danh' : 'Thêm Địa danh mới'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật thông tin chi tiết bảng dữ liệu Địa điểm (DiaDiem) theo chuẩn tài liệu đặc tả
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* AI Banner Specification Info */}
          {editingDestination ? (
            isAiLocation ? (
              <div className="p-3.5 bg-sky-50 border border-sky-200/80 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                      Địa danh gốc mô hình AI ResNet50
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-sky-200/70 text-sky-900 font-mono text-[11px] font-bold">
                      Mã: #{editingDestination.id}
                    </span>
                  </div>
                  <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                    Địa danh này gắn cố định với nhãn huấn luyện AI (Index 0 – 9). Theo quy định đặc tả, 10 địa điểm AI chỉ được phép chỉnh sửa các trường thông tin, không được phép xóa khỏi cơ sở dữ liệu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
                <Info size={16} className="text-slate-500 shrink-0" />
                <span>
                  Địa danh mở rộng thủ công (#{editingDestination.id}) — Dùng để tra cứu và gán dịch vụ trên Web, không nằm trong tập huấn luyện nhận diện AI.
                </span>
              </div>
            )
          ) : (
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong className="font-semibold">Quy định đặc tả:</strong> Địa điểm mới được tạo sẽ cấp mã tự động từ <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">DD0011</code> trở đi, dùng để tra cứu trên Web. Mô hình AI ResNet50 giữ nguyên 10 nhãn gốc ban đầu (không mở rộng thêm nhãn AI).
              </p>
            </div>
          )}

          {/* Group 1: Tên & Tỉnh thành */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên địa danh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Cần Thơ, Đà Lạt, Vịnh Hạ Long..."
                value={destForm.name || ''}
                onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tỉnh / Thành phố <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Cần Thơ, Lâm Đồng, Quảng Ninh..."
                value={destForm.province || ''}
                onChange={(e) => setDestForm({ ...destForm, province: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Group 2: Danh hiệu & Thời điểm lý tưởng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Danh hiệu / Đặc trưng nổi bật (danhHieu)
              </label>
              <input
                type="text"
                placeholder="VD: Đô thị sông nước Tây Đô, Kỳ quan Thiên nhiên..."
                value={destForm.danhHieu || ''}
                onChange={(e) => setDestForm({ ...destForm, danhHieu: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Thời điểm lý tưởng (thoiDiemLyTuong)
              </label>
              <input
                type="text"
                placeholder="VD: Tháng 11 – Tháng 4, Quanh năm..."
                value={destForm.thoiDiemLyTuong || ''}
                onChange={(e) => setDestForm({ ...destForm, thoiDiemLyTuong: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Group 3: Quy mô & Tọa độ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quy mô (quyMo)
              </label>
              <input
                type="text"
                placeholder="VD: 1.439 km² • Đô thị loại I"
                value={destForm.quyMo || ''}
                onChange={(e) => setDestForm({ ...destForm, quyMo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vĩ độ (viDo)
              </label>
              <input
                type="number"
                step="any"
                placeholder="VD: 10.045162"
                value={destForm.viDo ?? ''}
                onChange={(e) => setDestForm({ ...destForm, viDo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kinh độ (kinhDo)
              </label>
              <input
                type="number"
                step="any"
                placeholder="VD: 105.746857"
                value={destForm.kinhDo ?? ''}
                onChange={(e) => setDestForm({ ...destForm, kinhDo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Group 4: Hình ảnh đại diện (Tải file từ máy tính & Xem trước) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hình ảnh đại diện địa danh <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="text-[11px] text-sky-600 hover:text-sky-700 font-medium underline cursor-pointer"
              >
                {showManualUrl ? 'Ẩn nhập URL thủ công' : 'Hoặc nhập URL ảnh thủ công'}
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
              onChange={handleImageFileChange}
            />

            {/* Upload & Preview Card */}
            <div className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/70 hover:bg-slate-50 transition-all">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Preview Box */}
                <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm flex items-center justify-center">
                  <img
                    src={destForm.imagePreview || destForm.image || '/images/vinh_ha_long.jpg'}
                    alt="Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/vinh_ha_long.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                  {destForm.imageFile && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                      <CheckCircle2 size={10} /> Mới chọn
                    </span>
                  )}
                </div>

                {/* Information & Action buttons */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    {destForm.imageFile ? (
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 truncate">
                        <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                        <span className="truncate">Tệp mới: {destForm.imageFile.name} ({(destForm.imageFile.size / 1024).toFixed(1)} KB)</span>
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 truncate">
                        <ImageIcon size={15} className="shrink-0 text-slate-400" />
                        <span className="truncate font-mono text-[11px] text-slate-600">
                          {destForm.image || 'Chưa có ảnh'}
                        </span>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Nhấn nút bên dưới để chọn ảnh từ máy tính (JPG, PNG, WEBP, tối đa 10MB). Khi cập nhật ảnh mới, file ảnh cũ không còn liên kết với địa danh nào sẽ tự động xóa khỏi thư mục để tiết kiệm dung lượng.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <UploadCloud size={15} />
                      <span>{destForm.imageFile ? 'Thay đổi ảnh khác' : 'Tải ảnh từ máy tính'}</span>
                    </button>

                    {destForm.imageFile && (
                      <button
                        type="button"
                        onClick={handleResetImage}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw size={13} />
                        <span>Khôi phục ảnh ban đầu</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional manual URL input if toggled */}
              {showManualUrl && (
                <div className="mt-3 pt-3 border-t border-slate-200/80">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Đường dẫn URL ảnh trực tiếp
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="VD: /images/cho_noi.jpg hoặc URL ảnh trực tiếp"
                      value={destForm.image || ''}
                      onChange={(e) => setDestForm({ ...destForm, image: e.target.value, imageFile: null, imagePreview: null })}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Group 5: Phân loại Loại hình du lịch (DiaDiem_LoaiHinh) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Phân loại Loại hình Du lịch (DiaDiem_LoaiHinh)
              </label>
              <span className="text-xs text-slate-500">
                Đã chọn: <strong className="text-sky-600 font-semibold">{destForm.maLoaiHinhList?.length || 0}</strong> loại hình
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2.5">
              Chọn các loại hình để phục vụ tính năng lọc địa danh và thuật toán gợi ý điểm đến tương tự:
            </p>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
              {categoriesList.map((cat) => {
                const isSelected = Array.isArray(destForm.maLoaiHinhList) && destForm.maLoaiHinhList.includes(cat.maLoaiHinh);
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

          {/* Group 6: Mô tả tổng quan, lịch sử, văn hóa (moTa) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô tả tổng quan, lịch sử &amp; văn hóa (moTa)
            </label>
            <textarea
              rows={4}
              placeholder="Nhập thông tin giới thiệu tổng quan, lịch sử hình thành, nét đẹp văn hóa và trải nghiệm nổi bật của địa danh..."
              value={destForm.moTa || ''}
              onChange={(e) => setDestForm({ ...destForm, moTa: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400 leading-relaxed resize-y"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{destForm.imageFile ? 'Đang tải ảnh & lưu...' : 'Đang lưu...'}</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{editingDestination ? 'Lưu thay đổi' : 'Thêm địa danh'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationModal;
