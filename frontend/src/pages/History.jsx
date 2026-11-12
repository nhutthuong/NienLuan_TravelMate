import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Camera, 
  UploadCloud, 
  AlertCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  BarChart3,
  X,
  LogIn,
  UserPlus,
  PenLine,
  Edit2,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import api from '../services/api';



const resolveImageUrl = (url, fallbackUrl = '/images/vinh_ha_long.jpg') => {
  if (!url || typeof url !== 'string' || url.trim() === '') return fallbackUrl;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const backendOrigin = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : 'http://localhost:5000';
    return `${backendOrigin}${url}`;
  }
  return url;
};

const History = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [totalLocations, setTotalLocations] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Reset modals and state immediately when user context changes or logs out
    setSelectedItem(null);
    setDeleteConfirmId(null);

    if (!isAuthenticated || !user?.maNguoiDung) {
      setHistoryList([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Fetch dynamic total locations from database
    if (typeof api.locations?.getAll === 'function') {
      api.locations
        .getAll()
        .then((locs) => {
          if (isMounted && Array.isArray(locs) && locs.length > 0) {
            setTotalLocations(locs.length);
          }
        })
        .catch((err) => console.error('Loi khi tai danh sach dia diem:', err));
    }

    const fetchHistory = api.history?.get || api.history?.getAll;
    if (typeof fetchHistory === 'function') {
      fetchHistory({ limit: 100 })
        .then((res) => {
          if (!isMounted) return;
          const list = Array.isArray(res) ? res : (Array.isArray(res?.history) ? res.history : []);

          const mapped = list.map((item) => {
            const locId = item.maDiaDiem || item.madiadiem || 'DD0001';
            const locName = item.tenDiaDiem || item.ten_dia_diem || item.ten || 'Địa danh';
            const locProvince = item.tinhThanh || item.tinhthanh || 'Việt Nam';
            const locDanhHieu = item.danhHieu || item.danhhieu || 'Điểm đến du lịch';
            const locThoiDiem = item.thoiDiemLyTuong || item.thoidiemlytuong || '';
            const locCategories = Array.isArray(item.loaiHinh) && item.loaiHinh.length > 0
              ? item.loaiHinh
              : ['Khám phá', 'Thiên nhiên'];
            const userImage = item.anhTaiLenUrl || item.anh_tailen_url || item.diaDiemAnhUrl || item.dia_diem_anh_url || '';
            const fallbackImage = item.diaDiemAnhUrl || item.dia_diem_anh_url || '/images/vinh_ha_long.jpg';

            const rawTopK = Array.isArray(item.ketQuaTopK) ? item.ketQuaTopK : [];
            const topPredictions = rawTopK.map((p, idx) => {
              const predName = p.locationName || p.ten || p.label || p.name || (idx === 0 ? locName : 'Địa danh');
              const predConf = typeof p.confidence !== 'undefined'
                ? parseFloat(p.confidence)
                : typeof p.score !== 'undefined'
                ? parseFloat((p.score * 100).toFixed(2))
                : (idx === 0 ? parseFloat(item.doTinCay || item.dotincay || 0) : 0);

              return {
                name: predName,
                confidence: isNaN(predConf) ? 0 : predConf,
                maDiaDiem: p.maDiaDiem || null,
              };
            });

            return {
              id: item.maLSTimKiem || item.malstimkiem || item.id,
              userUploadedImage: userImage,
              fallbackImage: fallbackImage,
              analyzedAt: item.searchedAt || item.searched_at || new Date().toISOString(),
              predictedLocation: {
                id: locId,
                name: locName,
                province: locProvince,
                danhHieu: locDanhHieu,
                category: locDanhHieu,
                loaiHinh: locCategories,
                thoiDiemLyTuong: locThoiDiem,
              },
              confidence: parseFloat(item.doTinCay || item.dotincay || 0) || 0,
              aiModel: 'ResNet50 (Transfer Learning)',
              status: 'success',
              topPredictions: topPredictions.length > 0 ? topPredictions : [{ name: locName, confidence: parseFloat(item.doTinCay || 0) || 0 }],
              tags: locCategories,
              notes: item.ghiChu || item.ghichu || '',
            };
          });

          setHistoryList(mapped);
        })
        .catch((err) => {
          console.error('Loi khi tai lich su:', err);
          if (isMounted) {
            setHistoryList([]);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.maNguoiDung]);

  const handleDeleteItem = async (id) => {
    try {
      if (isAuthenticated && typeof api.history?.delete === 'function') {
        await api.history.delete(id);
      }
    } catch (err) {
      console.error('Loi khi xoa muc lich su:', err);
    }
    setHistoryList((prev) => (prev || []).filter((item) => item?.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    setDeleteConfirmId(null);
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử quét nhận diện không?')) {
      try {
        if (isAuthenticated && typeof api.history?.clear === 'function') {
          await api.history.clear();
        }
      } catch (err) {
        console.error('Loi khi xoa tat ca lich su:', err);
      }
      setHistoryList([]);
      setSelectedItem(null);
    }
  };

  const startEditNote = (item) => {
    setEditingNoteId(item.id);
    setNoteInput(item.notes || '');
  };

  const handleSaveNote = async (id, newNote) => {
    setIsSavingNote(true);
    const trimmed = (newNote || '').trim();
    try {
      if (typeof api.history?.updateNote === 'function') {
        await api.history.updateNote(id, trimmed);
      }
      setHistoryList((prev) =>
        (prev || []).map((item) =>
          item.id === id ? { ...item, notes: trimmed } : item
        )
      );
      if (selectedItem?.id === id) {
        setSelectedItem((prev) => (prev ? { ...prev, notes: trimmed } : null));
      }
      setEditingNoteId(null);
      setNoteInput('');
    } catch (err) {
      console.error('Loi khi cap nhat ghi chu:', err);
      alert('Khong the luu ghi chu. Vui long thu lai!');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Ban co muon xoa ghi chu ky niem nay khong?')) {
      await handleSaveNote(id, '');
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Vừa xong';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Vừa xong';
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredList = (historyList || []).filter((item) => {
    if (!item) return false;
    const locName = item.predictedLocation?.name || '';
    const locProv = item.predictedLocation?.province || '';
    const locDanhHieu = item.predictedLocation?.danhHieu || '';
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const notes = item.notes || '';

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = locName.toLowerCase().includes(q);
      const matchProv = locProv.toLowerCase().includes(q);
      const matchDanhHieu = locDanhHieu.toLowerCase().includes(q);
      const matchTags = tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
      const matchNotes = notes.toLowerCase().includes(q);
      if (!matchName && !matchProv && !matchDanhHieu && !matchTags && !matchNotes) return false;
    }

    const now = new Date();
    const itemDate = new Date(item.analyzedAt);
    if (!isNaN(itemDate.getTime())) {
      const diffHours = (now - itemDate) / (1000 * 3600);
      if (timeFilter === '24h' && diffHours > 24) return false;
      if (timeFilter === '7days' && diffHours > 24 * 7) return false;
      if (timeFilter === '30days' && diffHours > 24 * 30) return false;
    }

    const conf = parseFloat(item.confidence) || 0;
    if (confidenceFilter === 'very_high' && conf < 95) return false;
    if (confidenceFilter === 'high' && (conf < 80 || conf >= 95)) return false;
    if (confidenceFilter === 'medium' && (conf < 50 || conf >= 80)) return false;
    if (confidenceFilter === 'low' && conf >= 50) return false;

    return true;
  });

  const totalScans = (historyList || []).length;
  const avgConfidence =
    totalScans > 0
      ? (
          (historyList || []).reduce(
            (acc, curr) => acc + (parseFloat(curr?.confidence) || 0),
            0
          ) / totalScans
        ).toFixed(1)
      : '0.0';


  const uniqueLocationsCount = new Set(
    (historyList || [])
      .map((item) => item.predictedLocation?.id || item.predictedLocation?.name)
      .filter(Boolean)
  ).size;

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* Top Banner / Hero Header */}
        <section className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 text-white pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-sky-100 text-xs font-semibold uppercase tracking-wider mb-3 border border-white/20">
                <Sparkles size={14} className="text-amber-300" />
                <span>Nhật ký thị giác máy tính ResNet50</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                Lịch Sử Nhận Diện AI
              </h1>
              <p className="mt-3 text-sky-100 text-base md:text-lg max-w-2xl leading-relaxed">
                Xem lại các hình ảnh bạn đã tải lên, xác suất tin cậy phân loại từ mô hình Deep Learning và khám phá ngay thông tin địa danh cùng dịch vụ lưu trú.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm">
            <div className="w-20 h-20 bg-sky-50 border border-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Camera size={38} className="text-primary" />
            </div>

            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-3">
              Bạn chưa đăng nhập tài khoản
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Vui lòng đăng nhập để xem lại lịch sử quét hình ảnh và kết quả nhận diện phong cảnh từ mô hình AI ResNet50 được lưu trong tài khoản của bạn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <LogIn size={18} />
                <span>Đăng nhập ngay</span>
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-8 py-3 rounded-xl border border-slate-200 transition-all"
              >
                <UserPlus size={18} />
                <span>Tạo tài khoản mới</span>
              </Link>
            </div>

            <div className="text-sm text-slate-500 mb-8">
              Hoặc bạn muốn trải nghiệm nhận diện nhanh không cần lưu lại?{' '}
              <Link to="/" className="text-primary font-semibold hover:underline">
                Thử nhận diện ảnh tại Trang chủ &rarr;
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-primary flex items-center justify-center font-bold text-sm mb-2">
                  <CheckCircle2 size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Mô hình AI ResNet50</h4>
                <p className="text-xs text-slate-500">Phân loại chính xác 10 địa danh biểu tượng của Việt Nam bằng Deep Learning.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
                  <CheckCircle2 size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Phân tích Top-3 Softmax</h4>
                <p className="text-xs text-slate-500">Xem xác suất tin cậy và so sánh đối chiếu giữa các điểm đến tương đồng.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm mb-2">
                  <CheckCircle2 size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Lưu trữ đám mây</h4>
                <p className="text-xs text-slate-500">Nhật ký quét được bảo mật và liên kết trực tiếp vào hồ sơ cá nhân.</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Top Banner / Hero Header */}
      <section className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 text-white pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-sky-100 text-xs font-semibold uppercase tracking-wider mb-3 border border-white/20">
                <Sparkles size={14} className="text-amber-300" />
                <span>Nhật ký thị giác máy tính ResNet50</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                Lịch Sử Nhận Diện AI
              </h1>
              <p className="mt-3 text-sky-100 text-base md:text-lg max-w-2xl leading-relaxed">
                Xem lại các hình ảnh bạn đã tải lên, xác suất tin cậy phân loại từ mô hình Deep Learning và khám phá ngay thông tin địa danh cùng dịch vụ lưu trú.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-lg">
              <div className="px-3 border-r border-white/20 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-white font-heading">{totalScans}</div>
                <div className="text-xs text-sky-100 font-medium">Lượt quét</div>
              </div>
              <div className="px-3 border-r border-white/20 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-white font-heading">{avgConfidence}%</div>
                <div className="text-xs text-sky-100 font-medium">Độ tin cậy TB</div>
              </div>
              <div className="px-3 text-center" title={`Đã khám phá ${uniqueLocationsCount} trên ${totalLocations} địa danh AI hỗ trợ`}>
                <div className="inline-flex items-center gap-1 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 size={16} />
                  <span>{uniqueLocationsCount}/{totalLocations}</span>
                </div>
                <div className="text-xs text-sky-100 font-medium">Đã khám phá</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Controls: Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-8 transition-all hover:shadow-md">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên địa danh, tỉnh thành hoặc thẻ nhận diện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-200"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Time filter */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm">
                <Calendar size={16} className="text-primary" />
                <span className="text-slate-500 text-xs font-semibold">Thời gian:</span>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium text-sm focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="24h">24 giờ qua</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                </select>
              </div>

              {/* Confidence filter */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm">
                <BarChart3 size={16} className="text-primary" />
                <span className="text-slate-500 text-xs font-semibold">Độ tin cậy:</span>
                <select
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium text-sm focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="very_high">Rất cao (≥ 95%)</option>
                  <option value="high">Cao (80% - 95%)</option>
                  <option value="medium">Trung bình (50% - 80%)</option>
                  <option value="low">Độ tin cậy thấp (&lt; 50%)</option>
                </select>
              </div>

              {/* Clear All button */}
              {(historyList || []).length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors ml-auto lg:ml-0"
                  title="Xóa toàn bộ lịch sử quét"
                >
                  <Trash2 size={16} />
                  <span>Xóa hết</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results counter / Active filters banner */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm font-medium text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">{filteredList.length}</span> kết quả nhận diện
          </p>
          {(searchQuery || timeFilter !== 'all' || confidenceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTimeFilter('all');
                setConfidenceFilter('all');
              }}
              className="text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* History Items Grid / List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Đang tải lịch sử nhận diện của bạn...</p>
          </div>
        ) : filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => {
              const locId = item.predictedLocation?.id || 'DD0001';
              const locName = item.predictedLocation?.name || 'Địa danh';
              const locProvince = item.predictedLocation?.province || 'Việt Nam';
              const locDanhHieu = item.predictedLocation?.danhHieu || 'Điểm đến du lịch';
              const itemCategories = (Array.isArray(item.tags) && item.tags.length > 0)
                ? item.tags
                : ['Thiên nhiên', 'Khám phá'];
              const locThoiDiem = item.predictedLocation?.thoiDiemLyTuong || '';
              const itemConfidence = parseFloat(item.confidence) || 0;
              const isLowConfidence = itemConfidence < 50;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Image & Overlay Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={resolveImageUrl(item.userUploadedImage, item.fallbackImage)}
                      alt={locName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (item.fallbackImage && e.currentTarget.src !== resolveImageUrl(item.fallbackImage)) {
                          e.currentTarget.src = resolveImageUrl(item.fallbackImage);
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Confidence Badge */}
                    {isLowConfidence ? (
                      <div className="absolute top-3 left-3 bg-amber-50/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-800 shadow-md flex items-center gap-1.5 border border-amber-300">
                        <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                        <span>Độ tin cậy thấp: {itemConfidence}%</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-700 shadow-md flex items-center gap-1.5 border border-sky-100">
                        <Sparkles size={13} className="text-sky-500 shrink-0" />
                        <span>Độ tin cậy: {itemConfidence}%</span>
                      </div>
                    )}

                    {/* Action Delete Single Item */}
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-rose-500 text-slate-600 hover:text-white rounded-full backdrop-blur-md transition-all shadow-md"
                      title="Xóa mục này"
                    >
                      <Trash2 size={15} />
                    </button>

                    {/* Quick Inspect Button on Hover */}
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition-all shadow opacity-90 hover:opacity-100"
                    >
                      <Eye size={14} />
                      <span>Chi tiết AI</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Danh hiệu CSDL & Tỉnh thành */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 gap-2">
                        <span 
                          className="font-semibold text-primary uppercase tracking-wider text-[11px] truncate max-w-[200px]"
                          title={locDanhHieu}
                        >
                          {locDanhHieu}
                        </span>
                        <span className="font-medium text-slate-500 shrink-0">
                          {locProvince}
                        </span>
                      </div>

                      {/* Location Name */}
                      <h3 className="text-xl font-bold font-heading text-slate-800 hover:text-primary transition-colors mb-2">
                        <Link to={`/location/${locId}`}>
                          {locName}
                        </Link>
                      </h3>

                      {/* Loại hình du lịch thực tế từ CSDL */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {itemCategories.slice(0, 3).map((category, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100/80"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      {/* Thời điểm lý tưởng từ CSDL */}
                      {locThoiDiem && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          <Calendar size={13} className="text-primary shrink-0" />
                          <span className="truncate">
                            Mùa lý tưởng: <strong className="text-slate-700 font-medium">{locThoiDiem}</strong>
                          </span>
                        </div>
                      )}

                      {/* Ghi chú kỷ niệm */}
                      {item.notes ? (
                        <div className="mb-3.5 px-3 py-2 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start justify-between gap-2 group/note">
                          <div className="flex items-start gap-1.5 flex-1 min-w-0">
                            <PenLine size={13} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <span className="font-semibold text-[10px] uppercase tracking-wider text-amber-700 block">Kỷ niệm chuyến đi:</span>
                              <p className="line-clamp-2 italic text-slate-700 leading-relaxed text-xs">{item.notes}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              startEditNote(item);
                            }}
                            className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100/70 rounded transition-colors opacity-70 group-hover/note:opacity-100 shrink-0"
                            title="Sửa ghi chú"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="mb-3.5">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              startEditNote(item);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-sky-50 border border-dashed border-slate-200 w-full justify-center"
                          >
                            <PenLine size={12} />
                            <span>Ghi lại kỷ niệm bức ảnh...</span>
                          </button>
                        </div>
                      )}

                      {/* AI Confidence Progress Bar */}
                      <div className={`p-3 rounded-xl border mb-4 ${isLowConfidence ? 'bg-amber-50/40 border-amber-200/80' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-500 font-medium">
                            {isLowConfidence ? 'Độ khớp nhận diện (thấp)' : 'Độ khớp nhận diện'}
                          </span>
                          <span className={`font-semibold ${isLowConfidence ? 'text-amber-700' : 'text-primary'}`}>
                            {itemConfidence}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLowConfidence 
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                                : 'bg-gradient-to-r from-sky-500 to-primary'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, itemConfidence))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>{formatTimeAgo(item.analyzedAt)}</span>
                      </div>

                      <Link
                        to={`/location/${locId}`}
                        className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow"
                      >
                        <span>Xem điểm đến</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-20 h-20 bg-sky-50 text-primary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Camera size={38} className="text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-2">
              Chưa tìm thấy lịch sử nhận diện
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              {searchQuery || timeFilter !== 'all' || confidenceFilter !== 'all'
                ? 'Không có ảnh nào khớp với bộ lọc tìm kiếm hiện tại. Hãy thử chọn khoảng thời gian khác hoặc đặt lại bộ lọc.'
                : 'Bạn chưa thực hiện quét nhận diện hình ảnh nào. Hãy tải lên ảnh phong cảnh du lịch của bạn để ResNet50 bóc tách địa danh ngay nhé!'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {searchQuery || timeFilter !== 'all' || confidenceFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTimeFilter('all');
                    setConfidenceFilter('all');
                  }}
                  className="btn-primary flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                >
                  <RefreshCw size={16} />
                  <span>Xóa bộ lọc</span>
                </button>
              ) : (
                <Link
                  to="/"
                  className="btn-primary flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                >
                  <UploadCloud size={18} />
                  <span>Tải ảnh nhận diện ngay</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Feature Highlights Banner */}
        <div className="mt-16 bg-gradient-to-r from-sky-50 via-sky-100/60 to-cyan-50 rounded-2xl p-6 md:p-8 border border-sky-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl text-primary shadow-sm mt-1">
              <Sparkles size={26} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-800">
                Tính năng lưu trữ dành cho Thành viên (Member)
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Các ảnh phong cảnh đã quét và dự đoán được tự động lưu trữ an toàn trong hồ sơ cá nhân. Bạn có thể tra cứu nhanh khách sạn nghỉ dưỡng và các điểm check-in liên quan bất cứ lúc nào.
              </p>
            </div>
          </div>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-primary font-semibold text-sm border border-sky-300 shadow-sm transition-all whitespace-nowrap"
          >
            Khám phá 10 địa danh
          </Link>
        </div>
      </main>

      {/* MODAL: Chi tiết AI ResNet50 & Top-K Probability */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-50 text-primary rounded-xl">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 font-heading">
                    Báo Cáo Phân Tích AI ResNet50
                  </h3>
                  <p className="text-xs text-slate-500">Mã lượt quét: {selectedItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {(() => {
                const selectedConf = parseFloat(selectedItem.confidence) || 0;
                const isModalLowConfidence = selectedConf < 50;

                return (
                  <>
                    {/* Image Preview & Overview */}
                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <img
                        src={resolveImageUrl(selectedItem.userUploadedImage, selectedItem.fallbackImage)}
                        alt={selectedItem.predictedLocation?.name || 'Địa danh'}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (selectedItem.fallbackImage && e.currentTarget.src !== resolveImageUrl(selectedItem.fallbackImage)) {
                            e.currentTarget.src = resolveImageUrl(selectedItem.fallbackImage);
                          }
                        }}
                        className="w-full sm:w-44 h-36 rounded-xl object-cover shadow-sm border border-white"
                      />
                      <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                        {isModalLowConfidence ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                            <span>Cảnh báo: Độ tin cậy thấp ({selectedConf}%)</span>
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                            Dự đoán hàng đầu
                          </span>
                        )}
                        <h4 className="text-2xl font-bold font-heading text-slate-800">
                          {selectedItem.predictedLocation?.name || 'Địa danh'}
                        </h4>
                        <p className="text-sm text-slate-600 font-medium">
                          {selectedItem.predictedLocation?.province || 'Việt Nam'} • {selectedItem.predictedLocation?.danhHieu || selectedItem.predictedLocation?.category || 'Điểm đến du lịch'}
                        </p>
                        <div className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                          <Clock size={13} />
                          <span>Đã quét: {new Date(selectedItem.analyzedAt || Date.now()).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cảnh báo độ tin cậy thấp */}
                    {isModalLowConfidence && (
                      <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
                        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-800 text-sm">Độ tin cậy dưới ngưỡng khuyến nghị (50%)</p>
                          <p className="text-amber-700 mt-1">
                            Mô hình AI chỉ đạt độ khớp {selectedConf}%. Ảnh tải lên có thể không nằm trong 10 địa danh mẫu tại Việt Nam, hoặc hình ảnh có góc chụp bị khuất, thiếu sáng. Bạn có thể tham khảo thêm các địa danh khác trong Top-3 bên dưới.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Top-K Probability Breakdown */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BarChart3 size={16} className="text-primary" />
                        <span>Phân Bố Xác Suất Top-3 (Softmax Probability)</span>
                      </h4>
                      <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                        {(selectedItem.topPredictions || []).map((pred, idx) => {
                          const predConf = parseFloat(pred?.confidence) || 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className={idx === 0 ? (isModalLowConfidence ? 'text-amber-800 font-bold' : 'text-primary font-bold') : 'text-slate-600'}>
                                  #{idx + 1} {pred?.name || 'Địa danh'}
                                </span>
                                <span className={idx === 0 ? (isModalLowConfidence ? 'text-amber-800 font-bold' : 'text-primary font-bold') : 'text-slate-600'}>
                                  {predConf}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    idx === 0
                                      ? isModalLowConfidence
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                        : 'bg-gradient-to-r from-sky-500 to-primary'
                                      : 'bg-slate-400'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(0, predConf))}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}



              {/* Ghi chú & Kỷ niệm chuyến đi */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <PenLine size={16} className="text-amber-700" />
                    <span>Ghi chú & Kỷ niệm chuyến đi</span>
                  </div>
                  {editingNoteId !== selectedItem.id && (
                    <button
                      onClick={() => startEditNote(selectedItem)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 hover:underline"
                    >
                      <Edit2 size={12} />
                      <span>{selectedItem.notes ? 'Chỉnh sửa' : 'Thêm ghi chú'}</span>
                    </button>
                  )}
                </div>

                {editingNoteId === selectedItem.id ? (
                  <div className="space-y-3 mt-2">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Ghi lại cảm xúc, kỷ niệm của bức ảnh này (VD: Chụp lúc bình minh tại hồ, chuyến đi cùng gia đình, ăn đặc sản...)"
                      rows={3}
                      className="w-full p-3 rounded-xl border border-amber-300 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all leading-relaxed"
                    />
                    <div className="flex items-center justify-between gap-2">
                      {selectedItem.notes ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(selectedItem.id)}
                          disabled={isSavingNote}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
                        >
                          Xóa ghi chú
                        </button>
                      ) : <span />}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(null);
                            setNoteInput('');
                          }}
                          disabled={isSavingNote}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNote(selectedItem.id, noteInput)}
                          disabled={isSavingNote}
                          className="btn-primary text-xs py-1.5 px-3.5 inline-flex items-center gap-1 rounded-lg shadow-sm"
                        >
                          <Check size={13} />
                          <span>{isSavingNote ? 'Đang lưu...' : 'Lưu ghi chú'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {selectedItem.notes ? (
                      <p className="text-slate-700 italic leading-relaxed text-xs bg-white/90 p-3 rounded-xl border border-amber-200/60">
                        &ldquo;{selectedItem.notes}&rdquo;
                      </p>
                    ) : (
                      <p className="text-slate-400 italic">
                        Chưa có ghi chú nào cho bức ảnh này. Nhấn &quot;Thêm ghi chú&quot; để lưu lại những kỷ niệm đáng nhớ của bạn.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl flex justify-between items-center">
              <button
                onClick={() => setDeleteConfirmId(selectedItem.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Xóa kết quả này</span>
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Đóng
                </button>
                <Link
                  to={`/location/${selectedItem.predictedLocation?.id || 1}`}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  <span>Xem chi tiết địa danh</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xác nhận xóa 1 mục */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Xóa mục lịch sử này?</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Hành động này sẽ xóa vĩnh viễn hình ảnh và kết quả nhận diện đã lưu khỏi tài khoản của bạn.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default History;
