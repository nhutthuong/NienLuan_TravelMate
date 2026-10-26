import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const mockData = {
  id: 1,
  name: 'Vịnh Hạ Long — Kỳ Quan Thiên Nhiên Thế Giới UNESCO',
  image: '/images/vinh_ha_long.jpg',
  tags: ['DI SẢN THIÊN NHIÊN THẾ GIỚI', 'TP. Hạ Long, Tỉnh Quảng Ninh', '4.9 (18.420 đánh giá quốc tế)'],
  overview: {
    coordinates: "20°54'B 107°12'Đ",
    area: '1.553 km² • 1.969 đảo',
    bestTime: 'Tháng 10 – Tháng 4',
    ticket: '250k – 290k VNĐ'
  },
  description: "Tương truyền, khi người Việt mới dựng nước, Ngọc Hoàng cử Rồng mẹ mang theo đàn Rồng con hạ giới giúp người lãnh đánh giặc. Khi thuyền giặc ồ ạt tràn vào, đàn Rồng lập tức phun ra vô vàn ngọc ngà, châu báu hóa thành hàng nghìn hòn đảo đá vôi dựng đứng giữa vịnh xanh, tạo thành bức tường thành vững chắc che chở bờ cõi non sông.",
  checkInSpots: [
    { id: 1, name: 'Tuyến tham quan số 2 (Hang Sửng Sốt)', desc: 'Hang động rộng lớn và đẹp bậc nhất Vịnh Hạ Long với hệ thống thạch nhũ kỳ ảo.', image: 'https://images.unsplash.com/photo-1550417937-293e545fc11c?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'Đảo Ti Tốp (Vọng cảnh 360°)', desc: 'Sở hữu bãi tắm cát trắng mịn màng hình vầng trăng khuyết và lầu vọng cảnh tuyệt đẹp.', image: 'https://images.unsplash.com/photo-1579899144883-790100f91fc8?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Làng chài Cửa Vạn', desc: 'Trải nghiệm cuộc sống thanh bình của ngư dân vùng biển với những ngôi nhà nổi rực rỡ.', image: 'https://images.unsplash.com/photo-1576081498877-33a82773229b?q=80&w=600&auto=format&fit=crop' }
  ],
  hotels: [
    {
      id: 1,
      name: 'Yoko Onsen Quang Hanh — Dưỡng Sinh Suối Khoáng',
      distance: 'Thung lũng Quang Hanh, Cẩm Phả (Cách vịnh 15 phút)',
      rating: '9.6 / 10',
      stars: 4.5,
      image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=600&auto=format&fit=crop',
      amenities: ['27 bể ngâm khoáng Onsen chuẩn Nhật', 'Xông hơi đá muối Himalaya & Tuyết lạnh', 'Hồ ngâm sinh thái vô cực giữa thung lũng', 'Trị liệu thiền chuông xoay Tây Tạng'],
      price: '1.450.000đ',
      unit: '/khách - Gói Dưỡng Tâm',
      highlight: 'Khoáng nóng tự nhiên giàu Brom'
    },
    {
      id: 2,
      name: 'Halong Bay Luxury Suite Boutique & Cruise',
      distance: 'Xuất phát Cảng Quốc Tế Tuần Châu (Hải trình 2N1Đ)',
      rating: '9.8 / 10',
      stars: 5,
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600&auto=format&fit=crop',
      amenities: ['Hồ bơi sục vô cực tầng thượng', 'Bồn tắm gỗ pơ-mu ngâm thảo dược', 'Sân thiền & Taichi đón bình minh', 'Ẩm thực thực dưỡng hữu cơ tinh tuyển'],
      price: '4.200.000đ',
      unit: '/cabin đôi',
      highlight: 'Bể bơi mini bốn mùa trên boong'
    }
  ],
  similarLocations: [
    { id: 1, name: 'Tràng An (Ninh Bình)', type: 'Di sản Kép UNESCO', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'Phong Nha — Kẻ Bàng', type: 'Kỳ quan Địa mạo', image: 'https://images.unsplash.com/photo-1571434311899-70fb8a9d16a5?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Thác Bản Giốc', type: 'Thác Nước Xuyên Biên Giới', image: 'https://images.unsplash.com/photo-1599573857321-4f115599042a?q=80&w=600&auto=format&fit=crop' }
  ]
};

const LocationDetail = () => {
  const { id } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();
  const isFromAI = locationState.state?.fromAI || true;
  const aiConfidence = "99.4%";
  const aiClass = "halong_bay";

  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'spots', 'hotels'

  const data = mockData;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10 text-gray-800 font-sans">


        {/* Phần 1: Hero Banner & Tổng quan */}
        <section
          className="relative h-[550px] rounded-3xl bg-cover bg-center overflow-hidden mb-10 flex items-end shadow-xl"
          style={{ backgroundImage: `url(${data.image})` }}
        >

          {/* Khung AI Header Info góc trái trên */}
          {isFromAI && (
            <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-md">
              <span className="text-sky-700 text-sm font-medium">
                <span className="text-sky-600 mr-2">●</span>
                Mô hình ResNet50 • Độ tin cậy: {aiConfidence}
              </span>
            </div>
          )}

          {/* Nút hành động góc phải trên */}
          <div className="absolute top-5 right-5 z-20 flex gap-3">
            <button className="flex items-center gap-2 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full font-semibold text-gray-800 shadow-lg transition-transform hover:-translate-y-0.5">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              Lưu vào Wishlist
            </button>
            <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg transition-transform hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H5v3a1 1 0 01-2 0V4zm14-1a1 1 0 011 1v3a1 1 0 01-2 0V5h-3a1 1 0 010-2h4zM4 17a1 1 0 012 0v3h3a1 1 0 010 2H5a1 1 0 01-1-1v-4zm15 1a1 1 0 01-1 1h-3a1 1 0 010 2h4a1 1 0 011-1v-4a1 1 0 01-2 0v3z" /></svg>
              Quét AI
            </button>
          </div>

          <div className="relative z-10 p-10 w-full bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex flex-wrap gap-2 mb-3">
              {data.tags.map((tag, idx) => (
                <span key={idx} className={`px-3 py-1 rounded-md text-xs font-bold ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-white/30 backdrop-blur-sm text-white'}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-snug text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] flex flex-col gap-3">
              {data.name.split(' — ').map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </h1>

            <div className="flex flex-wrap gap-8 text-white drop-shadow-md">
              <div className="flex flex-col">
                <span className="text-xs text-gray-200 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Tọa độ địa lý
                </span>
                <span className="font-bold">{data.overview.coordinates}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-200 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Quy mô danh thắng
                </span>
                <span className="font-bold">{data.overview.area}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-200 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Thời điểm lý tưởng
                </span>
                <span className="font-bold">{data.overview.bestTime}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-200 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                  Vé tham quan tuyến
                </span>
                <span className="font-bold">{data.overview.ticket}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Overview text */}
            <section className="mb-10">
              <div className="mb-4">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Thông tin tổng quan
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">Huyền thoại Rồng thiêng và Di sản Địa mạo Karst</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-sky-500 text-gray-600 italic leading-relaxed">
                <p>"{data.description}"</p>
                <div className="mt-4 flex justify-between items-center text-sm not-italic text-gray-500">
                  <span>Nguồn gốc danh xưng: "Hạ Long" - Nơi Rồng đáp xuống</span>
                  <span className="text-emerald-600 font-semibold">Di sản 2 lần được UNESCO công nhận</span>
                </div>
              </div>
            </section>

            {/* Phần 2: Các điểm Check-in */}
            <section className="mb-10">
              <div className="flex justify-between items-end mb-5">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    Hành trình khám phá
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Điểm tham quan & Check-in tiêu biểu</h2>
                </div>
                <button onClick={(e) => { e.preventDefault(); setActiveTab('spots'); setShowAllModal(true); }} className="group flex items-center gap-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer outline-none">
                  Xem tất cả {data.checkInSpots.length} địa điểm
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {data.checkInSpots.map(spot => (
                  <div key={spot.id} className="bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col" onClick={() => navigate(`/service/spot/${spot.id}`)}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button className="absolute top-4 right-4 text-white hover:text-rose-500 transition-colors z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); }}>
                        <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-lg mb-2 leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">{spot.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">{spot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Phần 3: Gợi ý Khách sạn */}
            <section className="mb-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-7 h-7 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Nơi lưu trú & Nghỉ dưỡng
                </h2>
                <button onClick={(e) => { e.preventDefault(); setActiveTab('hotels'); setShowAllModal(true); }} className="group flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors w-fit cursor-pointer outline-none">
                  Xem tất cả {data.hotels.length} khách sạn
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {data.hotels.map(hotel => (
                  <div key={hotel.id} className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => navigate(`/service/hotel/${hotel.id}`)}>
                    <div className="relative md:w-2/5 h-64 md:h-auto">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                      <button className="absolute top-4 right-4 text-white hover:text-rose-500 transition-colors z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); }}>
                        <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                      <span className="absolute bottom-3 left-3 bg-white/95 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {hotel.highlight}
                      </span>
                    </div>
                    <div className="p-6 md:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-800 leading-tight pr-4">{hotel.name}</h3>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const fillPercent = Math.max(0, Math.min(100, (hotel.stars - star + 1) * 100));
                                return (
                                  <div key={star} className="relative w-4 h-4">
                                    <svg className="absolute top-0 left-0 w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <svg className="absolute top-0 left-0 w-4 h-4 text-amber-400 fill-current" style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                              Điểm: {hotel.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {hotel.distance}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                          {hotel.amenities.map((am, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              {am}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center pt-4 border-t border-dashed border-gray-200 mt-2">
                        <div className="mb-4 sm:mb-0">
                          <span className="text-xl font-bold text-rose-600">{hotel.price}</span>
                          <span className="text-xs text-gray-400 block">{hotel.unit}</span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button className="flex-1 sm:flex-none border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-semibold text-sm transition-colors">
                            Booking.com
                          </button>
                          <button className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors">
                            Đặt qua Agoda
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Phần 4: Top 3 địa điểm tương đồng */}
            {isFromAI && (
              <section className="mb-10">
                <div className="flex justify-between items-end mb-5">
                  <div>
                    <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">ResNet50 AI Recommendations</span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">Điểm đến di sản tương đồng bạn sẽ thích</h2>
                  </div>
                  <a href="#" className="text-sky-700 font-semibold text-sm hover:underline">Xem cả 10 địa danh →</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {data.similarLocations.map(sim => (
                    <div key={sim.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                      <div className="relative h-36">
                        <img src={sim.image} alt={sim.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded-md">{sim.type}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800">{sim.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">

              {/* Bản đồ mini */}
              <div className="bg-sky-50 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => setShowMapPopup(true)}>
                <div className="flex justify-between items-center text-sm font-semibold text-sky-800 mb-3">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Tọa độ:
                  </span>
                  <span className="opacity-60">20.9101° N, 107.1839° E</span>
                </div>
                <div className="bg-sky-200 h-32 rounded-2xl flex items-center justify-center text-sky-700 font-bold mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
                  <span>Mở Bản đồ</span>
                </div>
                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Giờ mở cửa:</span>
                    <span className="font-bold text-slate-800">06:30 - 18:30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg> Từ Hà Nội:</span>
                    <span className="font-bold text-slate-800">2.5 giờ (Cao tốc 5B)</span>
                  </div>
                </div>
              </div>

              {/* Bộ lọc sở thích */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Lọc nhanh nghỉ dưỡng thư thái</h3>
                <p className="text-sm text-gray-500 mb-5">Tự động kích hoạt các tiêu chuẩn thư giãn tĩnh tâm (Đã loại bỏ phòng thể chất):</p>

                <div className="space-y-4">
                  {[
                    { title: "Hồ bơi vô cực (Infinity Pool)", sub: "Tầm nhìn chân trời vịnh karst" },
                    { title: "Spa thảo mộc & Trị liệu Onsen", sub: "Bồn ngâm dược liệu tự nhiên" },
                    { title: "View trực diện biển ngọc", sub: "Phòng ban công phóng mắt ra vịnh" }
                  ].map((filter, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                      <div>
                        <div className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">{filter.title}</div>
                        <div className="text-xs text-gray-500">{filter.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold mt-6 transition-colors">
                  Áp dụng 3 tiêu chí
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Map Popup Modal */}
        {showMapPopup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMapPopup(false)}>
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors" onClick={() => setShowMapPopup(false)}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Bản đồ tương tác Vịnh Hạ Long</h2>
              <div className="rounded-2xl overflow-hidden h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119339.54924773707!2d106.96695273760434!3d20.814321740702656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5796518cbfa3%3A0x673dbb3e8ad6b71!2sH%E1%BA%A1%20Long%20Bay!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ Vịnh Hạ Long"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Khám phá & Trải nghiệm Modal/Drawer */}
        {showAllModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end" onClick={() => setShowAllModal(false)}>
            <div
              className="bg-slate-50 w-full max-w-4xl h-full shadow-2xl flex flex-col transform transition-transform overflow-hidden animate-slide-in-right"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Khám phá & Trải nghiệm</h2>
                  <p className="text-sm text-gray-500 mt-1">Tìm kiếm dịch vụ phù hợp nhất tại {data.name}</p>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors" onClick={() => setShowAllModal(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Filter */}
                <div className="w-64 bg-white border-r border-gray-100 overflow-y-auto p-6 hidden md:block">
                  {/* Tabs */}
                  <div className="flex flex-col gap-2 mb-8">
                    <button onClick={() => setActiveTab('all')} className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'all' ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50'}`}>Tất cả ({data.checkInSpots.length + data.hotels.length})</button>
                    <button onClick={() => setActiveTab('spots')} className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'spots' ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50'}`}>Điểm Check-in ({data.checkInSpots.length})</button>
                    <button onClick={() => setActiveTab('hotels')} className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'hotels' ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50'}`}>Nơi lưu trú ({data.hotels.length})</button>
                  </div>

                  {/* Filters based on tab */}
                  <div className="space-y-6">
                    {(activeTab === 'all' || activeTab === 'hotels') && (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Tiện ích thư giãn</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Hồ bơi vô cực</label>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Trị liệu Spa / Onsen</label>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> View biển trực diện</label>
                        </div>
                      </div>
                    )}
                    {(activeTab === 'all' || activeTab === 'spots') && (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Phong cách khám phá</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Check-in thiên nhiên</label>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Khám phá văn hóa</label>
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Mức giá</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Miễn phí</label>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Dưới 500k</label>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> 500k - 2 Triệu</label>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4" /> Trên 2 Triệu</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(activeTab === 'all' || activeTab === 'spots') && data.checkInSpots.map(spot => (
                      <div key={`modal-spot-${spot.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => { setShowAllModal(false); navigate(`/service/spot/${spot.id}`); }}>
                        <div className="relative h-44 overflow-hidden">
                          <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 left-3 bg-white/90 text-sky-700 px-2 py-1 rounded text-xs font-bold shadow-sm">
                            Điểm tham quan
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 leading-snug">{spot.name}</h3>
                          <button className="mt-3 text-sm font-semibold text-sky-600 group-hover:text-sky-700 flex items-center gap-1">
                            Xem bản đồ <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {(activeTab === 'all' || activeTab === 'hotels') && data.hotels.map(hotel => (
                      <div key={`modal-hotel-${hotel.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => { setShowAllModal(false); navigate(`/service/hotel/${hotel.id}`); }}>
                        <div className="relative h-44 overflow-hidden">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 left-3 bg-white/90 text-emerald-700 px-2 py-1 rounded text-xs font-bold shadow-sm">
                            Nơi lưu trú
                          </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between h-40">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-gray-800 leading-snug text-sm">{hotel.name}</h3>
                              <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600 flex-shrink-0 ml-2">{hotel.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{hotel.highlight}</p>
                          </div>
                          <div>
                            <p className="text-rose-600 font-bold text-sm mb-3">{hotel.price} <span className="text-xs font-normal text-gray-400">/đêm</span></p>
                            <button className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                              Đặt phòng ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default LocationDetail;
