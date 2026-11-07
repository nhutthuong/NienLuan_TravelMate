import React, { useState, useEffect } from 'react';
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
  const [destForm, setDestForm] = useState({
    name: '',
    province: '',
    category: '',
    rating: 4.8,
    image: '',
    totalHotels: 0
  });

  // Modals & Form States: Điểm Check-in con
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    name: '',
    locationId: 1,
    desc: '',
    image: '',
    ticketPrice: '',
    bestTime: ''
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

    // 1. Tải danh sách địa danh
    api.locations.getAll()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((loc) => ({
          id: loc.maDiaDiem || loc.id,
          name: loc.ten || loc.tenDiaDiem || loc.name,
          province: loc.tinhThanh || loc.location || '',
          category: (Array.isArray(loc.loaiHinh) && loc.loaiHinh[0]) || loc.theLoai || loc.category || 'Thiên nhiên kỳ quan',
          categories: Array.isArray(loc.loaiHinh) ? loc.loaiHinh : [],
          rating: parseFloat(loc.danhGiaTB || loc.rating || 4.8),
          image: loc.anhUrl || loc.anh_url || loc.hinhAnh || loc.image || '/images/vinh_ha_long.jpg',
          totalHotels: loc.totalHotels || 0,
          totalAttractions: loc.totalAttractions || 0,
          desc: loc.moTa || loc.desc || '',
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
          image: att.anhDaiDien || att.hinhAnh || att.image || '/images/cau_vang.jpg',
          ticketPrice: att.giaVe || att.ticketPrice || 'Miễn phí',
          bestTime: att.gioMoCua || att.bestTime || '08:00 - 17:00',
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
      name: '',
      province: '',
      category: 'Thiên nhiên kỳ quan',
      rating: 4.8,
      image: '/images/vinh_ha_long.jpg',
      totalHotels: 0
    });
    setIsDestModalOpen(true);
  };

  const handleOpenEditDest = (dest) => {
    setEditingDestination(dest);
    setDestForm({ ...dest });
    setIsDestModalOpen(true);
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ten: destForm.name,
        tinhThanh: destForm.province,
        anhUrl: destForm.image || '/images/vinh_ha_long.jpg',
        danhHieu: destForm.category,
        moTa: destForm.desc || `${destForm.name} - ${destForm.province}`,
      };

      if (editingDestination) {
        await api.admin.updateLocation(editingDestination.id, payload);
        setDestinations(prev => prev.map(d => String(d.id) === String(editingDestination.id) ? { ...d, ...destForm } : d));
      } else {
        const res = await api.admin.createLocation(payload);
        const createdId = res?.data?.maDiaDiem || `DD${String(destinations.length + 1).padStart(4, '0')}`;
        const newDest = {
          ...destForm,
          id: createdId,
          status: 'Active',
          totalHotels: 0,
          totalAttractions: 0
        };
        setDestinations(prev => [...prev, newDest]);
      }
      setIsDestModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu thông tin địa danh.');
    }
  };

  const handleDeleteDestination = async (id) => {
    const protectedIds = ['DD0001', 'DD0002', 'DD0003', 'DD0004', 'DD0005', 'DD0006', 'DD0007', 'DD0008', 'DD0009', 'DD0010', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (protectedIds.includes(id) || (typeof id === 'string' && id.startsWith('DD00') && parseInt(id.replace('DD', ''), 10) <= 10)) {
      alert('Không thể xóa 10 địa danh gốc gắn với mô hình nhận diện AI ResNet50 (DD0001 - DD0010)!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa địa điểm du lịch này khỏi danh mục hệ thống?')) {
      try {
        await api.admin.deleteLocation(id);
        setDestinations(prev => prev.filter(d => String(d.id) !== String(id)));
      } catch (err) {
        alert(err.message || 'Không thể xóa địa danh.');
      }
    }
  };

  // ================= 2. XỬ LÝ ĐIỂM CHECK-IN CON =================
  const handleOpenAddCheckIn = () => {
    setEditingCheckIn(null);
    setCheckInForm({
      name: '',
      locationId: destinations[0]?.id || 'DD0001',
      desc: '',
      image: 'https://images.unsplash.com/photo-1550417937-293e545fc11c?q=80&w=600&auto=format&fit=crop',
      ticketPrice: 'Miễn phí',
      bestTime: '08:00 - 17:00'
    });
    setIsCheckInModalOpen(true);
  };

  const handleOpenEditCheckIn = (spot) => {
    setEditingCheckIn(spot);
    setCheckInForm({ ...spot });
    setIsCheckInModalOpen(true);
  };

  const handleSaveCheckIn = async (e) => {
    e.preventDefault();
    const locObj = destinations.find(d => String(d.id) === String(checkInForm.locationId));
    try {
      const payload = {
        maDiaDiem: checkInForm.locationId,
        ten: checkInForm.name,
        moTa: checkInForm.desc,
        giaVe: checkInForm.ticketPrice,
        gioMoCua: checkInForm.bestTime,
        mediaList: checkInForm.image ? [{ mediaUrl: checkInForm.image, mediaType: 'image', thuTu: 1 }] : [],
      };

      if (editingCheckIn) {
        await api.admin.updateAttraction(editingCheckIn.id, payload);
        setCheckInSpots(prev => prev.map(c => String(c.id) === String(editingCheckIn.id) ? {
          ...c,
          ...checkInForm,
          locationName: locObj ? locObj.name : c.locationName
        } : c));
      } else {
        const res = await api.admin.createAttraction(payload);
        const createdId = res?.data?.maDiemTQ || `TQ${String(checkInSpots.length + 1).padStart(4, '0')}`;
        const newSpot = {
          ...checkInForm,
          id: createdId,
          locationName: locObj ? locObj.name : (destinations[0]?.name || 'Vịnh Hạ Long')
        };
        setCheckInSpots(prev => [...prev, newSpot]);
      }
      setIsCheckInModalOpen(false);
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu điểm check-in.');
    }
  };

  const handleDeleteCheckIn = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa điểm check-in này khỏi địa danh?')) {
      try {
        await api.admin.deleteAttraction(id);
        setCheckInSpots(prev => prev.filter(c => String(c.id) !== String(id)));
      } catch (err) {
        alert(err.message || 'Không thể xóa điểm check-in.');
      }
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
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.desc.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAdd={handleOpenAddCheckIn}
              onOpenEdit={handleOpenEditCheckIn}
              onDelete={handleDeleteCheckIn}
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
      />

      <CheckInSpotModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        editingCheckIn={editingCheckIn}
        checkInForm={checkInForm}
        setCheckInForm={setCheckInForm}
        destinations={destinations}
        onSave={handleSaveCheckIn}
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
    </div>
  );
};

export default Admin;
