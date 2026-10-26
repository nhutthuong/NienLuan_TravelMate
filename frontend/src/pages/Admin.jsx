import React, { useState } from 'react';
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

  const handleSaveDestination = (e) => {
    e.preventDefault();
    if (editingDestination) {
      setDestinations(destinations.map(d => d.id === editingDestination.id ? { ...d, ...destForm } : d));
    } else {
      const newDest = {
        ...destForm,
        id: Date.now(),
        status: 'Active'
      };
      setDestinations([...destinations, newDest]);
    }
    setIsDestModalOpen(false);
  };

  const handleDeleteDestination = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa điểm du lịch này khỏi danh mục hệ thống?')) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  // ================= 2. XỬ LÝ ĐIỂM CHECK-IN CON =================
  const handleOpenAddCheckIn = () => {
    setEditingCheckIn(null);
    setCheckInForm({
      name: '',
      locationId: destinations[0]?.id || 1,
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

  const handleSaveCheckIn = (e) => {
    e.preventDefault();
    const locObj = destinations.find(d => d.id === Number(checkInForm.locationId));
    if (editingCheckIn) {
      setCheckInSpots(checkInSpots.map(c => c.id === editingCheckIn.id ? {
        ...c,
        ...checkInForm,
        locationName: locObj ? locObj.name : c.locationName
      } : c));
    } else {
      const newSpot = {
        ...checkInForm,
        id: Date.now(),
        locationName: locObj ? locObj.name : 'Vịnh Hạ Long'
      };
      setCheckInSpots([...checkInSpots, newSpot]);
    }
    setIsCheckInModalOpen(false);
  };

  const handleDeleteCheckIn = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa điểm check-in này khỏi địa danh?')) {
      setCheckInSpots(checkInSpots.filter(c => c.id !== id));
    }
  };

  // ================= 3. XỬ LÝ KHÁCH SẠN & DỊCH VỤ =================
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      locationId: destinations[0]?.id || 1,
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

  const handleSaveService = (e) => {
    e.preventDefault();
    const locObj = destinations.find(d => d.id === Number(serviceForm.locationId));
    const amenitiesArr = serviceForm.coreAmenities.split(',').map(s => s.trim()).filter(Boolean);

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? {
        ...s,
        ...serviceForm,
        locationName: locObj ? locObj.name : s.locationName,
        coreAmenities: amenitiesArr
      } : s));
    } else {
      const newServ = {
        ...serviceForm,
        id: Date.now(),
        locationName: locObj ? locObj.name : 'Vịnh Hạ Long',
        coreAmenities: amenitiesArr,
        status: 'Active'
      };
      setServices([...services, newServ]);
    }
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách sạn / dịch vụ này?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  // ================= 4. XỬ LÝ BÌNH LUẬN & ĐÁNH GIÁ (MỚI) =================
  const handleToggleReviewStatus = (reviewId) => {
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        const nextStatus = r.status === 'Approved' ? 'Flagged' : 'Approved';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này vĩnh viễn?')) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };

  // ================= 5. XỬ LÝ NGƯỜI DÙNG & KHÓA TÀI KHOẢN =================
  const handleToggleUserBan = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Banned' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Metrics helper
  const flaggedReviewsCount = reviews.filter(r => r.status === 'Flagged').length;
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
          {activeTab === 'analytics' && <AnalyticsTab />}
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
