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
  Eye,
  RefreshCw,
  BarChart3,
  X,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import api from '../services/api';

const LOCATION_FALLBACK_IMAGES = {
  DD0001: '/images/cho_noi.jpg',
  DD0002: '/images/ho_xuan_huong.jpg',
  DD0003: '/images/cau_vang.jpg',
  DD0004: '/images/ho_hoan_kiem.jpg',
  DD0005: '/images/hoi_an.jpg',
  DD0006: '/images/trang_an.jpg',
  DD0007: '/images/mui_ne.jpg',
  DD0008: '/images/phu_quoc.jpg',
  DD0009: '/images/fansipan.jpg',
  DD0010: '/images/vinh_ha_long.jpg',
  1: '/images/vinh_ha_long.jpg',
  2: '/images/trang_an.jpg',
  3: '/images/cau_vang.jpg',
  4: '/images/hoi_an.jpg',
  5: '/images/fansipan.jpg',
  6: '/images/cho_noi.jpg',
  7: '/images/phu_quoc.jpg',
  8: '/images/ho_xuan_huong.jpg',
  9: '/images/mui_ne.jpg',
  10: '/images/ho_hoan_kiem.jpg',
};

const resolveImageUrl = (url, locationId) => {
  const fallback = (locationId && LOCATION_FALLBACK_IMAGES[locationId]) || '/images/vinh_ha_long.jpg';
  if (!url || typeof url !== 'string' || url.trim() === '') return fallback;
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

const INITIAL_HISTORY = [
  {
    id: 'hist-001',
    userUploadedImage: '/images/vinh_ha_long.jpg',
    analyzedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    predictedLocation: {
      id: 1,
      name: 'Vịnh Hạ Long',
      province: 'Quảng Ninh',
      category: 'Kỳ quan thiên nhiên thế giới'
    },
    confidence: 99.4,
    aiModel: 'ResNet50 (Transfer Learning)',
    status: 'success',
    topPredictions: [
      { name: 'Vịnh Hạ Long', confidence: 99.4 },
      { name: 'Tràng An', confidence: 0.4 },
      { name: 'Phú Quốc', confidence: 0.1 }
    ],
    tags: ['Di sản UNESCO', 'Đảo đá vôi', 'Biển đảo'],
    notes: 'Ảnh chụp từ trên du thuyền vịnh Hạ Long trong chuyến đi công tác.'
  },
  {
    id: 'hist-002',
    userUploadedImage: '/images/trang_an.jpg',
    analyzedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    predictedLocation: {
      id: 2,
      name: 'Tràng An',
      province: 'Ninh Bình',
      category: 'Di sản thế giới kép'
    },
    confidence: 98.7,
    aiModel: 'ResNet50 (Transfer Learning)',
    status: 'success',
    topPredictions: [
      { name: 'Tràng An', confidence: 98.7 },
      { name: 'Vịnh Hạ Long', confidence: 0.9 },
      { name: 'Hồ Hoàn Kiếm', confidence: 0.2 }
    ],
    tags: ['Sinh thái sông nước', 'Thuyền nan', 'Núi non'],
    notes: 'Chèo thuyền tham quan hang Sáng - hang Tối.'
  },
  {
    id: 'hist-003',
    userUploadedImage: '/images/cau_vang.jpg',
    analyzedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    predictedLocation: {
      id: 4,
      name: 'Cầu Vàng',
      province: 'Đà Nẵng',
      category: 'Điểm nhấn kiến trúc'
    },
    confidence: 97.8,
    aiModel: 'ResNet50 (Transfer Learning)',
    status: 'success',
    topPredictions: [
      { name: 'Cầu Vàng', confidence: 97.8 },
      { name: 'Đỉnh Fansipan', confidence: 1.5 },
      { name: 'Phố Cổ Hội An', confidence: 0.4 }
    ],
    tags: ['Bà Nà Hills', 'Bàn tay khổng lồ', 'Sương mù'],
    notes: 'Check-in lúc sáng sớm trước khi đông khách.'
  },
  {
    id: 'hist-004',
    userUploadedImage: '/images/hoi_an.jpg',
    analyzedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    predictedLocation: {
      id: 3,
      name: 'Phố Cổ Hội An',
      province: 'Quảng Nam',
      category: 'Di sản văn hóa thế giới'
    },
    confidence: 99.1,
    aiModel: 'ResNet50 (Transfer Learning)',
    status: 'success',
    topPredictions: [
      { name: 'Phố Cổ Hội An', confidence: 99.1 },
      { name: 'Hồ Hoàn Kiếm', confidence: 0.6 },
      { name: 'Chợ Nổi Cái Răng', confidence: 0.2 }
    ],
    tags: ['Phố cổ đèn lồng', 'Sông Hoài', 'Văn hóa cổ kính'],
    notes: 'Ảnh chụp đèn lồng rực rỡ buổi tối bên bờ sông Hoài.'
  },
  {
    id: 'hist-005',
    userUploadedImage: '/images/fansipan.jpg',
    analyzedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    predictedLocation: {
      id: 5,
      name: 'Đỉnh Fansipan',
      province: 'Sapa, Lào Cai',
      category: 'Khám phá mạo hiểm'
    },
    confidence: 96.5,
    aiModel: 'ResNet50 (Transfer Learning)',
    status: 'success',
    topPredictions: [
      { name: 'Đỉnh Fansipan', confidence: 96.5 },
      { name: 'Cầu Vàng', confidence: 2.3 },
      { name: 'Hồ Xuân Hương', confidence: 0.8 }
    ],
    tags: ['Nóc nhà Đông Dương', 'Cột mốc 3143m', 'Biển mây'],
    notes: 'Săn mây thành công ở độ cao 3.143 mét.'
  },
  {
    id: 'hist-006',
    userUploadedImage: '/images/cho_noi.jpg',
    analyzedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    predictedLocation: {
      id: 6,
      name: 'Chợ Nổi Cái Răng',
      province: 'Cần Thơ',
      category: 'Văn hóa miền Tây'
    },
    confidence: 95.9,
    aiModel: 'ResNet50 (Transfer Learning)',
    status: 'success',
    topPredictions: [
      { name: 'Chợ Nổi Cái Răng', confidence: 95.9 },
      { name: 'Phú Quốc', confidence: 2.8 },
      { name: 'Tràng An', confidence: 0.9 }
    ],
    tags: ['Sông Tiền - Sông Hậu', 'Cây Bẹo', 'Ẩm thực ghe thuyền'],
    notes: 'Ăn hủ tiếu tô trên ghe lúc 6h sáng.'
  }
];

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated) {
      const fetchHistory = api.history?.get || api.history?.getAll;
      if (typeof fetchHistory === 'function') {
        fetchHistory()
          .then((res) => {
            if (!isMounted || !Array.isArray(res) || res.length === 0) return;

            const mapped = res.map((item) => {
              const topPreds = Array.isArray(item.ketQuaTopK)
                ? item.ketQuaTopK.map((p) => ({
                    name: p.name || p.label || p.tenDiaDiem || 'Địa danh',
                    confidence: parseFloat(p.confidence || (p.score ? (p.score * 100).toFixed(1) : 0)) || 0,
                  }))
                : Array.isArray(item.topPredictions)
                ? item.topPredictions
                : [
                    {
                      name: item.tenDiaDiem || 'Địa danh',
                      confidence: parseFloat(item.doTinCay || 98.5) || 98.5,
                    },
                  ];

              const targetLocId = item.maDiaDiem || item.predictedLocation?.id || 1;
              const fallbackImage = (targetLocId && LOCATION_FALLBACK_IMAGES[targetLocId]) || '/images/vinh_ha_long.jpg';
              const rawImage = item.anhTaiLenUrl || item.diaDiemAnhUrl || item.anhDauVao || item.userUploadedImage || fallbackImage;

              return {
                id: item.maLSTimKiem || item.maLichSu || item.id || `hist-${Math.random()}`,
                userUploadedImage: resolveImageUrl(rawImage, targetLocId),
                analyzedAt:
                  item.searchedAt || item.thoiGianQuet || item.analyzedAt || new Date().toISOString(),
                predictedLocation: {
                  id: targetLocId,
                  name: item.tenDiaDiem || item.predictedLocation?.name || 'Vịnh Hạ Long',
                  province: item.tinhThanh || item.predictedLocation?.province || 'Quảng Ninh',
                  category: item.theLoai || item.predictedLocation?.category || 'Kỳ quan thiên nhiên',
                },
                confidence: parseFloat(item.doTinCay || item.confidence || 98.5) || 98.5,
                aiModel: item.moHinh || item.aiModel || 'ResNet50 (Transfer Learning)',
                status: 'success',
                topPredictions: topPreds,
                tags: Array.isArray(item.tags) ? item.tags : ['Thị giác máy tính', 'ResNet50'],
                notes: item.ghiChu || item.notes || '',
              };
            });

            setHistoryList(mapped);
          })
          .catch((err) => {
            console.error('Loi khi tai lich su:', err);
            // Retain default mock history on error
          });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
    const tags = Array.isArray(item.tags) ? item.tags : [];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = locName.toLowerCase().includes(q);
      const matchProv = locProv.toLowerCase().includes(q);
      const matchTags = tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
      if (!matchName && !matchProv && !matchTags) return false;
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
    if (confidenceFilter === 'high' && conf < 98) return false;
    if (confidenceFilter === 'medium' && (conf < 95 || conf >= 98)) return false;

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
              <div className="px-3 text-center">
                <div className="inline-flex items-center gap-1 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 size={16} />
                  <span>10/10</span>
                </div>
                <div className="text-xs text-sky-100 font-medium">Địa danh</div>
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
                  <option value="high">Rất cao (&gt; 98%)</option>
                  <option value="medium">Chuẩn (95% - 98%)</option>
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
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => {
              const locId = item.predictedLocation?.id || 1;
              const locName = item.predictedLocation?.name || 'Địa danh';
              const locCategory = item.predictedLocation?.category || 'Kỳ quan thiên nhiên';
              const locProvince = item.predictedLocation?.province || 'Việt Nam';
              const itemTags = Array.isArray(item.tags) ? item.tags : [];
              const itemConfidence = parseFloat(item.confidence) || 98.5;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Image & Overlay Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={resolveImageUrl(item.userUploadedImage, locId)}
                      alt={locName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = LOCATION_FALLBACK_IMAGES[locId] || '/images/vinh_ha_long.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Confidence Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-700 shadow-md flex items-center gap-1.5 border border-sky-100">
                      <Sparkles size={13} className="text-sky-500" />
                      <span>Độ tin cậy: {itemConfidence}%</span>
                    </div>

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

                    {/* Timestamp Tag */}
                    <div className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow flex items-center gap-1">
                      <Clock size={12} className="text-sky-300" />
                      <span>{formatTimeAgo(item.analyzedAt)}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Province */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-primary uppercase tracking-wider">
                          {locCategory}
                        </span>
                        <span>{locProvince}</span>
                      </div>

                      {/* Location Name */}
                      <h3 className="text-xl font-bold font-heading text-slate-800 hover:text-primary transition-colors mb-2">
                        <Link to={`/location/${locId}`}>
                          {locName}
                        </Link>
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {itemTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-medium border border-sky-100"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* AI Confidence Progress Bar */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-500 font-medium">Mô hình phân loại</span>
                          <span className="font-semibold text-slate-700">ResNet50</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, itemConfidence))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-xs font-semibold text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <BarChart3 size={14} />
                        <span>Xác suất Top-3</span>
                      </button>

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
              {/* Image Preview & Overview */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img
                  src={resolveImageUrl(selectedItem.userUploadedImage, selectedItem.predictedLocation?.id)}
                  alt={selectedItem.predictedLocation?.name || 'Địa danh'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const locId = selectedItem.predictedLocation?.id;
                    e.currentTarget.src = (locId && LOCATION_FALLBACK_IMAGES[locId]) || '/images/vinh_ha_long.jpg';
                  }}
                  className="w-full sm:w-44 h-36 rounded-xl object-cover shadow-sm border border-white"
                />
                <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                    Dự đoán hàng đầu
                  </span>
                  <h4 className="text-2xl font-bold font-heading text-slate-800">
                    {selectedItem.predictedLocation?.name || 'Địa danh'}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedItem.predictedLocation?.province || 'Việt Nam'} • {selectedItem.predictedLocation?.category || 'Kỳ quan thiên nhiên'}
                  </p>
                  <div className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <Clock size={13} />
                    <span>Đã quét: {new Date(selectedItem.analyzedAt || Date.now()).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>

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
                          <span className={idx === 0 ? 'text-primary font-bold' : 'text-slate-600'}>
                            #{idx + 1} {pred?.name || 'Địa danh'}
                          </span>
                          <span className={idx === 0 ? 'text-primary font-bold' : 'text-slate-600'}>
                            {predConf}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0 ? 'bg-gradient-to-r from-sky-500 to-primary' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, predConf))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technical Information */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block mb-1">Mạng nơ-ron:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.aiModel || 'ResNet50 (Transfer Learning)'}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block mb-1">Kích thước ảnh đầu vào:</span>
                  <span className="font-semibold text-slate-800">224 × 224 pixels (RGB)</span>
                </div>
              </div>

              {/* Note / Caption */}
              {selectedItem.notes && (
                <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-1">Ghi chú chuyến đi:</span>
                  {selectedItem.notes}
                </div>
              )}
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
