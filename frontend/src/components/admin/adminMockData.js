// DỮ LIỆU MOCK QUẢN TRỊ VIÊN TRAVELMATE

// 1. 10 ĐỊA DANH TIÊU BIỂU (Khớp 10 nhãn ResNet50)
export const INITIAL_DESTINATIONS = [
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

// 2. KHÁCH SẠN & DỊCH VỤ NGHỈ DƯỠNG (Concept nghỉ dưỡng, tiện ích hồ bơi/spa, affiliate redirect)
export const INITIAL_SERVICES = [
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

// 3. ĐIỂM THAM QUAN / CHECK-IN CON (Trực thuộc địa danh gốc)
export const INITIAL_CHECKIN_SPOTS = [
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

// 4. TÀI KHOẢN NGƯỜI DÙNG (Quản lý User & Khóa tài khoản)
export const INITIAL_USERS = [
  { id: 1, name: 'Nguyễn Văn An', email: 'vanan@gmail.com', role: 'Member', scansCount: 14, wishlistCount: 6, joinedDate: '15/02/2026', status: 'Active' },
  { id: 2, name: 'Trần Thị Thu Thảo', email: 'thuthao.tran@gmail.com', role: 'Member', scansCount: 28, wishlistCount: 12, joinedDate: '28/02/2026', status: 'Active' },
  { id: 3, name: 'Lê Hoàng Nam (Spam bot)', email: 'bot_scam99@fake.net', role: 'Member', scansCount: 180, wishlistCount: 0, joinedDate: '01/03/2026', status: 'Banned' },
  { id: 4, name: 'Phạm Minh Đức', email: 'ducpham@outlook.com', role: 'Member', scansCount: 8, wishlistCount: 3, joinedDate: '05/03/2026', status: 'Active' },
  { id: 5, name: 'Quản trị viên Hệ Thống', email: 'admin@travelmate.vn', role: 'Admin', scansCount: 42, wishlistCount: 10, joinedDate: '01/01/2026', status: 'Active' }
];

// 5. ĐÁNH GIÁ & BÌNH LUẬN (Khách sạn DanhGiaKhachSan & Điểm tham quan DanhGiaDiemTQ)
export const INITIAL_REVIEWS = [
  {
    id: 1,
    targetType: 'hotel', // 'hotel' | 'attraction'
    targetId: 1,
    targetName: 'Yoko Onsen Quang Hanh',
    locationName: 'Vịnh Hạ Long',
    userName: 'Trần Thị Thu Thảo',
    userEmail: 'thuthao.tran@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5.0,
    comment: 'Không gian khoáng nóng Onsen chuẩn phong cách Nhật Bản rất thư thái. Hồ bơi nước nóng sạch sẽ, dịch vụ xông hơi đá muối cực kỳ dễ chịu sau một ngày đi tour vịnh.',
    createdAt: '24/10/2026 15:42',
    status: 'Approved' // 'Approved' | 'Flagged'
  },
  {
    id: 2,
    targetType: 'attraction',
    targetId: 1,
    targetName: 'Tuyến tham quan số 2 (Hang Sửng Sốt)',
    locationName: 'Vịnh Hạ Long',
    userName: 'Nguyễn Văn An',
    userEmail: 'vanan@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    rating: 4.8,
    comment: 'Hang động tráng lệ, ánh sáng bài trí rất nghệ thuật. Nên đi vào buổi sáng để tránh đông đúc khách đoàn.',
    createdAt: '22/10/2026 09:15',
    status: 'Approved'
  },
  {
    id: 3,
    targetType: 'hotel',
    targetId: 4,
    targetName: 'Anantara Hoi An Resort',
    locationName: 'Phố Cổ Hội An',
    userName: 'Phạm Minh Đức',
    userEmail: 'ducpham@outlook.com',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop',
    rating: 4.5,
    comment: 'View nhìn ra sông Thu Bồn thơ mộng tuyệt đỉnh, hồ bơi ngoài trời rất sạch và đẹp. Trà chiều bánh ngọt phục vụ chu đáo.',
    createdAt: '20/10/2026 17:30',
    status: 'Approved'
  },
  {
    id: 4,
    targetType: 'hotel',
    targetId: 2,
    targetName: 'Halong Bay Luxury Suite Boutique & Cruise',
    locationName: 'Vịnh Hạ Long',
    userName: 'Lê Hoàng Nam (Spam bot)',
    userEmail: 'bot_scam99@fake.net',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150&auto=format&fit=crop',
    rating: 1.0,
    comment: 'Dịch vụ lừa đảo xem thêm tại đường link bit.ly/tang-voucher-mien-phi-100k nhận quà liền tay...',
    createdAt: '19/10/2026 02:11',
    status: 'Flagged'
  },
  {
    id: 5,
    targetType: 'attraction',
    targetId: 4,
    targetName: 'Hang Múa',
    locationName: 'Tràng An',
    userName: 'Trần Thị Thu Thảo',
    userEmail: 'thuthao.tran@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5.0,
    comment: 'Leo 486 bậc thang khá mệt nhưng khi lên tới đỉnh ngắm trọn sông Ngô Đồng và núi non trùng điệp thì hoàn toàn xứng đáng.',
    createdAt: '18/10/2026 11:05',
    status: 'Approved'
  },
  {
    id: 6,
    targetType: 'hotel',
    targetId: 5,
    targetName: 'Topas Ecolodge Sapa',
    locationName: 'Đỉnh Fansipan',
    userName: 'Nguyễn Văn An',
    userEmail: 'vanan@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    rating: 4.9,
    comment: 'Bể bơi vô cực nước nóng giữa mây ngàn là trải nghiệm khó quên nhất đời mình. Không gian yên bình đậm chất nghỉ dưỡng tách biệt.',
    createdAt: '15/10/2026 16:40',
    status: 'Approved'
  }
];

export const PREFERENCE_TAGS = ['Thiên nhiên', 'Khám phá', 'Nghỉ dưỡng', 'Văn hóa'];
