import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// MOCK DATA: Giả lập dữ liệu fetch từ API dựa trên type
const mockData = {
  hotel: {
    id: 1,
    name: 'Halong Bay Luxury Suite Boutique & Cruise',
    rating: '9.8 / 10',
    stars: 5,
    address: 'Xuất phát Cảng Quốc Tế Tuần Châu, TP. Hạ Long',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=600&auto=format&fit=crop'
    ],
    price: '4.200.000',
    originalPrice: '5.500.000',
    unit: 'VND / đêm',
    highlight: 'Bể bơi mini bốn mùa trên boong',
    description: 'Trải nghiệm hải trình 2 ngày 1 đêm đẳng cấp thượng lưu giữa lòng di sản thiên nhiên thế giới. Du thuyền 5 sao mang phong cách Đông Dương với toàn bộ cabin có ban công riêng hướng biển. Thưởng thức ẩm thực fine-dining, tham gia lớp học Tai-chi buổi sáng và chèo kayak qua những hang động hùng vĩ.',
    features: [
      { icon: 'M5 13l4 4L19 7', label: 'Hồ bơi sục vô cực' },
      { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Ban công hướng biển' },
      { icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z', label: 'Bồn tắm gỗ thảo dược' },
      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Check-in: 12:00 - Check-out: 10:30' }
    ],
    reviews: [
      { name: 'Nguyễn Văn A', date: '12/10/2023', content: 'Phòng rất đẹp và sạch sẽ, nhân viên nhiệt tình. Trải nghiệm tuyệt vời!', rating: 5 },
      { name: 'Trần Thị B', date: '05/09/2023', content: 'Đồ ăn ngon, view xuất sắc, tôi sẽ quay lại.', rating: 5 }
    ]
  },
  spot: {
    id: 1,
    name: 'Sun World Ha Long Complex',
    rating: '9.2 / 10',
    stars: 4.5, // Dùng cho UI đánh giá chung
    address: 'Số 9 đường Hạ Long, phường Bãi Cháy, TP. Hạ Long',
    images: [
      'https://images.unsplash.com/photo-1506744626753-2fea9f4699d9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744626753-2fea9f4699d9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744626753-2fea9f4699d9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744626753-2fea9f4699d9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744626753-2fea9f4699d9?q=80&w=600&auto=format&fit=crop'
    ],
    price: '350.000',
    originalPrice: '450.000',
    unit: 'VND / vé người lớn',
    highlight: 'Tổ hợp vui chơi giải trí hàng đầu Việt Nam',
    description: 'Trải nghiệm Cáp treo Nữ Hoàng băng qua vịnh biển, ngắm toàn cảnh Hạ Long từ Vòng quay Mặt Trời. Khám phá Công viên Rồng với các trò chơi cảm giác mạnh và Công viên nước Vịnh Lốc Xoáy giải nhiệt mùa hè. Một điểm đến không thể bỏ lỡ cho gia đình và nhóm bạn.',
    features: [
      { icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', label: 'Cáp treo Nữ Hoàng & Đồi huyền bí' },
      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Công viên Rồng (Dragon Park)' },
      { icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z', label: 'Công viên Nước (Typhoon Water Park)' },
      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Giờ hoạt động: 09:00 - 20:00' }
    ],
    reviews: [
      { name: 'Lê Minh C', date: '20/08/2023', content: 'Rất nhiều trò chơi hấp dẫn, các bé nhà mình rất thích!', rating: 5 }
    ]
  }
};

const ServiceDetail = () => {
  const { type, id } = useParams(); // Lấy params từ URL (/service/:type/:id)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // MOCK Fetching Data
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0); // Reset scroll to top
    // Giả lập delay mạng
    setTimeout(() => {
      // Trong thực tế, bạn sẽ dùng fetch(`api/services/${type}/${id}`)
      if (type === 'hotel' || type === 'spot') {
        setData(mockData[type]);
      } else {
        setData(mockData['hotel']); // Fallback
      }
      setLoading(false);
    }, 400);
  }, [type, id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải thông tin dịch vụ...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="bg-slate-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${type === 'hotel' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                  {type === 'hotel' ? 'Nơi lưu trú' : 'Điểm tham quan'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const fillPercent = Math.max(0, Math.min(100, (data.stars - star + 1) * 100));
                    return (
                      <div key={star} className="relative w-4 h-4">
                        <svg className="absolute top-0 left-0 w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <svg className="absolute top-0 left-0 w-4 h-4 text-amber-400 fill-current" style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                    );
                  })}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                {data.name}
              </h1>
              <p className="text-gray-500 font-medium flex items-center gap-1.5">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {data.address}
                <a href="#" className="ml-2 text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2">Xem bản đồ</a>
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 font-semibold text-gray-700 transition">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Lưu lại
              </button>
            </div>
          </div>

          {/* Image Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8 h-[300px] sm:h-[400px] md:h-[500px]">
            {/* Ảnh chính to bự bên trái */}
            <div className="md:col-span-2 h-full cursor-pointer group overflow-hidden relative">
              <img src={data.images[0]} alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
            </div>
            
            {/* 2 Ảnh nhỏ cột giữa */}
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              <div className="cursor-pointer group overflow-hidden relative h-full">
                <img src={data.images[1]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
              </div>
              <div className="cursor-pointer group overflow-hidden relative h-full">
                <img src={data.images[2]} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
              </div>
            </div>

            {/* 2 Ảnh nhỏ cột phải */}
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              <div className="cursor-pointer group overflow-hidden relative h-full">
                <img src={data.images[3]} alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
              </div>
              {/* Ảnh cuối có overlay "Xem tất cả" */}
              <div className="cursor-pointer group overflow-hidden relative h-full">
                <img src={data.images[4]} alt="Gallery 5" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 hover:bg-black/60 transition duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Xem tất cả ảnh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: 2 Columns */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Content Column */}
            <div className="flex-1 space-y-10">
              
              {/* Giới thiệu */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Thông tin giới thiệu
                </h2>
                <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {data.description}
                </div>
              </section>

              {/* Các tiện nghi / Hoạt động */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  {type === 'hotel' ? (
                    <><svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Các tiện nghi nổi bật</>
                  ) : (
                    <><svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg> Các hoạt động & Thông tin</>
                  )}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {data.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'hotel' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} /></svg>
                      </div>
                      <span className="text-gray-700 font-medium text-lg">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Review Section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full font-bold text-lg border border-amber-200">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {data.rating}
                  </div>
                </div>

                <div className="space-y-6">
                  {data.reviews.map((review, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                           {[...Array(5)].map((_, i) => (
                             <svg key={i} className={`w-4 h-4 fill-current ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                           ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{review.content}"</p>
                    </div>
                  ))}
                  <button className="w-full py-3 font-bold text-sky-600 border-2 border-sky-100 rounded-xl hover:bg-sky-50 transition">
                    Xem tất cả đánh giá
                  </button>
                </div>
              </section>
            </div>

            {/* Right Sidebar - Sticky Booking Widget */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 sm:p-8">
                
                {/* Price Section */}
                <div className="mb-6">
                  <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider mb-3 inline-block">ƯU ĐÃI ĐẶC BIỆT</span>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-rose-600">{data.price}₫</span>
                    <span className="text-gray-500 font-medium pb-1">{data.unit}</span>
                  </div>
                  <div className="text-gray-400 line-through text-sm">
                    Giá gốc: {data.originalPrice}₫
                  </div>
                </div>

                {/* Date Picker Mock */}
                {type === 'hotel' && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="border border-gray-300 rounded-xl p-3 cursor-pointer hover:border-sky-500">
                      <span className="block text-xs font-bold text-gray-500 uppercase">Nhận phòng</span>
                      <span className="block text-gray-900 font-medium">12 Tháng 10</span>
                    </div>
                    <div className="border border-gray-300 rounded-xl p-3 cursor-pointer hover:border-sky-500">
                      <span className="block text-xs font-bold text-gray-500 uppercase">Trả phòng</span>
                      <span className="block text-gray-900 font-medium">14 Tháng 10</span>
                    </div>
                  </div>
                )}
                {type === 'spot' && (
                  <div className="border border-gray-300 rounded-xl p-3 cursor-pointer hover:border-sky-500 mb-6">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Ngày đi</span>
                    <span className="block text-gray-900 font-medium">12 Tháng 10, 2023</span>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <button className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 ${type === 'hotel' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'}`}>
                    {type === 'hotel' ? 'Đặt phòng qua Agoda' : 'Mua vé trực tuyến'}
                  </button>
                  <button className="w-full py-3 rounded-xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition">
                    Liên hệ tư vấn
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="text-sm text-gray-500 space-y-2">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Xác nhận tức thời
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Hủy miễn phí trước 24h
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ServiceDetail;
