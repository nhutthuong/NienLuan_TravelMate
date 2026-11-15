import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import {
  INITIAL_DESTINATIONS,
  INITIAL_SERVICES,
  INITIAL_CHECKIN_SPOTS,
  INITIAL_USERS,
  INITIAL_REVIEWS
} from '../components/admin/adminMockData';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminMetrics from '../components/admin/AdminMetrics';
import DestinationsTab from '../components/admin/DestinationsTab';
import DestinationModal from '../components/admin/DestinationModal';
import CheckInSpotsTab from '../components/admin/CheckInSpotsTab';
import CheckInSpotModal from '../components/admin/CheckInSpotModal';
import ServicesTab from '../components/admin/ServicesTab';
import ServiceModal from '../components/admin/ServiceModal';
import ReviewsTab from '../components/admin/ReviewsTab';
import UsersTab from '../components/admin/UsersTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import api from '../services/api';

const Admin = () => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations', 'checkins', 'services', 'reviews', 'users', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data States
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [checkInSpots, setCheckInSpots] = useState(INITIAL_CHECKIN_SPOTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [stats, setStats] = useState(null);

  // Modals & Form States: Địa danh
  const [editingDestination, setEditingDestination] = useState(null);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [isSavingDest, setIsSavingDest] = useState(false);
  const [destForm, setDestForm] = useState({
    id: '',
    name: '',
    province: '',
    danhHieu: '',
    moTa: '',
    viDo: '',
    kinhDo: '',
    quyMo: '',
    thoiDiemLyTuong: '',
    image: '/images/vinh_ha_long.jpg',
    maLoaiHinhList: ['LH0001'],
    categories: ['Thiên nhiên'],
  });

  // Modals & Form States: Điểm Check-in con
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState([]);
  const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const [isDeletingCheckIn, setIsDeletingCheckIn] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    id: '',
    name: '',
    locationId: 'DD0001',
    desc: '',
    diemNoiBat: '',
    diaChi: '',
    viDo: '',
    kinhDo: '',
    ticketPrice: 'Miễn phí',
    bestTime: '08:00 – 17:00',
    image: '/images/vinh_ha_long.jpg',
    imageFile: null,
    imagePreview: null,
    maLoaiHinhList: ['LH0001'],
    hoatDongList: [],
  });

  // Modals & Form States: Khách sạn / Dịch vụ
  const [editingService, setEditingService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    locationId: 1,
    tags: ['Nghỉ dưỡng'],
    price: '',
    rating: 4.8,
    image: '',
    coreAmenities: '',
    affiliateUrl: ''
  });

  // ================= NẠP DỮ LIỆU TỪ BACKEND API =================
  useEffect(() => {
    let isMounted = true;

    // 0. Tải danh mục loại hình du lịch và danh mục hoạt động
    if (typeof api.locations?.getCategories === 'function') {
      api.locations.getCategories()
        .then((cats) => {
          if (isMounted && Array.isArray(cats)) {
            setAllCategories(cats);
          }
        })
        .catch(() => {});
    }
    if (typeof api.locations?.getActivities === 'function') {
      api.locations.getActivities()
        .then((acts) => {
          if (isMounted && Array.isArray(acts)) {
            setAllActivities(acts);
          }
        })
        .catch(() => {});
    }

    // 1. Tải danh sách địa danh
    api.locations.getAll()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((loc) => ({
          id: loc.maDiaDiem || loc.id,
          name: loc.ten || loc.tenDiaDiem || loc.name,
          province: loc.tinhThanh || loc.location || '',
          danhHieu: loc.danhHieu || '',
          moTa: loc.moTa || loc.desc || '',
          viDo: loc.viDo !== undefined && loc.viDo !== null ? loc.viDo : '',
          kinhDo: loc.kinhDo !== undefined && loc.kinhDo !== null ? loc.kinhDo : '',
          quyMo: loc.quyMo || '',
          thoiDiemLyTuong: loc.thoiDiemLyTuong || '',
          image: loc.anhUrl || loc.anh_url || loc.hinhAnh || loc.image || '/images/vinh_ha_long.jpg',
          categories: Array.isArray(loc.loaiHinh) ? loc.loaiHinh : [],
          maLoaiHinhList: Array.isArray(loc.maLoaiHinh) ? loc.maLoaiHinh : [],
          category: (Array.isArray(loc.loaiHinh) && loc.loaiHinh[0]) || loc.theLoai || loc.category || 'Thiên nhiên',
          totalHotels: loc.totalHotels || 0,
          totalAttractions: loc.totalAttractions || 0,
          status: 'Active',
        }));
        setDestinations(mapped);
      })
      .catch(() => {});

    // 2. Tải danh sách điểm tham quan con
    api.attractions.getAll()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((att) => ({
          id: att.maDiemTQ || att.id,
          name: att.ten || att.name,
          locationId: att.maDiaDiem || att.locationId,
          locationName: att.tenDiaDiem || '',
          desc: att.moTa || att.desc || '',
          diemNoiBat: att.diemNoiBat || '',
          diaChi: att.diaChi || '',
          viDo: att.viDo !== undefined && att.viDo !== null ? att.viDo : '',
          kinhDo: att.kinhDo !== undefined && att.kinhDo !== null ? att.kinhDo : '',
          image: att.anhDaiDien || att.hinhAnh || att.image || '/images/vinh_ha_long.jpg',
          ticketPrice: att.giaVe || att.ticketPrice || 'Miễn phí',
          bestTime: att.gioMoCua || att.bestTime || '08:00 – 17:00',
          loaiHinh: Array.isArray(att.loaiHinh) ? att.loaiHinh : [],
          maLoaiHinhList: Array.isArray(att.maLoaiHinh) ? att.maLoaiHinh : [],
          hoatDongList: Array.isArray(att.hoatDong) ? att.hoatDong : [],
        }));
        setCheckInSpots(mapped);
      })
      .catch(() => {});

    // 3. Tải danh sách khách sạn / dịch vụ
    api.hotels.getAll()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((hotel) => ({
          id: hotel.maKhachSan || hotel.id,
          name: hotel.ten || hotel.name,
          locationId: hotel.maDiaDiem || hotel.locationId,
          locationName: hotel.tenDiaDiem || '',
          tags: Array.isArray(hotel.loaiHinh) && hotel.loaiHinh.length > 0 ? hotel.loaiHinh : ['Nghỉ dưỡng'],
          price: hotel.giaThamKhao ? new Intl.NumberFormat('vi-VN').format(hotel.giaThamKhao) + 'đ' : (hotel.price || '1.500.000đ'),
          rating: parseFloat(hotel.diemDanhGia || hotel.soSao || hotel.rating || 4.8),
          image: hotel.anhDaiDien || hotel.hinhAnh || hotel.image || '/images/mui_ne.jpg',
          coreAmenities: Array.isArray(hotel.tienNghi) && hotel.tienNghi.length > 0 ? hotel.tienNghi : ['Hồ bơi ngoài trời', 'Spa thư giãn'],
          affiliateUrl: hotel.bookingUrl || hotel.affiliateUrl || 'https://www.agoda.com',
          status: 'Active',
        }));
        setServices(mapped);
      })
      .catch(() => {});

    // 4. Tải danh sách đánh giá & bình luận kiểm duyệt
    api.admin.getReviews()
      .then((res) => {
        if (!isMounted || !res) return;
        const list = res.data || (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          const mapped = list.map((r) => ({
            id: r.id,
            targetType: r.targetType || r.target_type || 'hotel',
            targetId: r.targetId || r.target_id,
            targetName: r.targetName || r.target_name || '',
            locationName: r.locationName || r.location_name || '',
            userName: r.userName || r.user_name || 'Người dùng',
            userEmail: r.userEmail || r.user_email || '',
            userAvatar: r.userAvatar || r.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
            rating: parseFloat(r.rating || 5.0),
            comment: r.comment || '',
            createdAt: r.createdAt ? (typeof r.createdAt === 'string' && r.createdAt.includes('/') ? r.createdAt : new Date(r.createdAt).toLocaleString('vi-VN')) : '20/10/2026',
            status: r.status || 'Approved',
          }));
          setReviews(mapped);
        }
      })
      .catch(() => {});

    // 5. Tải danh sách người dùng
    api.admin.getUsers()
      .then((res) => {
        if (!isMounted || !res) return;
        const list = res.users || (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          const mapped = list.map((u) => ({
            id: u.manguoidung || u.id,
            name: u.hoten || u.name,
            email: u.email,
            role: u.vaitro || u.role || 'Member',
            scansCount: u.scansCount || 0,
            wishlistCount: u.wishlistCount || 0,
            joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : (u.joinedDate || '01/01/2026'),
            status: u.trangthai || u.status || 'Active',
          }));
          setUsers(mapped);
        }
      })
      .catch(() => {});

    // 6. Tải số liệu thống kê Admin
    api.admin.getStats()
      .then((data) => {
        if (!isMounted || !data) return;
        setStats(data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // ================= 1. XỬ LÝ ĐỊA DANH =================
  const handleOpenAddDest = () => {
    setEditingDestination(null);
    setDestForm({
      id: '',
      name: '',
      province: '',
      danhHieu: '',
      moTa: '',
      viDo: '',
      kinhDo: '',
      quyMo: '',
      thoiDiemLyTuong: '',
      image: '/images/vinh_ha_long.jpg',
      imageFile: null,
      imagePreview: null,
      maLoaiHinhList: ['LH0001'],
      categories: ['Thiên nhiên'],
    });
    setIsDestModalOpen(true);
  };

  const handleOpenEditDest = (dest) => {
    setEditingDestination(dest);

    let maLoaiHinhList = Array.isArray(dest.maLoaiHinhList) && dest.maLoaiHinhList.length > 0
      ? [...dest.maLoaiHinhList]
      : [];

    if (maLoaiHinhList.length === 0 && Array.isArray(dest.categories) && dest.categories.length > 0 && allCategories.length > 0) {
      maLoaiHinhList = allCategories
        .filter(c => dest.categories.includes(c.ten))
        .map(c => c.maLoaiHinh);
    }

    setDestForm({
      id: dest.id,
      name: dest.name || '',
      province: dest.province || '',
      danhHieu: dest.danhHieu || '',
      moTa: dest.moTa || dest.desc || '',
      viDo: dest.viDo !== undefined && dest.viDo !== null ? dest.viDo : '',
      kinhDo: dest.kinhDo !== undefined && dest.kinhDo !== null ? dest.kinhDo : '',
      quyMo: dest.quyMo || '',
      thoiDiemLyTuong: dest.thoiDiemLyTuong || '',
      image: dest.image || '/images/vinh_ha_long.jpg',
      imageFile: null,
      imagePreview: null,
      maLoaiHinhList: maLoaiHinhList,
      categories: Array.isArray(dest.categories) ? [...dest.categories] : (dest.category ? [dest.category] : ['Thiên nhiên']),
    });
    setIsDestModalOpen(true);
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    setIsSavingDest(true);
    try {
      let finalImageUrl = destForm.image || '/images/vinh_ha_long.jpg';

      // Nếu người dùng chọn tải ảnh mới từ máy tính, upload trước
      if (destForm.imageFile) {
        const uploadRes = await api.admin.uploadLocationImage(destForm.imageFile);
        if (uploadRes && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      }

      const payload = {
        ten: (destForm.name || '').trim(),
        tinhThanh: (destForm.province || '').trim(),
        danhHieu: destForm.danhHieu ? destForm.danhHieu.trim() : null,
        moTa: destForm.moTa ? destForm.moTa.trim() : null,
        viDo: destForm.viDo !== '' && destForm.viDo !== null && !isNaN(Number(destForm.viDo)) ? parseFloat(destForm.viDo) : null,
        kinhDo: destForm.kinhDo !== '' && destForm.kinhDo !== null && !isNaN(Number(destForm.kinhDo)) ? parseFloat(destForm.kinhDo) : null,
        quyMo: destForm.quyMo ? destForm.quyMo.trim() : null,
        thoiDiemLyTuong: destForm.thoiDiemLyTuong ? destForm.thoiDiemLyTuong.trim() : null,
        anhUrl: finalImageUrl,
        maLoaiHinhList: destForm.maLoaiHinhList || [],
      };

      if (!payload.ten || !payload.tinhThanh) {
        alert('Tên địa danh và Tỉnh/Thành phố là bắt buộc.');
        setIsSavingDest(false);
        return;
      }

      if (editingDestination) {
        const res = await api.admin.updateLocation(editingDestination.id, payload);
        const updatedData = res?.data;
        setDestinations(prev => prev.map(d => {
          if (String(d.id) === String(editingDestination.id)) {
            return {
              ...d,
              name: payload.ten,
              province: payload.tinhThanh,
              danhHieu: payload.danhHieu || '',
              moTa: payload.moTa || '',
              viDo: payload.viDo,
              kinhDo: payload.kinhDo,
              quyMo: payload.quyMo || '',
              thoiDiemLyTuong: payload.thoiDiemLyTuong || '',
              image: payload.anhUrl,
              categories: destForm.categories?.length > 0 ? destForm.categories : d.categories,
              maLoaiHinhList: destForm.maLoaiHinhList || d.maLoaiHinhList,
              category: destForm.categories?.[0] || d.category || 'Thiên nhiên',
            };
          }
          return d;
        }));
      } else {
        const res = await api.admin.createLocation(payload);
        const createdLoc = res?.data;
        const createdId = createdLoc?.maDiaDiem || `DD${String(destinations.length + 1).padStart(4, '0')}`;
        const newDest = {
          id: createdId,
          name: payload.ten,
          province: payload.tinhThanh,
          danhHieu: payload.danhHieu || '',
          moTa: payload.moTa || '',
          viDo: payload.viDo,
          kinhDo: payload.kinhDo,
          quyMo: payload.quyMo || '',
          thoiDiemLyTuong: payload.thoiDiemLyTuong || '',
          image: payload.anhUrl,
          categories: destForm.categories?.length > 0 ? destForm.categories : ['Thiên nhiên'],
          maLoaiHinhList: destForm.maLoaiHinhList || ['LH0001'],
          category: destForm.categories?.[0] || 'Thiên nhiên',
          status: 'Active',
          totalHotels: 0,
          totalAttractions: 0
        };
        setDestinations(prev => [...prev, newDest]);
      }
      setIsDestModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu thông tin địa danh.');
    } finally {
      setIsSavingDest(false);
    }
  };

  const handleDeleteDestination = async (id) => {
    const isAi = (typeof id === 'number' && id <= 10) ||
      (typeof id === 'string' && (
        ['DD0001', 'DD0002', 'DD0003', 'DD0004', 'DD0005', 'DD0006', 'DD0007', 'DD0008', 'DD0009', 'DD0010'].includes(id) ||
        (id.startsWith('DD00') && parseInt(id.replace('DD', ''), 10) <= 10) ||
        (parseInt(id, 10) <= 10)
      ));

    if (isAi) {
      alert('Theo tài liệu đặc tả hệ thống (AGENT.md & PROJECT_OVERVIEW.md), 10 địa danh gốc gắn liền với mô hình AI ResNet50 (DD0001 - DD0010) chỉ được phép chỉnh sửa thông tin, không được phép xóa khỏi cơ sở dữ liệu!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa địa điểm du lịch mở rộng này khỏi danh mục hệ thống?')) {
      try {
        await api.admin.deleteLocation(id);
        setDestinations(prev => prev.filter(d => String(d.id) !== String(id)));
      } catch (err) {
        alert(err.message || 'Không thể xóa địa danh.');
      }
    }
  };

  // ================= 2. XỬ LÝ ĐIỂM CHECK-IN CON =================
  const handleOpenAddCheckIn = (defaultLocId) => {
    setEditingCheckIn(null);
    setCheckInForm({
      id: '',
      name: '',
      locationId: defaultLocId || destinations[0]?.id || 'DD0001',
      desc: '',
      diemNoiBat: '',
      diaChi: '',
      viDo: '',
      kinhDo: '',
      ticketPrice: 'Miễn phí',
      bestTime: '08:00 – 17:00',
      image: '',
      mediaList: [],
      maLoaiHinhList: ['LH0001'],
      hoatDongList: [],
    });
    setIsCheckInModalOpen(true);
  };

  const handleOpenEditCheckIn = async (spot) => {
    setEditingCheckIn(spot);
    const initialMedia = Array.isArray(spot.mediaList) && spot.mediaList.length > 0
      ? spot.mediaList
      : (spot.image && !spot.image.startsWith('blob:') ? [{ url: spot.image, type: 'image', thuTu: 1 }] : []);

    const initialHoatDong = Array.isArray(spot.hoatDongList)
      ? spot.hoatDongList.map((h, idx) =>
          typeof h === 'string'
            ? { ten: h, icon: 'sparkles', ghiChu: '', thuTu: idx + 1 }
            : {
                maHoatDong: h.maHoatDong || h.mahoatdong,
                ten: h.ten || h.name || '',
                icon: h.icon || 'sparkles',
                ghiChu: h.ghiChu || h.ghichu || '',
                thuTu: h.thuTu || h.thutu || idx + 1,
              }
        )
      : [];

    setCheckInForm({
      id: spot.id,
      name: spot.name || '',
      locationId: spot.locationId || destinations[0]?.id || 'DD0001',
      desc: spot.desc || '',
      diemNoiBat: spot.diemNoiBat || '',
      diaChi: spot.diaChi || '',
      viDo: spot.viDo !== undefined && spot.viDo !== null ? spot.viDo : '',
      kinhDo: spot.kinhDo !== undefined && spot.kinhDo !== null ? spot.kinhDo : '',
      ticketPrice: spot.ticketPrice || 'Miễn phí',
      bestTime: spot.bestTime || '08:00 – 17:00',
      image: spot.image || '/images/vinh_ha_long.jpg',
      mediaList: initialMedia,
      maLoaiHinhList: Array.isArray(spot.maLoaiHinhList) ? spot.maLoaiHinhList : [],
      hoatDongList: initialHoatDong,
    });
    setIsCheckInModalOpen(true);

    try {
      const fullDetail = await api.attractions.getById(spot.id);
      if (fullDetail) {
        const fullMedia = Array.isArray(fullDetail.media) && fullDetail.media.length > 0
          ? fullDetail.media.map((m, idx) => ({
              url: m.url,
              type: m.type || 'image',
              thuTu: m.thuTu || idx + 1,
            }))
          : initialMedia;

        setCheckInForm((prev) => ({
          ...prev,
          name: fullDetail.ten || prev.name,
          locationId: fullDetail.maDiaDiem || prev.locationId,
          desc: fullDetail.moTa || prev.desc,
          diemNoiBat: fullDetail.diemNoiBat || prev.diemNoiBat,
          diaChi: fullDetail.diaChi || prev.diaChi,
          viDo: fullDetail.viDo !== undefined && fullDetail.viDo !== null ? fullDetail.viDo : prev.viDo,
          kinhDo: fullDetail.kinhDo !== undefined && fullDetail.kinhDo !== null ? fullDetail.kinhDo : prev.kinhDo,
          ticketPrice: fullDetail.giaVe || prev.ticketPrice,
          bestTime: fullDetail.gioMoCua || prev.bestTime,
          image: fullMedia[0]?.url || prev.image,
          mediaList: fullMedia,
          maLoaiHinhList: Array.isArray(fullDetail.maLoaiHinh) && fullDetail.maLoaiHinh.length > 0
            ? fullDetail.maLoaiHinh
            : prev.maLoaiHinhList,
          hoatDongList: Array.isArray(fullDetail.hoatDong)
            ? fullDetail.hoatDong.map((h, idx) => ({
                maHoatDong: h.maHoatDong || h.mahoatdong,
                ten: h.ten || h.name || '',
                icon: h.icon || 'sparkles',
                ghiChu: h.ghiChu || h.ghichu || '',
                thuTu: h.thuTu || h.thutu || idx + 1,
              }))
            : prev.hoatDongList,
        }));
      }
    } catch (err) {
      console.warn('Không thể tải chi tiết điểm check-in:', err);
    }
  };

  const handleSaveCheckIn = async (e) => {
    e.preventDefault();
    if (!checkInForm.name || !checkInForm.name.trim()) {
      alert('Vui lòng nhập tên điểm tham quan.');
      return;
    }
    if (!checkInForm.locationId) {
      alert('Vui lòng chọn địa danh trực thuộc.');
      return;
    }

    try {
      setIsSavingCheckIn(true);

      // Xử lý toàn bộ danh sách hình ảnh trong mediaList
      const mediaItems = Array.isArray(checkInForm.mediaList) && checkInForm.mediaList.length > 0
        ? checkInForm.mediaList
        : (checkInForm.image && !checkInForm.image.startsWith('blob:') ? [{ url: checkInForm.image, type: 'image' }] : []);

      const resolvedMediaList = [];
      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        let mediaUrl = item.url;
        // Nếu là file chọn tải lên từ máy tính
        if (item.file) {
          const uploadRes = await api.admin.uploadLocationImage(item.file);
          const uploadedUrl = uploadRes?.url || uploadRes?.data?.url;
          if (uploadedUrl) {
            mediaUrl = uploadedUrl;
          }
        }
        if (mediaUrl && !mediaUrl.startsWith('blob:')) {
          resolvedMediaList.push({
            mediaUrl,
            mediaType: item.type || 'image',
            thuTu: resolvedMediaList.length + 1,
          });
        }
      }

      if (resolvedMediaList.length === 0 && checkInForm.image && !checkInForm.image.startsWith('blob:')) {
        resolvedMediaList.push({
          mediaUrl: checkInForm.image,
          mediaType: 'image',
          thuTu: 1,
        });
      }

      const primaryImageUrl = resolvedMediaList[0]?.mediaUrl || (checkInForm.image && !checkInForm.image.startsWith('blob:') ? checkInForm.image : '/images/vinh_ha_long.jpg');
      const locObj = destinations.find((d) => String(d.id) === String(checkInForm.locationId));

      const resolvedHoatDongList = (checkInForm.hoatDongList || [])
        .map((h, idx) => ({
          maHoatDong: typeof h === 'object' ? (h.maHoatDong || h.mahoatdong) : undefined,
          ten: typeof h === 'object' ? (h.ten || h.name || '') : h,
          icon: typeof h === 'object' ? (h.icon || 'sparkles') : 'sparkles',
          ghiChu: typeof h === 'object' ? (h.ghiChu || h.ghichu || '') : '',
          thuTu: idx + 1,
        }))
        .filter((h) => Boolean(h.ten && h.ten.trim()));

      const payload = {
        maDiaDiem: checkInForm.locationId,
        ten: checkInForm.name.trim(),
        moTa: checkInForm.desc || '',
        diemNoiBat: checkInForm.diemNoiBat || '',
        diaChi: checkInForm.diaChi || '',
        viDo: checkInForm.viDo ? parseFloat(checkInForm.viDo) : null,
        kinhDo: checkInForm.kinhDo ? parseFloat(checkInForm.kinhDo) : null,
        giaVe: checkInForm.ticketPrice || 'Miễn phí',
        gioMoCua: checkInForm.bestTime || '08:00 – 17:00',
        mediaList: resolvedMediaList,
        maLoaiHinhList: checkInForm.maLoaiHinhList || [],
        hoatDongList: resolvedHoatDongList,
      };

      const matchedCatNames = allCategories
        .filter((c) => (checkInForm.maLoaiHinhList || []).includes(c.maLoaiHinh))
        .map((c) => c.ten);

      if (editingCheckIn) {
        const updateRes = await api.admin.updateAttraction(editingCheckIn.id, payload);
        const updatedDetail = updateRes?.data;
        const savedMedia = (updatedDetail?.media && updatedDetail.media.length > 0)
          ? updatedDetail.media.map((m, idx) => ({ url: m.url, type: m.type || 'image', thuTu: m.thuTu || idx + 1 }))
          : resolvedMediaList.map(m => ({ url: m.mediaUrl, type: m.mediaType, thuTu: m.thuTu }));
        const finalPrimaryImage = savedMedia[0]?.url || primaryImageUrl;
        const finalHoatDong = (updatedDetail?.hoatDong && updatedDetail.hoatDong.length > 0)
          ? updatedDetail.hoatDong
          : resolvedHoatDongList;

        setCheckInSpots((prev) =>
          prev.map((c) =>
            String(c.id) === String(editingCheckIn.id)
              ? {
                  ...c,
                  name: payload.ten,
                  locationId: payload.maDiaDiem,
                  locationName: locObj ? locObj.name : c.locationName,
                  desc: payload.moTa,
                  diemNoiBat: payload.diemNoiBat,
                  diaChi: payload.diaChi,
                  viDo: payload.viDo,
                  kinhDo: payload.kinhDo,
                  ticketPrice: payload.giaVe,
                  bestTime: payload.gioMoCua,
                  image: finalPrimaryImage,
                  mediaList: savedMedia,
                  maLoaiHinhList: payload.maLoaiHinhList,
                  loaiHinh: matchedCatNames.length > 0 ? matchedCatNames : c.loaiHinh,
                  hoatDongList: finalHoatDong,
                }
              : c
          )
        );
      } else {
        const res = await api.admin.createAttraction(payload);
        const createdDetail = res?.data;
        const createdId = createdDetail?.maDiemTQ || `TQ${String(checkInSpots.length + 1).padStart(4, '0')}`;
        const savedMedia = (createdDetail?.media && createdDetail.media.length > 0)
          ? createdDetail.media.map((m, idx) => ({ url: m.url, type: m.type || 'image', thuTu: m.thuTu || idx + 1 }))
          : resolvedMediaList.map(m => ({ url: m.mediaUrl, type: m.mediaType, thuTu: m.thuTu }));
        const finalPrimaryImage = savedMedia[0]?.url || primaryImageUrl;
        const finalHoatDong = (createdDetail?.hoatDong && createdDetail.hoatDong.length > 0)
          ? createdDetail.hoatDong
          : resolvedHoatDongList;

        const newSpot = {
          id: createdId,
          name: payload.ten,
          locationId: payload.maDiaDiem,
          locationName: locObj ? locObj.name : destinations[0]?.name || '',
          desc: payload.moTa,
          diemNoiBat: payload.diemNoiBat,
          diaChi: payload.diaChi,
          viDo: payload.viDo,
          kinhDo: payload.kinhDo,
          ticketPrice: payload.giaVe,
          bestTime: payload.gioMoCua,
          image: finalPrimaryImage,
          mediaList: savedMedia,
          maLoaiHinhList: payload.maLoaiHinhList,
          loaiHinh: matchedCatNames,
          hoatDongList: finalHoatDong,
        };
        setCheckInSpots((prev) => [newSpot, ...prev]);
      }
      setIsCheckInModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu điểm check-in.');
    } finally {
      setIsSavingCheckIn(false);
    }
  };

  const handleRequestDeleteCheckIn = (spotOrId) => {
    const spot =
      typeof spotOrId === 'object' && spotOrId !== null
        ? spotOrId
        : checkInSpots.find((c) => String(c.id) === String(spotOrId));
    if (spot) {
      setSpotToDelete(spot);
    }
  };

  const handleConfirmDeleteCheckIn = async () => {
    if (!spotToDelete) return;
    try {
      setIsDeletingCheckIn(true);
      await api.admin.deleteAttraction(spotToDelete.id);
      setCheckInSpots((prev) => prev.filter((c) => String(c.id) !== String(spotToDelete.id)));
      setSpotToDelete(null);
    } catch (err) {
      alert(err.message || 'Không thể xóa điểm check-in.');
    } finally {
      setIsDeletingCheckIn(false);
    }
  };

  // ================= 3. XỬ LÝ KHÁCH SẠN & DỊCH VỤ =================
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      locationId: destinations[0]?.id || 'DD0001',
      tags: ['Nghỉ dưỡng', 'Thiên nhiên'],
      price: '1.500.000đ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
      coreAmenities: 'Hồ bơi vô cực ngoài trời, Khu spa thư giãn, Trị liệu khoáng nóng',
      affiliateUrl: 'https://www.agoda.com'
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      ...service,
      coreAmenities: Array.isArray(service.coreAmenities) ? service.coreAmenities.join(', ') : service.coreAmenities
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const locObj = destinations.find(d => String(d.id) === String(serviceForm.locationId));
    const amenitiesArr = (serviceForm.coreAmenities || '').split(',').map(s => s.trim()).filter(Boolean);
    const numericPrice = parseInt(String(serviceForm.price).replace(/\D/g, ''), 10) || 1500000;

    try {
      const payload = {
        maDiaDiem: serviceForm.locationId,
        ten: serviceForm.name,
        soSao: serviceForm.rating || 4.8,
        giaThamKhao: numericPrice,
        booking_url: serviceForm.affiliateUrl,
        mediaList: serviceForm.image ? [{ mediaUrl: serviceForm.image, mediaType: 'image', thuTu: 1 }] : [],
      };

      if (editingService) {
        await api.admin.updateHotel(editingService.id, payload);
        setServices(prev => prev.map(s => String(s.id) === String(editingService.id) ? {
          ...s,
          ...serviceForm,
          locationName: locObj ? locObj.name : s.locationName,
          coreAmenities: amenitiesArr
        } : s));
      } else {
        const res = await api.admin.createHotel(payload);
        const createdId = res?.data?.maKhachSan || `KS${String(services.length + 1).padStart(4, '0')}`;
        const newServ = {
          ...serviceForm,
          id: createdId,
          locationName: locObj ? locObj.name : (destinations[0]?.name || 'Vịnh Hạ Long'),
          coreAmenities: amenitiesArr,
          status: 'Active'
        };
        setServices(prev => [...prev, newServ]);
      }
      setIsServiceModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu thông tin khách sạn.');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách sạn / dịch vụ này?')) {
      try {
        await api.admin.deleteHotel(id);
        setServices(prev => prev.filter(s => String(s.id) !== String(id)));
      } catch (err) {
        alert(err.message || 'Không thể xóa khách sạn.');
      }
    }
  };

  // ================= 4. XỬ LÝ BÌNH LUẬN & ĐÁNH GIÁ (MỚI) =================
  const handleToggleReviewStatus = async (reviewId) => {
    const rev = reviews.find(r => String(r.id) === String(reviewId));
    if (!rev) return;
    const nextStatus = rev.status === 'Approved' ? 'Flagged' : 'Approved';
    try {
      await api.admin.updateReviewStatus(rev.targetType || 'hotel', reviewId, nextStatus);
      setReviews(prev => prev.map(r => String(r.id) === String(reviewId) ? { ...r, status: nextStatus } : r));
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái kiểm duyệt.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const rev = reviews.find(r => String(r.id) === String(reviewId));
    if (!rev) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này vĩnh viễn?')) {
      try {
        await api.admin.deleteReview(rev.targetType || 'hotel', reviewId);
        setReviews(prev => prev.filter(r => String(r.id) !== String(reviewId)));
      } catch (err) {
        alert(err.message || 'Không thể xóa bình luận.');
      }
    }
  };

  // ================= 5. XỬ LÝ NGƯỜI DÙNG & KHÓA TÀI KHOẢN =================
  const handleToggleUserBan = async (userId) => {
    const targetUser = users.find(u => String(u.id) === String(userId));
    if (!targetUser) return;

    if (targetUser.role === 'Admin') {
      alert('Không thể khóa tài khoản của Quản trị viên khác!');
      return;
    }

    const nextStatus = targetUser.status === 'Active' ? 'Banned' : 'Active';
    try {
      await api.admin.updateUserStatus(userId, nextStatus);
      setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, status: nextStatus } : u));
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái người dùng.');
    }
  };

  // Metrics helper
  const flaggedReviewsCount = stats?.flaggedReviewsCount !== undefined
    ? stats.flaggedReviewsCount
    : reviews.filter(r => r.status === 'Flagged').length;

  const bannedUsersCount = users.filter(u => u.status === 'Banned').length;
  const reviewsAverageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-800 flex font-sans overflow-hidden">
      {/* 1. LEFT SIDEBAR (CỐ ĐỊNH TRONG VIEWPORT) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        destinationsCount={destinations.length}
        checkInsCount={checkInSpots.length}
        servicesCount={services.length}
        reviewsCount={reviews.length}
        usersCount={users.length}
        flaggedReviewsCount={flaggedReviewsCount}
      />

      {/* 2. MAIN BODY (CHỈ CUỘN TRONG KHUNG BÊN PHẢI) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header bar */}
        <AdminHeader activeTab={activeTab} />

        <main className="p-6 sm:p-8 space-y-6 flex-1 bg-slate-50">
          {/* Top Metric Cards */}
          <AdminMetrics
            destinationsCount={destinations.length}
            servicesCount={services.length}
            reviewsCount={reviews.length}
            reviewsAverageRating={reviewsAverageRating}
            flaggedReviewsCount={flaggedReviewsCount}
            usersCount={users.length}
            bannedUsersCount={bannedUsersCount}
          />

          {/* TAB 1: 10 Địa danh */}
          {activeTab === 'destinations' && (
            <DestinationsTab
              destinations={destinations.filter(d =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.category.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAdd={handleOpenAddDest}
              onOpenEdit={handleOpenEditDest}
              onDelete={handleDeleteDestination}
            />
          )}

          {/* TAB 2: Điểm Check-in con */}
          {activeTab === 'checkins' && (
            <CheckInSpotsTab
              checkInSpots={checkInSpots.filter(c =>
                (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.locationName && c.locationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.desc && c.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.diemNoiBat && c.diemNoiBat.toLowerCase().includes(searchQuery.toLowerCase()))
              )}
              destinations={destinations}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAdd={handleOpenAddCheckIn}
              onOpenEdit={handleOpenEditCheckIn}
              onDelete={handleRequestDeleteCheckIn}
            />
          )}

          {/* TAB 3: Khách sạn & Dịch vụ */}
          {activeTab === 'services' && (
            <ServicesTab
              services={services.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
              )}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAdd={handleOpenAddService}
              onOpenEdit={handleOpenEditService}
              onDelete={handleDeleteService}
            />
          )}

          {/* TAB 4: Bình luận & Đánh giá (MỚI) */}
          {activeTab === 'reviews' && (
            <ReviewsTab
              reviews={reviews}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onToggleReviewStatus={handleToggleReviewStatus}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {/* TAB 5: Người dùng & Khóa tài khoản */}
          {activeTab === 'users' && (
            <UsersTab
              users={users.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onToggleUserBan={handleToggleUserBan}
            />
          )}

          {/* TAB 6: Thống kê ResNet50 */}
          {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
        </main>
      </div>

      {/* MODALS */}
      <DestinationModal
        isOpen={isDestModalOpen}
        onClose={() => setIsDestModalOpen(false)}
        editingDestination={editingDestination}
        destForm={destForm}
        setDestForm={setDestForm}
        onSave={handleSaveDestination}
        availableCategories={allCategories}
        isSaving={isSavingDest}
      />

      <CheckInSpotModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        editingCheckIn={editingCheckIn}
        checkInForm={checkInForm}
        setCheckInForm={setCheckInForm}
        destinations={destinations}
        onSave={handleSaveCheckIn}
        availableCategories={allCategories}
        availableActivities={allActivities}
        isSaving={isSavingCheckIn}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        editingService={editingService}
        serviceForm={serviceForm}
        setServiceForm={setServiceForm}
        destinations={destinations}
        onSave={handleSaveService}
      />

      {/* POPUP XÁC NHẬN XÓA ĐIỂM CHECK-IN */}
      {spotToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Xác nhận xóa điểm check-in
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa điểm tham quan <span className="font-semibold text-slate-800">"{spotToDelete.name}"</span> ({spotToDelete.id})? Toàn bộ hình ảnh, liên kết danh mục và đánh giá liên quan sẽ bị xóa.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setSpotToDelete(null)}
                disabled={isDeletingCheckIn}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCheckIn}
                disabled={isDeletingCheckIn}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2"
              >
                {isDeletingCheckIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
