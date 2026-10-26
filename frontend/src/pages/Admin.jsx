import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Users, 
  BarChart3, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Filter, 
  X, 
  Save, 
  Eye, 
  Image as ImageIcon,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Home,
  LogOut,
  Bell,
  Cpu,
  Layers,
  Menu,
  Star,
  Check,
  Camera,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. DỮ LIỆU BAN ĐẦU: 10 ĐỊA DANH TIÊU BIỂU (ResNet50 Classes)
const INITIAL_DESTINATIONS = [
  { id: 1, name: 'Vịnh Hạ Long', province: 'Quảng Ninh', category: 'Thiên nhiên kỳ quan', rating: 4.9, image: '/images/vinh_ha_long.jpg', totalHotels: 14, status: 'Active' },
  { id: 2, name: 'Tràng An', province: 'Ninh Bình', category: 'Di sản thế giới kép', rating: 4.8, image: '/images/trang_an.jpg', totalHotels: 9, status: 'Active' },
  { id: 3, name: 'Phố Cổ Hội An', province: 'Quảng Nam', category: 'Văn hóa cổ kính', rating: 4.9, image: '/images/hoi_an.jpg', totalHotels: 18, status: 'Active' },
  { id: 4, name: 'Cầu Vàng', province: 'Đà Nẵng', category: 'Điểm nhấn kiến trúc', rating: 4.7, image: '/images/cau_vang.jpg', totalHotels: 12, status: 'Active' },
  { id: 5, name: 'Đỉnh Fansipan', province: 'Sapa, Lào Cai', category: 'Khám phá mạo hiểm', rating: 4.8, image: '/images/fansipan.jpg', totalHotels: 11, status: 'Active' },
  { id: 6, name: 'Chợ Nổi Cái Răng', province: 'Cần Thơ', category: 'Văn hóa miền Tây', rating: 4.6, image: '/images/cho_noi.jpg', totalHotels: 7, status: 'Active' },
  { id: 7, name: 'Phú Quốc', province: 'Kiên Giang', category: 'Nghỉ dưỡng biển', rating: 4.9, image: '/images/phu_quoc.jpg', totalHotels: 25, status: 'Active' },
  { id: 8, name: 'Hồ Xuân Hương', province: 'Đà Lạt', category: 'Thành phố ngàn hoa', rating: 4.7, image: '/images/ho_xuan_huong.jpg', totalHotels: 16, status: 'Active' },
  { id: 9, name: 'Mũi Né', province: 'Bình Thuận', category: 'Nắng vàng biển xanh', rating: 4.6, image: '/images/mui_ne.jpg', totalHotels: 13, status: 'Active' },
  { id: 10, name: 'Hồ Hoàn Kiếm', province: 'Hà Nội', category: 'Nghìn năm văn hiến', rating: 4.8, image: '/images/ho_hoan_kiem.jpg', totalHotels: 22, status: 'Active' }
];

