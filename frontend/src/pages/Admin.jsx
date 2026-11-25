import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  Sparkles,
  ShieldAlert,
  AlertCircle,
  Edit3,
  Lock,
  Unlock
} from 'lucide-react';

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

  // Data States (khoi tao rong, 100% du lieu dong bo truc tiep tu Co so du lieu)
  const [destinations, setDestinations] = useState([]);
  const [services, setServices] = useState([]);
  const [checkInSpots, setCheckInSpots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Modals thông báo & xác nhận lịch sự thay cho alert / confirm
  const [aiProtectedDest, setAiProtectedDest] = useState(null); // Khi bấm xóa 10 địa danh gốc AI
  const [destToDelete, setDestToDelete] = useState(null);       // Khi xác nhận xóa địa danh mở rộng
  const [isDeletingDest, setIsDeletingDest] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null); // Khi xác nhận xóa khách sạn
  const [isDeletingService, setIsDeletingService] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);   // Khi xác nhận xóa bình luận
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [adminProtectedNotice, setAdminProtectedNotice] = useState(false); // Khi cố khóa Admin khác
  const [userToToggle, setUserToToggle] = useState(null);       // Khi xác nhận khóa / mở khóa tài khoản
  const [isTogglingUser, setIsTogglingUser] = useState(false);
  const [generalNotice, setGeneralNotice] = useState(null);     // Thông báo lỗi/cảnh báo lịch sự { title, message }

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
  const [isSavingService, setIsSavingService] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    locationId: 'DD0001',
    soSao: 5.0,
    diemNoiBat: '',
    diaChi: '',
    viDo: '',
    kinhDo: '',
    price: 1500000,
    donViTinh: '/đêm',
    affiliateUrl: 'https://www.agoda.com',
    moTa: '',
    image: '/images/vinh_ha_long.jpg',
    mediaList: [],
    maLoaiHinhList: ['LH0004'],
    tienNghiList: ['TN0001', 'TN0002'],
  });

  // ================= NẠP DỮ LIỆU TỪ BACKEND API =================
  useEffect(() => {
    let isMounted = true;
    setIsDataLoading(true);

    const loadAllData = async () => {
      try {
        const [catsRes, actsRes, amensRes, locsRes, attsRes, hotsRes, revsRes, usrsRes, statsRes] = await Promise.allSettled([
          api.locations?.getCategories ? api.locations.getCategories() : Promise.resolve([]),
          api.locations?.getActivities ? api.locations.getActivities() : Promise.resolve([]),
          api.locations?.getAmenities ? api.locations.getAmenities() : Promise.resolve([]),
          api.locations.getAll(),
          api.attractions.getAll(),
          api.hotels.getAll(),
          api.admin.getReviews(),
          api.admin.getUsers(),
          api.admin.getStats(),
        ]);

        if (!isMounted) return;

        // 0. Danh mục loại hình, Hoạt động & Tiện nghi
        if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
          setAllCategories(catsRes.value);
        }
        if (actsRes.status === 'fulfilled' && Array.isArray(actsRes.value)) {
          setAllActivities(actsRes.value);
        }
        if (amensRes.status === 'fulfilled' && Array.isArray(amensRes.value)) {
          const cleanAmens = amensRes.value.filter(
            (a) => !a.ten?.toLowerCase().includes('gym') && !a.ten?.toLowerCase().includes('fitness')
          );
          setAllAmenities(cleanAmens);
        }

        // 1. Danh sách địa danh
        if (locsRes.status === 'fulfilled' && Array.isArray(locsRes.value)) {
          const mappedLocs = locsRes.value.map((loc) => ({
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
          setDestinations(mappedLocs);
        }

        // 2. Điểm tham quan con
        if (attsRes.status === 'fulfilled' && Array.isArray(attsRes.value)) {
          const mappedAtts = attsRes.value.map((att) => ({
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
          setCheckInSpots(mappedAtts);
        }

        // 3. Khách sạn
        if (hotsRes.status === 'fulfilled' && Array.isArray(hotsRes.value)) {
          const mappedHots = hotsRes.value.map((hotel) => ({
            id: hotel.maKhachSan || hotel.id,
            name: hotel.ten || hotel.name,
            locationId: hotel.maDiaDiem || hotel.locationId,
            locationName: hotel.tenDiaDiem || '',
            tinhThanh: hotel.tinhThanh || '',
            soSao: parseFloat(hotel.soSao || 5.0),
            rating: parseFloat(hotel.diemDanhGia || hotel.soSao || 5.0),
            soDanhGia: hotel.soDanhGia || 0,
            giaThamKhao: hotel.giaThamKhao || 0,
            price: hotel.giaThamKhao ? new Intl.NumberFormat('vi-VN').format(hotel.giaThamKhao) + 'đ' : (hotel.price || '1.500.000đ'),
            donViTinh: hotel.donViTinh || '/đêm',
            diemNoiBat: hotel.diemNoiBat || '',
            diaChi: hotel.diaChi || '',
            viDo: hotel.viDo !== undefined && hotel.viDo !== null ? hotel.viDo : '',
            kinhDo: hotel.kinhDo !== undefined && hotel.kinhDo !== null ? hotel.kinhDo : '',
            moTa: hotel.moTa || '',
            image: hotel.anhDaiDien || hotel.hinhAnh || hotel.image || '/images/vinh_ha_long.jpg',
            affiliateUrl: hotel.bookingUrl || hotel.booking_url || hotel.affiliateUrl || 'https://www.agoda.com',
            tags: Array.isArray(hotel.loaiHinh) && hotel.loaiHinh.length > 0 ? hotel.loaiHinh : ['Nghỉ dưỡng'],
            maLoaiHinhList: Array.isArray(hotel.maLoaiHinh) ? hotel.maLoaiHinh : [],
            coreAmenities: Array.isArray(hotel.tienNghi) && hotel.tienNghi.length > 0
              ? hotel.tienNghi.map((tn) => typeof tn === 'object' ? tn.ten : tn)
              : ['Hồ bơi vô cực view biển/núi', 'Spa & Trị liệu thảo mộc'],
            tienNghiList: Array.isArray(hotel.tienNghi)
              ? hotel.tienNghi.map((tn) => typeof tn === 'object' ? tn.maTienNghi : tn)
              : [],
            status: 'Active',
          }));
          setServices(mappedHots);
        }

        // 4. Đánh giá & kiểm duyệt
        if (revsRes.status === 'fulfilled' && revsRes.value) {
          const list = revsRes.value.data || (Array.isArray(revsRes.value) ? revsRes.value : []);
          if (list.length > 0) {
            const mappedRevs = list.map((r) => ({
              id: r.id,
              targetType: r.targetType || r.target_type || 'hotel',
              targetId: r.targetId || r.target_id,
              targetName: r.targetName || r.target_name || '',
              locationName: r.locationName || r.location_name || '',
              userName: r.userName || r.user_name || 'Người dùng',
              userEmail: r.userEmail || r.user_email || '',
              userAvatar: (r.userAvatar || r.user_avatar) && !(r.userAvatar || r.user_avatar).includes('photo-1535713875002')
                ? (r.userAvatar || r.user_avatar)
                : '/images/default-avatar.svg',
              rating: parseFloat(r.rating || 5.0),
              comment: r.comment || '',
              createdAt: r.createdAt ? (typeof r.createdAt === 'string' && r.createdAt.includes('/') ? r.createdAt : new Date(r.createdAt).toLocaleString('vi-VN')) : '20/10/2026',
              status: r.status || 'Approved',
            }));
            setReviews(mappedRevs);
          }
        }

        // 5. Danh sách người dùng
        if (usrsRes.status === 'fulfilled' && usrsRes.value) {
          const list = usrsRes.value.users || (Array.isArray(usrsRes.value) ? usrsRes.value : []);
          if (list.length > 0) {
            const mappedUsrs = list.map((u) => ({
              id: u.manguoidung || u.id,
              name: u.hoten || u.name,
              email: u.email,
              role: u.vaitro || u.role || 'Member',
              scansCount: u.scansCount !== undefined ? u.scansCount : (u.soLuotQuet || u.so_luot_quet || u.scans_count || 0),
              wishlistCount: u.wishlistCount !== undefined ? u.wishlistCount : (u.soYeuThich || u.so_yeu_thich || u.wishlist_count || 0),
              joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : (u.joinedDate || '01/01/2026'),
              status: u.trangthai || u.status || 'Active',
            }));
            setUsers(mappedUsrs);
          }
        }

        // 6. Số liệu thống kê
        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats(statsRes.value);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang quản trị từ CSDL:', err);
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    };

    loadAllData();

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
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingDest(true);
    try {
      let finalImageUrl = destForm.image || '/images/vinh_ha_long.jpg';

      // Nếu người dùng chọn tải ảnh mới từ máy tính, upload trước
      if (destForm.imageFile) {
        const uploadRes = await api.admin.uploadLocationImage(destForm.imageFile);
        if (uploadRes && (uploadRes.url || uploadRes.data?.url)) {
          finalImageUrl = uploadRes.url || uploadRes.data.url;
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
        setGeneralNotice({
          title: 'Thông tin chưa đầy đủ',
          message: 'Tên địa danh và Tỉnh/Thành phố là hai trường thông tin bắt buộc.'
        });
        setIsSavingDest(false);
        return;
      }

      if (editingDestination) {
        const res = await api.admin.updateLocation(editingDestination.id, payload);
        const updatedLoc = res?.data;
        setDestinations(prev => prev.map(d => {
          if (String(d.id) === String(editingDestination.id)) {
            return {
              ...d,
              name: payload.ten,
              province: payload.tinhThanh,
              danhHieu: payload.danhHieu || '',
              moTa: payload.moTa || '',
              viDo: payload.viDo !== null && payload.viDo !== undefined ? payload.viDo : '',
              kinhDo: payload.kinhDo !== null && payload.kinhDo !== undefined ? payload.kinhDo : '',
              quyMo: payload.quyMo || '',
              thoiDiemLyTuong: payload.thoiDiemLyTuong || '',
              image: payload.anhUrl,
              categories: updatedLoc?.loaiHinh || (destForm.categories?.length > 0 ? destForm.categories : d.categories),
              maLoaiHinhList: updatedLoc?.maLoaiHinh || (destForm.maLoaiHinhList || d.maLoaiHinhList),
              category: updatedLoc?.loaiHinh?.[0] || destForm.categories?.[0] || d.category || 'Thiên nhiên',
            };
          }
          return d;
        }));
      } else {
        const res = await api.admin.createLocation(payload);
        const createdLoc = res?.data;
        const createdId = createdLoc?.maDiaDiem || createdLoc?.madiadiem || `DD${String(destinations.length + 1).padStart(4, '0')}`;
        const newDest = {
          id: createdId,
          name: payload.ten,
          province: payload.tinhThanh,
          danhHieu: payload.danhHieu || '',
          moTa: payload.moTa || '',
          viDo: payload.viDo !== null && payload.viDo !== undefined ? payload.viDo : '',
          kinhDo: payload.kinhDo !== null && payload.kinhDo !== undefined ? payload.kinhDo : '',
          quyMo: payload.quyMo || '',
          thoiDiemLyTuong: payload.thoiDiemLyTuong || '',
          image: payload.anhUrl,
          categories: createdLoc?.loaiHinh || (destForm.categories?.length > 0 ? destForm.categories : ['Thiên nhiên']),
          maLoaiHinhList: createdLoc?.maLoaiHinh || (destForm.maLoaiHinhList || ['LH0001']),
          category: createdLoc?.loaiHinh?.[0] || destForm.categories?.[0] || 'Thiên nhiên',
          status: 'Active',
          totalHotels: 0,
          totalAttractions: 0
        };
        setDestinations(prev => [...prev, newDest]);
      }
      setIsDestModalOpen(false);
    } catch (err) {
      setGeneralNotice({
        title: 'Lỗi khi lưu thông tin địa danh',
        message: err.message || 'Không thể lưu thông tin địa danh vào cơ sở dữ liệu.'
      });
    } finally {
      setIsSavingDest(false);
    }
  };

  const handleDeleteDestination = (id) => {
    const isAi = (typeof id === 'number' && id <= 10) ||
      (typeof id === 'string' && (
        ['DD0001', 'DD0002', 'DD0003', 'DD0004', 'DD0005', 'DD0006', 'DD0007', 'DD0008', 'DD0009', 'DD0010'].includes(id) ||
        (id.startsWith('DD00') && parseInt(id.replace('DD', ''), 10) <= 10) ||
        (parseInt(id, 10) <= 10)
      ));

    const targetDest = destinations.find(d => String(d.id) === String(id)) || {
      id,
      name: `Địa danh #${id}`,
    };

    if (isAi) {
      setAiProtectedDest(targetDest);
      return;
    }

    setDestToDelete(targetDest);
  };

  const handleConfirmDeleteDestination = async () => {
    if (!destToDelete) return;
    try {
      setIsDeletingDest(true);
      await api.admin.deleteLocation(destToDelete.id);
      setDestinations(prev => prev.filter(d => String(d.id) !== String(destToDelete.id)));
      setDestToDelete(null);
    } catch (err) {
      setGeneralNotice({
        title: 'Không thể xóa địa danh',
        message: err.message || 'Đã xảy ra lỗi khi xóa địa danh khỏi hệ thống.'
      });
    } finally {
      setIsDeletingDest(false);
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
      setGeneralNotice({
        title: 'Thông tin chưa đầy đủ',
        message: 'Vui lòng nhập tên điểm tham quan.'
      });
      return;
    }
    if (!checkInForm.locationId) {
      setGeneralNotice({
        title: 'Thông tin chưa đầy đủ',
        message: 'Vui lòng chọn địa danh trực thuộc cho điểm tham quan.'
      });
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
      setGeneralNotice({
        title: 'Lỗi khi lưu điểm check-in',
        message: err.message || 'Đã xảy ra lỗi khi lưu thông tin điểm tham quan.'
      });
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
      setGeneralNotice({
        title: 'Không thể xóa điểm check-in',
        message: err.message || 'Đã xảy ra lỗi khi xóa điểm tham quan khỏi hệ thống.'
      });
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
      soSao: 5.0,
      diemNoiBat: '',
      diaChi: '',
      viDo: '',
      kinhDo: '',
      price: 1500000,
      donViTinh: '/đêm',
      affiliateUrl: 'https://www.agoda.com',
      moTa: '',
      image: '/images/vinh_ha_long.jpg',
      mediaList: [],
      maLoaiHinhList: ['LH0004'],
      tienNghiList: [
        { maTienNghi: 'TN0001', ten: 'Hồ bơi vô cực view biển/núi', ghiChu: '', thuTu: 1 },
        { maTienNghi: 'TN0002', ten: 'Spa & Trị liệu thảo mộc', ghiChu: '', thuTu: 2 },
      ],
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = async (service) => {
    setEditingService(service);
    const initialMedia = (service.image && !service.image.startsWith('blob:'))
      ? [{ url: service.image, type: 'image', thuTu: 1 }]
      : [];

    const initialCategories = Array.isArray(service.maLoaiHinhList) && service.maLoaiHinhList.length > 0
      ? service.maLoaiHinhList
      : (Array.isArray(service.tags)
          ? service.tags.map((t) => {
              const found = allCategories.find((c) => c.ten === t || c.maLoaiHinh === t);
              return found ? found.maLoaiHinh : (t && String(t).startsWith('LH') ? t : null);
            }).filter(Boolean)
          : ['LH0004']);

    const initialAmenities = Array.isArray(service.tienNghiList) && service.tienNghiList.length > 0
      ? service.tienNghiList.map((tn, idx) => {
          if (typeof tn === 'object' && tn !== null) {
            return {
              maTienNghi: tn.maTienNghi || tn.matiennghi,
              ten: tn.ten || '',
              ghiChu: tn.ghiChu || tn.ghichu || '',
              thuTu: tn.thuTu || tn.thutu || idx + 1,
            };
          }
          const found = allAmenities.find((am) => am.ten === tn || am.maTienNghi === tn);
          return {
            maTienNghi: found ? found.maTienNghi : (String(tn).startsWith('TN') ? tn : null),
            ten: found ? found.ten : tn,
            ghiChu: '',
            thuTu: idx + 1,
          };
        })
      : (Array.isArray(service.coreAmenities)
          ? service.coreAmenities.map((a, idx) => {
              const aName = typeof a === 'string' ? a : a.ten;
              const found = allAmenities.find((am) => am.ten === aName || am.maTienNghi === aName);
              return {
                maTienNghi: found ? found.maTienNghi : (aName && String(aName).startsWith('TN') ? aName : null),
                ten: found ? found.ten : aName,
                ghiChu: typeof a === 'object' ? (a.ghiChu || a.ghichu || '') : '',
                thuTu: idx + 1,
              };
            })
          : [
              { maTienNghi: 'TN0001', ten: 'Hồ bơi vô cực view biển/núi', ghiChu: '', thuTu: 1 },
              { maTienNghi: 'TN0002', ten: 'Spa & Trị liệu thảo mộc', ghiChu: '', thuTu: 2 },
            ]);

    setServiceForm({
      id: service.id,
      name: service.name || '',
      locationId: service.locationId || destinations[0]?.id || 'DD0001',
      soSao: service.soSao || 5.0,
      diemNoiBat: service.diemNoiBat || '',
      diaChi: service.diaChi || '',
      viDo: service.viDo !== undefined && service.viDo !== null ? service.viDo : '',
      kinhDo: service.kinhDo !== undefined && service.kinhDo !== null ? service.kinhDo : '',
      price: service.giaThamKhao || (parseInt(String(service.price).replace(/\D/g, ''), 10) || 1500000),
      donViTinh: service.donViTinh || '/đêm',
      affiliateUrl: service.affiliateUrl || service.bookingUrl || 'https://www.agoda.com',
      moTa: service.moTa || '',
      image: service.image || '/images/vinh_ha_long.jpg',
      mediaList: initialMedia,
      maLoaiHinhList: initialCategories,
      tienNghiList: initialAmenities,
    });
    setIsServiceModalOpen(true);

    try {
      const detail = await api.hotels.getById(service.id);
      if (detail) {
        const fullMedia = Array.isArray(detail.media) && detail.media.length > 0
          ? detail.media.map((m, idx) => ({
              url: m.url,
              type: m.type || 'image',
              thuTu: m.thuTu || idx + 1,
            }))
          : initialMedia;

        const detailLoaiHinh = Array.isArray(detail.maLoaiHinh) && detail.maLoaiHinh.length > 0
          ? detail.maLoaiHinh
          : (Array.isArray(detail.loaiHinh)
              ? detail.loaiHinh.map((name) => {
                  const found = allCategories.find((c) => c.ten === name || c.maLoaiHinh === name);
                  return found ? found.maLoaiHinh : (name && String(name).startsWith('LH') ? name : null);
                }).filter(Boolean)
              : initialCategories);

        const detailTienNghi = Array.isArray(detail.tienNghi) && detail.tienNghi.length > 0
          ? detail.tienNghi.map((tn, idx) => ({
              maTienNghi: tn.maTienNghi || tn.matiennghi,
              ten: tn.ten || '',
              ghiChu: tn.ghiChu || tn.ghichu || '',
              thuTu: tn.thuTu || tn.thutu || idx + 1,
            }))
          : initialAmenities;

        setServiceForm((prev) => ({
          ...prev,
          name: detail.ten || prev.name,
          locationId: detail.maDiaDiem || prev.locationId,
          soSao: detail.soSao || prev.soSao,
          diemNoiBat: detail.diemNoiBat || prev.diemNoiBat,
          diaChi: detail.diaChi || prev.diaChi,
          viDo: detail.viDo !== undefined && detail.viDo !== null ? detail.viDo : prev.viDo,
          kinhDo: detail.kinhDo !== undefined && detail.kinhDo !== null ? detail.kinhDo : prev.kinhDo,
          price: detail.giaThamKhao || prev.price,
          donViTinh: detail.donViTinh || prev.donViTinh,
          affiliateUrl: detail.bookingUrl || prev.affiliateUrl,
          moTa: detail.moTa || prev.moTa,
          image: fullMedia[0]?.url || prev.image,
          mediaList: fullMedia,
          maLoaiHinhList: detailLoaiHinh.length > 0 ? detailLoaiHinh : prev.maLoaiHinhList,
          tienNghiList: detailTienNghi.length > 0 ? detailTienNghi : prev.tienNghiList,
        }));
      }
    } catch (err) {
      console.warn('Không thể tải chi tiết khách sạn:', err);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.name.trim()) {
      setGeneralNotice({
        title: 'Thông tin chưa đầy đủ',
        message: 'Vui lòng nhập tên khách sạn / resort.',
      });
      return;
    }
    if (!serviceForm.locationId) {
      setGeneralNotice({
        title: 'Thông tin chưa đầy đủ',
        message: 'Vui lòng chọn địa danh trực thuộc cho khách sạn.',
      });
      return;
    }

    try {
      setIsSavingService(true);

      const mediaItems = Array.isArray(serviceForm.mediaList) && serviceForm.mediaList.length > 0
        ? serviceForm.mediaList
        : (serviceForm.image && !serviceForm.image.startsWith('blob:') ? [{ url: serviceForm.image, type: 'image' }] : []);

      const resolvedMediaList = [];
      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        let mediaUrl = item.url;
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

      if (resolvedMediaList.length === 0 && serviceForm.image && !serviceForm.image.startsWith('blob:')) {
        resolvedMediaList.push({
          mediaUrl: serviceForm.image,
          mediaType: 'image',
          thuTu: 1,
        });
      }

      const primaryImageUrl = resolvedMediaList[0]?.mediaUrl || (serviceForm.image && !serviceForm.image.startsWith('blob:') ? serviceForm.image : '/images/vinh_ha_long.jpg');
      const locObj = destinations.find((d) => String(d.id) === String(serviceForm.locationId));

      const numericPrice = typeof serviceForm.price === 'number'
        ? serviceForm.price
        : (parseInt(String(serviceForm.price).replace(/\D/g, ''), 10) || 1500000);

      const cleanMaLoaiHinhList = (serviceForm.maLoaiHinhList || []).map((lh) => {
        const raw = typeof lh === 'object' && lh !== null ? (lh.maLoaiHinh || lh.id) : lh;
        if (typeof raw === 'string' && !raw.startsWith('LH')) {
          const found = allCategories.find((c) => c.ten === raw || c.maLoaiHinh === raw);
          return found ? found.maLoaiHinh : null;
        }
        return raw;
      }).filter(Boolean);

      const cleanTienNghiList = (serviceForm.tienNghiList || []).map((tn, idx) => {
        const ten = typeof tn === 'object' && tn !== null ? (tn.ten || tn.name || '') : tn;
        const maTn = typeof tn === 'object' && tn !== null ? (tn.maTienNghi || tn.id || null) : (String(tn).startsWith('TN') ? tn : null);
        const ghiChu = typeof tn === 'object' && tn !== null ? (tn.ghiChu || tn.ghichu || '') : '';
        const thuTu = typeof tn === 'object' && tn !== null ? (tn.thuTu || idx + 1) : idx + 1;
        const icon = typeof tn === 'object' && tn !== null ? (tn.icon || 'sparkles') : 'sparkles';

        if (maTn && String(maTn).startsWith('TN')) {
          return { maTienNghi: maTn, ten, ghiChu, thuTu, icon };
        }
        if (ten) {
          const found = allAmenities.find((a) => a.ten === ten || a.maTienNghi === ten);
          return {
            maTienNghi: found ? found.maTienNghi : null,
            ten: found ? found.ten : ten,
            ghiChu,
            thuTu,
            icon: found ? found.icon : icon,
          };
        }
        return null;
      }).filter(Boolean);

      const payload = {
        maDiaDiem: serviceForm.locationId,
        ten: serviceForm.name.trim(),
        soSao: parseFloat(serviceForm.soSao) || 5.0,
        moTa: serviceForm.moTa || '',
        viDo: serviceForm.viDo ? parseFloat(serviceForm.viDo) : null,
        kinhDo: serviceForm.kinhDo ? parseFloat(serviceForm.kinhDo) : null,
        diaChi: serviceForm.diaChi || '',
        giaThamKhao: numericPrice,
        diemNoiBat: serviceForm.diemNoiBat || '',
        donViTinh: serviceForm.donViTinh || '/đêm',
        bookingUrl: serviceForm.affiliateUrl || 'https://www.agoda.com',
        maLoaiHinhList: cleanMaLoaiHinhList,
        tienNghiList: cleanTienNghiList,
        mediaList: resolvedMediaList,
      };

      const matchedCatNames = allCategories
        .filter((c) => cleanMaLoaiHinhList.includes(c.maLoaiHinh))
        .map((c) => c.ten);

      const matchedAmenNames = cleanTienNghiList
        .map((t) => t.ten)
        .filter(Boolean);

      if (editingService) {
        const updateRes = await api.admin.updateHotel(editingService.id, payload);
        const updatedDetail = updateRes?.data;
        const savedMedia = (updatedDetail?.media && updatedDetail.media.length > 0)
          ? updatedDetail.media.map((m, idx) => ({ url: m.url, type: m.type || 'image', thuTu: m.thuTu || idx + 1 }))
          : resolvedMediaList.map(m => ({ url: m.mediaUrl, type: m.mediaType, thuTu: m.thuTu }));
        const finalPrimaryImage = savedMedia[0]?.url || primaryImageUrl;

        setServices((prev) =>
          prev.map((s) =>
            String(s.id) === String(editingService.id)
              ? {
                  ...s,
                  name: payload.ten,
                  locationId: payload.maDiaDiem,
                  locationName: locObj ? locObj.name : s.locationName,
                  soSao: payload.soSao,
                  rating: payload.soSao,
                  moTa: payload.moTa,
                  viDo: payload.viDo,
                  kinhDo: payload.kinhDo,
                  diaChi: payload.diaChi,
                  giaThamKhao: payload.giaThamKhao,
                  price: new Intl.NumberFormat('vi-VN').format(payload.giaThamKhao) + 'đ',
                  donViTinh: payload.donViTinh,
                  diemNoiBat: payload.diemNoiBat,
                  affiliateUrl: payload.bookingUrl,
                  image: finalPrimaryImage,
                  mediaList: savedMedia,
                  maLoaiHinhList: cleanMaLoaiHinhList,
                  tags: matchedCatNames.length > 0 ? matchedCatNames : s.tags,
                  tienNghiList: cleanTienNghiList,
                  coreAmenities: matchedAmenNames.length > 0 ? matchedAmenNames : s.coreAmenities,
                }
              : s
          )
        );
      } else {
        const res = await api.admin.createHotel(payload);
        const createdDetail = res?.data;
        const createdId = createdDetail?.maKhachSan || `KS${String(services.length + 1).padStart(4, '0')}`;
        const savedMedia = (createdDetail?.media && createdDetail.media.length > 0)
          ? createdDetail.media.map((m, idx) => ({ url: m.url, type: m.type || 'image', thuTu: m.thuTu || idx + 1 }))
          : resolvedMediaList.map(m => ({ url: m.mediaUrl, type: m.mediaType, thuTu: m.thuTu }));
        const finalPrimaryImage = savedMedia[0]?.url || primaryImageUrl;

        const newHot = {
          id: createdId,
          name: payload.ten,
          locationId: payload.maDiaDiem,
          locationName: locObj ? locObj.name : (destinations[0]?.name || ''),
          soSao: payload.soSao,
          rating: payload.soSao,
          soDanhGia: 0,
          moTa: payload.moTa,
          viDo: payload.viDo,
          kinhDo: payload.kinhDo,
          diaChi: payload.diaChi,
          giaThamKhao: payload.giaThamKhao,
          price: new Intl.NumberFormat('vi-VN').format(payload.giaThamKhao) + 'đ',
          donViTinh: payload.donViTinh,
          diemNoiBat: payload.diemNoiBat,
          affiliateUrl: payload.bookingUrl,
          image: finalPrimaryImage,
          mediaList: savedMedia,
          maLoaiHinhList: cleanMaLoaiHinhList,
          tags: matchedCatNames.length > 0 ? matchedCatNames : ['Nghỉ dưỡng'],
          tienNghiList: cleanTienNghiList,
          coreAmenities: matchedAmenNames.length > 0 ? matchedAmenNames : ['Hồ bơi vô cực view biển/núi'],
          status: 'Active',
        };
        setServices((prev) => [newHot, ...prev]);
      }
      setIsServiceModalOpen(false);
    } catch (err) {
      setGeneralNotice({
        title: 'Lỗi khi lưu thông tin khách sạn',
        message: err.message || 'Không thể lưu thông tin khách sạn vào cơ sở dữ liệu.',
      });
    } finally {
      setIsSavingService(false);
    }
  };

  const handleDeleteService = (id) => {
    const target = services.find(s => String(s.id) === String(id));
    if (target) {
      setServiceToDelete(target);
    }
  };

  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      setIsDeletingService(true);
      await api.admin.deleteHotel(serviceToDelete.id);
      setServices(prev => prev.filter(s => String(s.id) !== String(serviceToDelete.id)));
      setServiceToDelete(null);
    } catch (err) {
      setGeneralNotice({
        title: 'Không thể xóa khách sạn / dịch vụ',
        message: err.message || 'Đã xảy ra lỗi khi xóa khách sạn khỏi hệ thống.'
      });
    } finally {
      setIsDeletingService(false);
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
      setGeneralNotice({
        title: 'Lỗi khi cập nhật kiểm duyệt',
        message: err.message || 'Không thể thay đổi trạng thái kiểm duyệt của đánh giá này.'
      });
    }
  };

  const handleDeleteReview = (reviewId) => {
    const rev = reviews.find(r => String(r.id) === String(reviewId));
    if (rev) {
      setReviewToDelete(rev);
    }
  };

  const handleConfirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeletingReview(true);
      await api.admin.deleteReview(reviewToDelete.targetType || 'hotel', reviewToDelete.id);
      setReviews(prev => prev.filter(r => String(r.id) !== String(reviewToDelete.id)));
      setReviewToDelete(null);
    } catch (err) {
      setGeneralNotice({
        title: 'Không thể xóa đánh giá',
        message: err.message || 'Đã xảy ra lỗi khi xóa đánh giá của người dùng.'
      });
    } finally {
      setIsDeletingReview(false);
    }
  };

  // ================= 5. XỬ LÝ NGƯỜI DÙNG & KHÓA TÀI KHOẢN =================
  const handleToggleUserBan = (userIdOrUser) => {
    const targetUser = typeof userIdOrUser === 'object' && userIdOrUser !== null
      ? userIdOrUser
      : users.find(u => String(u.id) === String(userIdOrUser));
    if (!targetUser) return;

    if (targetUser.role === 'Admin') {
      setAdminProtectedNotice(true);
      return;
    }

    setUserToToggle(targetUser);
  };

  const handleConfirmToggleUserBan = async () => {
    if (!userToToggle) return;
    try {
      setIsTogglingUser(true);
      const nextStatus = userToToggle.status === 'Active' ? 'Banned' : 'Active';
      await api.admin.updateUserStatus(userToToggle.id, nextStatus);
      setUsers(prev => prev.map(u => String(u.id) === String(userToToggle.id) ? { ...u, status: nextStatus } : u));
      setUserToToggle(null);
    } catch (err) {
      setGeneralNotice({
        title: 'Cập nhật trạng thái người dùng thất bại',
        message: err.message || 'Không thể thay đổi trạng thái hoạt động của tài khoản này.'
      });
    } finally {
      setIsTogglingUser(false);
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
            stats={stats}
            destinationsCount={destinations.length}
            servicesCount={services.length}
            reviewsCount={reviews.length}
            reviewsAverageRating={reviewsAverageRating}
            flaggedReviewsCount={flaggedReviewsCount}
            usersCount={users.length}
            bannedUsersCount={bannedUsersCount}
          />

          {isDataLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
              <Loader2 className="w-9 h-9 text-sky-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">Đang đồng bộ dữ liệu từ Cơ sở dữ liệu...</p>
              <p className="text-xs text-slate-400 mt-1">Đang tải danh mục địa danh, dịch vụ và thành viên</p>
            </div>
          ) : (
            <>
              {/* TAB 1: 10 Địa danh */}
              {activeTab === 'destinations' && (
                <DestinationsTab
                  destinations={destinations.filter(d => {
                    const q = searchQuery.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (d.name && d.name.toLowerCase().includes(q)) ||
                      (d.province && d.province.toLowerCase().includes(q)) ||
                      (d.danhHieu && d.danhHieu.toLowerCase().includes(q)) ||
                      (d.category && d.category.toLowerCase().includes(q)) ||
                      (Array.isArray(d.categories) && d.categories.some(c => c && c.toLowerCase().includes(q))) ||
                      (d.id && String(d.id).toLowerCase().includes(q))
                    );
                  })}
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

              {/* TAB 3: Khách sạn */}
              {activeTab === 'services' && (
                <ServicesTab
                  services={services}
                  destinations={destinations}
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
            </>
          )}
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
        availableCategories={allCategories}
        availableAmenities={allAmenities}
        onSave={handleSaveService}
        isSaving={isSavingService}
      />

      {/* POPUP XÁC NHẬN XÓA ĐIỂM CHECK-IN */}
      {spotToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
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

      {/* 1. MODAL BẢO VỆ 10 ĐỊA DANH GỐC AI RESNET50 */}
      {aiProtectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldAlert className="w-7 h-7 text-amber-600" />
            </div>

            {/* Title & Badge */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200/60 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Mô hình AI ResNet50 Bảo Vệ</span>
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Không thể xóa địa danh gốc
              </h3>
            </div>

            {/* Target Destination Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-4 flex items-center gap-3.5">
              {aiProtectedDest.image && (
                <img
                  src={aiProtectedDest.image}
                  alt={aiProtectedDest.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/vinh_ha_long.jpg';
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                    #{aiProtectedDest.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {aiProtectedDest.province || 'Việt Nam'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-base mt-0.5 truncate">
                  {aiProtectedDest.name}
                </h4>
              </div>
            </div>

            {/* Polite message body */}
            <div className="space-y-2 text-sm text-slate-600 leading-relaxed mb-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/80">
              <p>
                Địa danh <span className="font-semibold text-slate-900">"{aiProtectedDest.name}"</span> thuộc danh mục <span className="font-semibold text-slate-900">10 điểm đến gốc cốt lõi</span> gắn liền trực tiếp với bộ trọng số mô hình thị giác máy tính AI ResNet50.
              </p>
              <p className="text-xs text-slate-500">
                Để bảo đảm hệ thống nhận diện hình ảnh hoạt động chính xác và nhất quán, hệ thống bảo lưu địa danh này và chỉ cho phép cập nhật thông tin mô tả, tọa độ và hình ảnh, không cho phép xóa khỏi cơ sở dữ liệu.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => setAiProtectedDest(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-all text-center"
              >
                Đã hiểu
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = aiProtectedDest;
                  setAiProtectedDest(null);
                  handleOpenEditDest(target);
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-md shadow-sky-200 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Chỉnh sửa địa danh này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL XÁC NHẬN XÓA ĐỊA DANH MỞ RỘNG */}
      {destToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Xác nhận xóa địa danh
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa địa danh du lịch mở rộng <span className="font-semibold text-slate-800">"{destToDelete.name}"</span> (#{destToDelete.id})? Toàn bộ dữ liệu điểm check-in và khách sạn liên quan cũng sẽ bị ảnh hưởng.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDestToDelete(null)}
                disabled={isDeletingDest}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDestination}
                disabled={isDeletingDest}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2"
              >
                {isDeletingDest ? (
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

      {/* 3. MODAL XÁC NHẬN XÓA KHÁCH SẠN */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Xác nhận xóa khách sạn
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa khách sạn <span className="font-semibold text-slate-800">"{serviceToDelete.name}"</span> (#{serviceToDelete.id}) khỏi danh mục hệ thống?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                disabled={isDeletingService}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteService}
                disabled={isDeletingService}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2"
              >
                {isDeletingService ? (
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

      {/* 4. MODAL XÁC NHẬN XÓA ĐÁNH GIÁ, BÌNH LUẬN */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Xác nhận xóa đánh giá, bình luận
            </h3>
            <p className="text-sm text-slate-500 text-center mb-4 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá, bình luận của người dùng <span className="font-semibold text-slate-800">"{reviewToDelete.userName}"</span>?
            </p>
            {reviewToDelete.comment && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 italic line-clamp-3 mb-6">
                "{reviewToDelete.comment}"
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={isDeletingReview}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReview}
                disabled={isDeletingReview}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2"
              >
                {isDeletingReview ? (
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

      {/* 5. MODAL XÁC NHẬN KHÓA / MỞ KHÓA TÀI KHOẢN */}
      {userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              userToToggle.status === 'Active'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {userToToggle.status === 'Active' ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              {userToToggle.status === 'Active' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              {userToToggle.status === 'Active' ? (
                <>
                  Bạn có chắc chắn muốn khóa tài khoản thành viên <span className="font-semibold text-slate-800">"{userToToggle.name}"</span> ({userToToggle.email})? Người dùng này sẽ không thể đăng nhập vào hệ thống.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn mở khóa cho tài khoản thành viên <span className="font-semibold text-slate-800">"{userToToggle.name}"</span> ({userToToggle.email})? Người dùng sẽ có thể đăng nhập bình thường.
                </>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setUserToToggle(null)}
                disabled={isTogglingUser}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleUserBan}
                disabled={isTogglingUser}
                className={`px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-md transition-all flex items-center gap-2 ${
                  userToToggle.status === 'Active'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                }`}
              >
                {isTogglingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <span>{userToToggle.status === 'Active' ? 'Xác nhận khóa' : 'Xác nhận mở khóa'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL BẢO VỆ TÀI KHOẢN ADMIN */}
      {adminProtectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Tài khoản Quản trị viên được bảo vệ
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Không thể thực hiện thao tác khóa tài khoản đối với Quản trị viên khác (Admin) để đảm bảo quyền quản trị hệ thống không bị gián đoạn.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAdminProtectedNotice(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm transition-all"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL THÔNG BÁO HỆ THỐNG / CẢNH BÁO */}
      {generalNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              {generalNotice.title || 'Thông báo hệ thống'}
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              {generalNotice.message}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setGeneralNotice(null)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
