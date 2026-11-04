import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Compass, Trees, Landmark, Palmtree, Mountain, Waves, UtensilsCrossed, Church, Award, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DEFAULT_CATEGORIES = [
  { maLoaiHinh: 'LH0001', ten: 'Thiên nhiên', icon: Trees, desc: 'Núi non, vịnh biển, sinh thái tự nhiên' },
  { maLoaiHinh: 'LH0002', ten: 'Văn hóa', icon: Landmark, desc: 'Lễ hội, phong tục, làng nghề truyền thống' },
  { maLoaiHinh: 'LH0004', ten: 'Nghỉ dưỡng', icon: Palmtree, desc: 'Resort cao cấp, spa thư giãn' },
  { maLoaiHinh: 'LH0005', ten: 'Khám phá', icon: Compass, desc: 'Check-in cảnh đẹp, du thuyền thưởng ngoạn' },
  { maLoaiHinh: 'LH0007', ten: 'Biển đảo', icon: Waves, desc: 'Bãi cát trắng, lặn ngắm san hô' },
  { maLoaiHinh: 'LH0008', ten: 'Ẩm thực', icon: UtensilsCrossed, desc: 'Đặc sản vùng miền, ẩm thực đường phố' },
  { maLoaiHinh: 'LH0006', ten: 'Mạo hiểm', icon: Mountain, desc: 'Trekking leo núi, trượt cát, lướt ván' },
  { maLoaiHinh: 'LH0003', ten: 'Lịch sử', icon: Landmark, desc: 'Di tích cổ, bảo tàng lịch sử' },
  { maLoaiHinh: 'LH0009', ten: 'Tâm linh', icon: Church, desc: 'Chùa chiền, đền đài thanh tịnh' },
  { maLoaiHinh: 'LH0010', ten: 'Di sản', icon: Award, desc: 'Kỳ quan và di sản văn hóa UNESCO' },
  { maLoaiHinh: 'LH0011', ten: 'Sinh thái', icon: Leaf, desc: 'Miệt vườn cây trái, rừng bảo tồn' },
];

const PreferencesModal = ({ isOpen, onClose }) => {
  const { user, updatePreferences } = useAuth();
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user?.soThich) {
      setSelected(user.soThich);
    } else {
      setSelected([]);
    }
  }, [user, isOpen]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.locations.getCategories();
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map((cat) => {
            const def = DEFAULT_CATEGORIES.find((d) => d.maLoaiHinh === cat.maLoaiHinh);
            return {
              maLoaiHinh: cat.maLoaiHinh,
              ten: cat.ten,
              icon: def ? def.icon : Compass,
              desc: cat.moTa || (def ? def.desc : ''),
            };
          });
          setCategories(merged);
        }
      } catch (_err) {
        // Fallback to DEFAULT_CATEGORIES
      }
    };
    if (isOpen) {
      fetchCats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (maLoaiHinh) => {
    setSelected((prev) =>
      prev.includes(maLoaiHinh) ? prev.filter((id) => id !== maLoaiHinh) : [...prev, maLoaiHinh]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updatePreferences(selected);
      setSuccessMsg('Đã lưu sở thích du lịch thành công!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Không thể cập nhật sở thích');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-xs font-semibold text-sky-700 border border-sky-100 mb-2">
              <Sparkles size={14} className="text-sky-600" />
              <span>{(!user?.soThich || user.soThich.length === 0) ? 'Chào mừng thành viên mới' : 'Cá nhân hóa trải nghiệm'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800">
              {(!user?.soThich || user.soThich.length === 0) ? 'Chọn sở thích du lịch của bạn' : 'Sở thích du lịch của bạn'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {(!user?.soThich || user.soThich.length === 0)
                ? 'Hãy chọn các phong cách du lịch bạn yêu thích để TravelMate ưu tiên gợi ý điểm đến và khách sạn phù hợp nhất. Bạn có thể chọn ngay hoặc cập nhật lại bất kỳ lúc nào.'
                : 'Chọn các phong cách du lịch bạn quan tâm để TravelMate ưu tiên gợi ý phù hợp nhất.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-5 space-y-3 flex-1 pr-1">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categories.map((cat) => {
              const isChecked = selected.includes(cat.maLoaiHinh);
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.maLoaiHinh}
                  type="button"
                  onClick={() => toggleCategory(cat.maLoaiHinh)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    isChecked
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <IconComp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${isChecked ? 'text-sky-900' : 'text-slate-700'}`}>
                        {cat.ten}
                      </span>
                      {isChecked && <Check size={16} className="text-sky-600 shrink-0" />}
                    </div>
                    {cat.desc && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{cat.desc}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {(!user?.soThich || user.soThich.length === 0) ? 'Bỏ qua lúc này' : 'Đóng'}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md disabled:opacity-60 flex items-center gap-2"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu sở thích'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