// 2. DỮ LIỆU BAN ĐẦU: KHÁCH SẠN & DỊCH VỤ NGHỈ DƯỠNG (Demo concept nghỉ dưỡng, hồ bơi, affiliate redirect)
const INITIAL_SERVICES = [
  {
    id: 1,
    name: 'Yoko Onsen Quang Hanh',
    locationId: 1,
    locationName: 'Vịnh Hạ Long',
    tags: ['Nghỉ dưỡng', 'Thiên nhiên'],
    price: '1.450.000đ',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=600&auto=format&fit=crop',
    coreAmenities: ['Hồ bơi khoáng nóng tự nhiên Onsen', 'Xông hơi đá muối Himalaya', 'Trị liệu dưỡng sinh'],
    affiliateUrl: 'https://www.agoda.com/yoko-onsen-quang-hanh',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Halong Bay Luxury Suite Boutique & Cruise',
    locationId: 1,
    locationName: 'Vịnh Hạ Long',
    tags: ['Nghỉ dưỡng', 'Khám phá'],
    price: '4.200.000đ',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600&auto=format&fit=crop',
    coreAmenities: ['Hồ bơi vô cực trên boong tàu', 'Bồn tắm gỗ pơ-mu ngâm thảo dược', 'Sân thiền Taichi đón bình minh'],
    affiliateUrl: 'https://www.booking.com/halong-luxury-cruise',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Emeralda Resort Tam Cốc',
    locationId: 2,
    locationName: 'Tràng An',
    tags: ['Nghỉ dưỡng', 'Văn hóa'],
    price: '2.350.000đ',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?q=80&w=600&auto=format&fit=crop',
    coreAmenities: ['Hồ bơi ngoài trời nhìn ra rặng núi đá', 'Vườn thảo mộc hữu cơ', 'Spa trị liệu cổ truyền'],
    affiliateUrl: 'https://www.agoda.com/emeralda-tam-coc',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Anantara Hoi An Resort',
    locationId: 3,
    locationName: 'Phố Cổ Hội An',
    tags: ['Nghỉ dưỡng', 'Văn hóa'],
    price: '3.800.000đ',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
    coreAmenities: ['Hồ bơi ven sông Thu Bồn', 'Lớp học yoga & thiền định sáng sớm', 'Trà chiều thư giãn'],
    affiliateUrl: 'https://www.booking.com/anantara-hoi-an',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Topas Ecolodge Sapa',
    locationId: 5,
    locationName: 'Đỉnh Fansipan',
    tags: ['Khám phá', 'Thiên nhiên', 'Nghỉ dưỡng'],
    price: '5.100.000đ',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
    coreAmenities: ['Bể bơi vô cực nước nóng giữa lưng chừng mây', 'Chòi xông hơi lá thuốc người Dao', 'Tắm nắng ngắm ruộng bậc thang'],
    affiliateUrl: 'https://www.agoda.com/topas-ecolodge',
    status: 'Active'
  }
];

// 3. DỮ LIỆU BAN ĐẦU: ĐIỂM THAM QUAN / CHECK-IN CON (Trực thuộc địa danh gốc)
const INITIAL_CHECKIN_SPOTS = [
  {
    id: 1,
    name: 'Tuyến tham quan số 2 (Hang Sửng Sốt)',
    locationId: 1,
    locationName: 'Vịnh Hạ Long',
    desc: 'Hang động rộng lớn và đẹp bậc nhất Vịnh Hạ Long với hệ thống thạch nhũ kỳ ảo đa dạng hàng triệu năm.',
    image: 'https://images.unsplash.com/photo-1550417937-293e545fc11c?q=80&w=600&auto=format&fit=crop',
    ticketPrice: 'Đã gồm trong vé tuyến 250.000đ',
    bestTime: '08:00 - 16:30'
  },
  {
    id: 2,
    name: 'Đảo Ti Tốp (Vọng cảnh 360°)',
    locationId: 1,
    locationName: 'Vịnh Hạ Long',
    desc: 'Sở hữu bãi tắm cát trắng mịn màng hình vầng trăng khuyết và lầu vọng cảnh tuyệt đẹp nhìn trọn vịnh.',
    image: 'https://images.unsplash.com/photo-1579899144883-790100f91fc8?q=80&w=600&auto=format&fit=crop',
    ticketPrice: 'Miễn phí kèm vé tàu',
    bestTime: '09:00 - 17:00'
  },
  {
    id: 3,
    name: 'Làng chài Cửa Vạn',
    locationId: 1,
    locationName: 'Vịnh Hạ Long',
    desc: 'Trải nghiệm cuộc sống thanh bình của ngư dân vùng biển với những ngôi nhà nổi rực rỡ.',
    image: 'https://images.unsplash.com/photo-1576081498877-33a82773229b?q=80&w=600&auto=format&fit=crop',
    ticketPrice: 'Miễn phí',
    bestTime: '07:00 - 16:00'
  },
  {
    id: 4,
    name: 'Hang Múa',
    locationId: 2,
    locationName: 'Tràng An',
    desc: 'Thử thách chinh phục 486 bậc thang đá trắng ngắm toàn cảnh dòng sông Ngô Đồng và mùa lúa Tam Cốc tuyệt đẹp.',
    image: 'https://images.unsplash.com/photo-1550650422-9df75d714b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ticketPrice: '100.000đ / người',
    bestTime: '06:00 - 18:00'
  },
  {
    id: 5,
    name: 'Chùa Cầu',
    locationId: 3,
    locationName: 'Phố Cổ Hội An',
    desc: 'Biểu tượng lịch sử kiến trúc giao thoa Nhật Bản - Việt Nam vắt ngang nhánh sông Hoài thơ mộng.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop',
    ticketPrice: 'Vé tham quan phố cổ 80.000đ',
    bestTime: 'Mở cả ngày'
  }
];

// 4. DỮ LIỆU BAN ĐẦU: TÀI KHOẢN NGƯỜI DÙNG (Quản lý User & Khóa tài khoản)
const INITIAL_USERS = [
  { id: 1, name: 'Nguyễn Văn An', email: 'vanan@gmail.com', role: 'Member', scansCount: 14, wishlistCount: 6, joinedDate: '15/02/2026', status: 'Active' },
  { id: 2, name: 'Trần Thị Thu Thảo', email: 'thuthao.tran@gmail.com', role: 'Member', scansCount: 28, wishlistCount: 12, joinedDate: '28/02/2026', status: 'Active' },
  { id: 3, name: 'Lê Hoàng Nam (Spam bot)', email: 'bot_scam99@fake.net', role: 'Member', scansCount: 180, wishlistCount: 0, joinedDate: '01/03/2026', status: 'Banned' },
  { id: 4, name: 'Phạm Minh Đức', email: 'ducpham@outlook.com', role: 'Member', scansCount: 8, wishlistCount: 3, joinedDate: '05/03/2026', status: 'Active' },
  { id: 5, name: 'Quản trị viên Hệ Thống', email: 'admin@travelmate.vn', role: 'Admin', scansCount: 42, wishlistCount: 10, joinedDate: '01/01/2026', status: 'Active' }
];

const PREFERENCE_TAGS = ['Thiên nhiên', 'Khám phá', 'Nghỉ dưỡng', 'Văn hóa'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations', 'checkins', 'services', 'users', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // States danh sách
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [checkInSpots, setCheckInSpots] = useState(INITIAL_CHECKIN_SPOTS);
  const [users, setUsers] = useState(INITIAL_USERS);

  // States Modal (Thêm / Sửa địa điểm)
  const [editingDestination, setEditingDestination] = useState(null);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);

  // States Modal (Thêm / Sửa điểm checkin)
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // States Modal (Thêm / Sửa dịch vụ khách sạn)
  const [editingService, setEditingService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Form State cho Điểm checkin
  const [checkInForm, setCheckInForm] = useState({
    name: '',
    locationId: 1,
    desc: '',
    image: '',
    ticketPrice: '',
    bestTime: ''
  });

  // Form State cho Địa danh
  const [destForm, setDestForm] = useState({
    name: '',
    province: '',
    category: '',
    rating: 4.8,
    image: '',
    totalHotels: 0
  });

  // Form State cho Khách sạn / Dịch vụ
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

  // ================= BỘ LỌC TÌM KIẾM =================
  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCheckInSpots = checkInSpots.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= THAO TÁC ĐIỂM CHECK-IN CON =================
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

  // ================= THAO TÁC ĐỊA DANH =================
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

  // ================= THAO TÁC DỊCH VỤ / KHÁCH SẠN =================
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      locationId: destinations[0]?.id || 1,
      tags: ['Nghỉ dưỡng', 'Thiên nhiên'],
      price: '1.500.000đ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
      coreAmenities: 'Hồ bơi vô cực ngoài trời, Khu spa thư giãn, Trị liệu khoáng',
      affiliateUrl: 'https://www.agoda.com'
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      ...service,
      coreAmenities: service.coreAmenities.join(', ')
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

  const toggleTagSelection = (tag) => {
    if (serviceForm.tags.includes(tag)) {
      setServiceForm({ ...serviceForm, tags: serviceForm.tags.filter(t => t !== tag) });
    } else {
      setServiceForm({ ...serviceForm, tags: [...serviceForm.tags, tag] });
    }
  };

  // ================= THAO TÁC NGƯỜI DÙNG & KHÓA TÀI KHOẢN =================
  const handleToggleUserBan = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Banned' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* ================= LEFT SIDEBAR (BLUE THEME) ================= */}
      <aside className={`bg-gradient-to-b from-sky-800 via-sky-700 to-sky-900 text-white flex flex-col justify-between shrink-0 transition-all duration-300 z-40 shadow-xl ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div>
          {/* Logo & Brand Header */}
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 relative">
            {!isSidebarCollapsed ? (
              <>
                <Link to="/" className="flex items-center gap-2.5 text-white hover:text-sky-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0 border border-white/20">
                    <Compass size={22} className="text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold font-heading tracking-wide block leading-none">TravelMate</span>
                    <span className="text-[10px] text-sky-200 font-mono uppercase tracking-wider font-semibold">Admin Portal</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Thu gọn menu"
                >
                  <Menu size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="w-10 h-10 mx-auto rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-md transition-all active:scale-95 group relative border border-white/20"
                title="Mở rộng menu quản trị"
              >
                <Compass size={22} className="text-white group-hover:hidden" />
                <Menu size={20} className="text-white hidden group-hover:block" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <div className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-sky-200/80 ${isSidebarCollapsed ? 'text-center' : ''}`}>
              {isSidebarCollapsed ? '•••' : 'Quản Lý Nghiệp Vụ'}
            </div>

            {/* Tab 1: 10 Địa danh */}
            <button
              onClick={() => { setActiveTab('destinations'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'destinations'
                  ? 'bg-white text-sky-800 shadow-md font-bold'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
              title="10 Địa danh ResNet50"
            >
              <MapPin size={20} className={activeTab === 'destinations' ? 'text-sky-700' : 'text-sky-200'} />
              {!isSidebarCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>10 Địa Danh AI</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                    activeTab === 'destinations' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                  }`}>
                    {destinations.length}
                  </span>
                </div>
              )}
            </button>

            {/* Tab 2: Điểm Check-in */}
            <button
              onClick={() => { setActiveTab('checkins'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'checkins'
                  ? 'bg-white text-sky-800 shadow-md font-bold'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
              title="Điểm Check-in & Tham quan"
            >
              <Camera size={20} className={activeTab === 'checkins' ? 'text-sky-700' : 'text-sky-200'} />
              {!isSidebarCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>Điểm Check-in</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                    activeTab === 'checkins' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                  }`}>
                    {checkInSpots.length}
                  </span>
                </div>
              )}
            </button>

            {/* Tab 3: Khách sạn & Dịch vụ */}
            <button
              onClick={() => { setActiveTab('services'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-white text-sky-800 shadow-md font-bold'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
              title="Khách sạn & Dịch vụ"
            >
              <Hotel size={20} className={activeTab === 'services' ? 'text-sky-700' : 'text-sky-200'} />
              {!isSidebarCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>Khách Sạn &amp; Dịch Vụ</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                    activeTab === 'services' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                  }`}>
                    {services.length}
                  </span>
                </div>
              )}
            </button>

            {/* Tab 3: Người dùng */}
            <button
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-sky-800 shadow-md font-bold'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
              title="Quản lý Người dùng"
            >
              <Users size={20} className={activeTab === 'users' ? 'text-sky-700' : 'text-sky-200'} />
              {!isSidebarCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>Tài Khoản &amp; Phân Quyền</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                    activeTab === 'users' ? 'bg-sky-100 text-sky-800' : 'bg-white/15 text-white'
                  }`}>
                    {users.length}
                  </span>
                </div>
              )}
            </button>

            {/* Tab 4: Thống kê ResNet50 */}
            <button
              onClick={() => { setActiveTab('analytics'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-sky-800 shadow-md font-bold'
                  : 'text-sky-100 hover:text-white hover:bg-white/10'
              }`}
              title="Thống kê ResNet50"
            >
              <BarChart3 size={20} className={activeTab === 'analytics' ? 'text-sky-700' : 'text-sky-200'} />
              {!isSidebarCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span>Thống Kê ResNet50</span>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold ${
                    activeTab === 'analytics' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-400/20 text-emerald-200'
                  }`}>
                    AI
                  </span>
                </div>
              )}
            </button>

            <div className="pt-4 mt-4 border-t border-white/10">
              <div className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-sky-200/80 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                {isSidebarCollapsed ? '•••' : 'Điều Hướng Ngoài'}
              </div>
              <Link
                to="/"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-sky-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Về Trang chủ người dùng"
              >
                <Home size={18} />
                {!isSidebarCollapsed && <span>Trang Chủ Khách</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer User info */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-sky-800 font-bold flex items-center justify-center shrink-0 shadow">
              A
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Admin Quản Trị</p>
                <p className="text-[10px] text-sky-200 truncate">admin@travelmate.vn</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= RIGHT MAIN CONTENT (BRIGHT LIGHT THEME) ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="h-20 bg-white border-b border-slate-200/90 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center gap-2">
              {activeTab === 'destinations' && 'Quản Lý 10 Địa Danh ResNet50'}
              {activeTab === 'checkins' && 'Quản Lý Điểm Check-in & Tham Quan'}
              {activeTab === 'services' && 'Quản Lý Khách Sạn & Dịch Vụ Nghỉ Dưỡng'}
              {activeTab === 'users' && 'Quản Lý Thành Viên & Khóa Tài Khoản'}
              {activeTab === 'analytics' && 'Báo Cáo Dự Đoán & Hiệu Suất ResNet50'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống 3 tầng độc lập: ReactJS • Node.js Express • Microservice ResNet50 Flask
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-xs text-sky-700 font-medium">
              <Cpu size={14} className="text-sky-600" />
              <span>ResNet50: Sẵn sàng</span>
            </div>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Xem Web Khách</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 sm:p-8 space-y-6 flex-1 bg-slate-50">
          {/* Top Metric Cards (Trắng sáng cao cấp) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục Địa danh</span>
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <MapPin size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">{destinations.length} Địa điểm</h3>
              <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1 mt-1">
                Bộ dữ liệu 10 danh lam thắng cảnh
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách sạn nghỉ dưỡng</span>
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                  <Hotel size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">{services.length} Dịch vụ</h3>
              <span className="text-xs text-sky-600 font-medium inline-flex items-center gap-1 mt-1">
                Tiện ích hồ bơi &amp; thư giãn
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Thành viên</span>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Users size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">{users.length} Tài khoản</h3>
              <span className="text-xs text-rose-500 font-medium inline-flex items-center gap-1 mt-1">
                <ShieldAlert size={12} /> {users.filter(u => u.status === 'Banned').length} tài khoản bị khóa
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ chính xác mô hình</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <TrendingUp size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-800 mt-2">98.2%</h3>
              <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 mt-1">
                ResNet50 Top-1 Avg
              </span>
            </div>
          </div>

          {/* ================= TAB 1: 10 ĐỊA DANH ================= */}
          {activeTab === 'destinations' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm địa danh, tỉnh thành..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  />
                </div>

                <button
                  onClick={handleOpenAddDest}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Plus size={18} />
                  <span>Thêm địa danh</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">ID</th>
                      <th className="py-3.5 px-5">Địa danh &amp; Hình ảnh</th>
                      <th className="py-3.5 px-5">Tỉnh / Thành</th>
                      <th className="py-3.5 px-5">Phân loại</th>
                      <th className="py-3.5 px-5">Đánh giá</th>
                      <th className="py-3.5 px-5">Dịch vụ con</th>
                      <th className="py-3.5 px-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDestinations.map((dest) => (
                      <tr key={dest.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                          #{dest.id}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">
                                {dest.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium block">
                                Mã địa danh: #{dest.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-700">
                          {dest.province}
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
                            {dest.category}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-1 text-amber-500">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span>{dest.rating}</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-600">
                          {dest.totalHotels} lưu trú
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/location/${dest.id}`}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Xem trang chi tiết"
                            >
                              <ExternalLink size={16} />
                            </Link>
                            <button
                              onClick={() => handleOpenEditDest(dest)}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDestination(dest.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 2: ĐIỂM CHECK-IN CON ================= */}
          {activeTab === 'checkins' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm tên điểm check-in, địa danh gốc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  />
                </div>

                <button
                  onClick={handleOpenAddCheckIn}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Plus size={18} />
                  <span>Thêm điểm check-in</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">ID</th>
                      <th className="py-3.5 px-5">Điểm Check-in &amp; Hình ảnh</th>
                      <th className="py-3.5 px-5">Thuộc Địa Danh Gốc</th>
                      <th className="py-3.5 px-5">Mô tả nét độc đáo</th>
                      <th className="py-3.5 px-5">Vé tham quan</th>
                      <th className="py-3.5 px-5">Khung giờ đẹp</th>
                      <th className="py-3.5 px-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCheckInSpots.map((spot) => (
                      <tr key={spot.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                          #{spot.id}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={spot.image}
                              alt={spot.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">
                                {spot.name}
                              </span>
                              <span className="text-xs text-sky-600 font-medium inline-flex items-center gap-1">
                                <Navigation size={11} /> Điểm check-in
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100 text-xs">
                            <MapPin size={13} className="text-sky-600" />
                            <span>{spot.locationName}</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 max-w-sm">
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {spot.desc}
                          </p>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-700 whitespace-nowrap text-xs">
                          {spot.ticketPrice}
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                          {spot.bestTime}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditCheckIn(spot)}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Sửa điểm check-in"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCheckIn(spot.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa điểm check-in"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: KHÁCH SẠN & DỊCH VỤ ================= */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm khách sạn, địa danh, thẻ sở thích..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  />
                </div>

                <button
                  onClick={handleOpenAddService}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Plus size={18} />
                  <span>Thêm khách sạn</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">ID</th>
                      <th className="py-3.5 px-5">Tên Dịch Vụ / Khách sạn</th>
                      <th className="py-3.5 px-5">Thuộc Địa Danh</th>
                      <th className="py-3.5 px-5">Thẻ Sở Thích</th>
                      <th className="py-3.5 px-5">Tiện ích thư giãn</th>
                      <th className="py-3.5 px-5">Giá phòng</th>
                      <th className="py-3.5 px-5">Chuyển hướng OTA</th>
                      <th className="py-3.5 px-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                          #{service.id}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">
                                {service.name}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold">
                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                <span>{service.rating}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} className="text-sky-600" />
                            <span>{service.locationName}</span>
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex flex-wrap gap-1">
                            {service.tags.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-5 max-w-xs">
                          <div className="text-xs text-slate-500 line-clamp-2">
                            {service.coreAmenities.join(' • ')}
                          </div>
                        </td>
                        <td className="py-4 px-5 font-bold text-sky-600 whitespace-nowrap">
                          {service.price}
                        </td>
                        <td className="py-4 px-5">
                          <a
                            href={service.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-semibold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100"
                          >
                            <span>Affiliate</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditService(service)}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: NGƯỜI DÙNG & KHÓA TÀI KHOẢN ================= */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm tên, email thành viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Tổng <span className="font-bold text-slate-800">{filteredUsers.length}</span> người dùng
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">ID</th>
                      <th className="py-3.5 px-5">Họ tên &amp; Email</th>
                      <th className="py-3.5 px-5">Vai trò (Role)</th>
                      <th className="py-3.5 px-5">Lượt quét AI</th>
                      <th className="py-3.5 px-5">Yêu thích</th>
                      <th className="py-3.5 px-5">Ngày tạo</th>
                      <th className="py-3.5 px-5">Trạng thái</th>
                      <th className="py-3.5 px-5 text-right">Khóa / Mở khóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                          #{user.id}
                        </td>
                        <td className="py-4 px-5">
                          <div>
                            <span className="font-bold text-slate-800 block">{user.name}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            user.role === 'Admin' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700">
                          {user.scansCount} ảnh
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700">
                          {user.wishlistCount} mục
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-500">
                          {user.joinedDate}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            user.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {user.status === 'Active' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                            <span>{user.status === 'Active' ? 'Hoạt động' : 'Đã khóa'}</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          {user.role !== 'Admin' ? (
                            <button
                              onClick={() => handleToggleUserBan(user.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                                user.status === 'Active'
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                              }`}
                            >
                              {user.status === 'Active' ? (
                                <>
                                  <Lock size={13} />
                                  <span>Khóa tài khoản</span>
                                </>
                              ) : (
                                <>
                                  <Unlock size={13} />
                                  <span>Mở khóa</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Admin Tối Cao</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 4: THỐNG KÊ RESNET50 ================= */}
          {activeTab === 'analytics' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold font-heading text-slate-800">
                    Phân Bố Nhận Diện 10 Danh Thắng ResNet50
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tổng hợp từ các lượt người dùng tải ảnh phong cảnh lên hệ thống
                  </p>
                </div>
                <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold rounded-full">
                  1.482 lượt quét AI
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Vịnh Hạ Long', percentage: 24, count: 356 },
                  { name: 'Tràng An (Ninh Bình)', percentage: 18, count: 267 },
                  { name: 'Phố Cổ Hội An', percentage: 16, count: 237 },
                  { name: 'Cầu Vàng (Đà Nẵng)', percentage: 14, count: 207 },
                  { name: 'Đỉnh Fansipan', percentage: 10, count: 148 },
                  { name: 'Phú Quốc', percentage: 8, count: 118 },
                  { name: 'Các địa danh khác', percentage: 10, count: 149 }
                ].map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.name}</span>
                      <span>{item.count} lượt ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: THÊM / SỬA ĐỊA DANH ================= */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold font-heading text-slate-800">
                {editingDestination ? 'Chỉnh sửa Địa danh' : 'Thêm Địa danh mới'}
              </h3>
              <button
                onClick={() => setIsDestModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tên địa danh (Khớp nhãn ResNet50)
                </label>
                <input
                  type="text"
                  required
                  value={destForm.name}
                  onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Tỉnh / Thành
                  </label>
                  <input
                    type="text"
                    required
                    value={destForm.province}
                    onChange={(e) => setDestForm({ ...destForm, province: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Điểm đánh giá
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={destForm.rating}
                    onChange={(e) => setDestForm({ ...destForm, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Danh mục di sản
                </label>
                <input
                  type="text"
                  required
                  value={destForm.category}
                  onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Đường dẫn ảnh đại diện
                </label>
                <input
                  type="text"
                  required
                  value={destForm.image}
                  onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save size={16} />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM / SỬA KHÁCH SẠN ================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold font-heading text-slate-800">
                {editingService ? 'Chỉnh sửa Khách sạn & Dịch vụ' : 'Thêm Khách sạn mới'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tên Khách sạn / Khu nghỉ dưỡng
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Thuộc địa danh gốc
                  </label>
                  <select
                    value={serviceForm.locationId}
                    onChange={(e) => setServiceForm({ ...serviceForm, locationId: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Giá phòng tham khảo
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Gán thẻ sở thích (Khớp bộ lọc hệ thống)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_TAGS.map((tag) => {
                    const isSelected = serviceForm.tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTagSelection(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{tag}</span>
                        {isSelected && <Check size={13} strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tiện ích thư giãn cốt lõi (Ưu tiên hồ bơi)
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.coreAmenities}
                  onChange={(e) => setServiceForm({ ...serviceForm, coreAmenities: e.target.value })}
                  placeholder="Hồ bơi vô cực ngoài trời, Khu spa thư giãn, Trị liệu..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Đường dẫn liên kết tiếp thị Affiliate (Agoda / Booking.com)
                </label>
                <input
                  type="url"
                  required
                  value={serviceForm.affiliateUrl}
                  onChange={(e) => setServiceForm({ ...serviceForm, affiliateUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Ảnh khách sạn (URL)
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save size={16} />
                  <span>Lưu khách sạn</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM / SỬA ĐIỂM CHECK-IN CON ================= */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold font-heading text-slate-800">
                {editingCheckIn ? 'Chỉnh sửa Điểm Check-in' : 'Thêm Điểm Check-in mới'}
              </h3>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCheckIn} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tên điểm check-in / tham quan
                </label>
                <input
                  type="text"
                  required
                  value={checkInForm.name}
                  onChange={(e) => setCheckInForm({ ...checkInForm, name: e.target.value })}
                  placeholder="Ví dụ: Đảo Ti Tốp, Hang Múa, Chùa Cầu..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Thuộc địa danh gốc
                </label>
                <select
                  value={checkInForm.locationId}
                  onChange={(e) => setCheckInForm({ ...checkInForm, locationId: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Mô tả nét độc đáo & trải nghiệm
                </label>
                <textarea
                  rows="3"
                  required
                  value={checkInForm.desc}
                  onChange={(e) => setCheckInForm({ ...checkInForm, desc: e.target.value })}
                  placeholder="Nét hấp dẫn của điểm check-in này..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Giá vé / Chi phí tham quan
                  </label>
                  <input
                    type="text"
                    required
                    value={checkInForm.ticketPrice}
                    onChange={(e) => setCheckInForm({ ...checkInForm, ticketPrice: e.target.value })}
                    placeholder="Miễn phí hoặc 100.000đ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Thời điểm / Giờ mở cửa
                  </label>
                  <input
                    type="text"
                    required
                    value={checkInForm.bestTime}
                    onChange={(e) => setCheckInForm({ ...checkInForm, bestTime: e.target.value })}
                    placeholder="08:00 - 17:00"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Đường dẫn ảnh đại diện (URL)
                </label>
                <input
                  type="text"
                  required
                  value={checkInForm.image}
                  onChange={(e) => setCheckInForm({ ...checkInForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save size={16} />
                  <span>Lưu điểm check-in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
