import React, { useState } from 'react';
import { Heart, MapPin, Star, Trash2, ExternalLink, Search, ChevronDown, Map, Compass, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const MOCK_FAVORITES = [
  {
    id: 1,
    type: 'location',
    title: 'Vịnh Hạ Long',
    location: 'Quảng Ninh, Việt Nam',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 12450,
    dateAdded: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'hotel',
    title: 'Vinpearl Resort & Spa Hạ Long',
    location: 'Hạ Long, Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 3200,
    price: '3.120.000đ',
    dateAdded: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'location',
    title: 'Tràng An, Ninh Bình',
    location: 'Ninh Bình, Việt Nam',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 8900,
    dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'hotel',
    title: 'Emeralda Resort Tam Cốc',
    location: 'Ninh Bình, Việt Nam',
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 5120,
    price: '2.350.000đ',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'checkin',
    title: 'Hang Múa',
    location: 'Ninh Bình, Việt Nam',
    image: 'https://images.unsplash.com/photo-1550650422-9df75d714b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 4500,
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    type: 'checkin',
    title: 'Cầu Vàng',
    location: 'Bà Nà Hills, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 3100,
    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const Wishlist = () => {
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  let processedFavorites = favorites.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false;
    
    if (searchQuery.trim() === '') return true;
    const query = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(query) || item.location.toLowerCase().includes(query);
  });

  const now = new Date();
  if (sortBy === '1_day') {
    processedFavorites = processedFavorites.filter(item => (now - new Date(item.dateAdded)) <= 24 * 60 * 60 * 1000);
  } else if (sortBy === '1_week') {
    processedFavorites = processedFavorites.filter(item => (now - new Date(item.dateAdded)) <= 7 * 24 * 60 * 60 * 1000);
  }

  processedFavorites.sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.dateAdded) - new Date(b.dateAdded);
    }
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const countAll = favorites.length;
  const countLocation = favorites.filter(i => i.type === 'location').length;
  const countHotel = favorites.filter(i => i.type === 'hotel').length;
  const countCheckin = favorites.filter(i => i.type === 'checkin').length;

  const locations = processedFavorites.filter(i => i.type === 'location');
  const hotels = processedFavorites.filter(i => i.type === 'hotel');
  const checkins = processedFavorites.filter(i => i.type === 'checkin');

  const renderGrid = (items, typeName) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {typeName === 'location' && <Map className="text-blue-600" size={24} />}
            {typeName === 'checkin' && <Compass className="text-orange-500" size={24} />}
            {typeName === 'hotel' && <Hotel className="text-blue-600" size={24} />}
            {typeName === 'location' && 'Danh thắng & Địa điểm đã lưu'}
            {typeName === 'checkin' && 'Điểm check-in nổi bật đã lưu'}
            {typeName === 'hotel' && 'Khu nghỉ dưỡng & Khách sạn đã lưu'}
          </h2>
          <span className="text-sm font-medium text-slate-500">{items.length} địa điểm nổi bật</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-xs font-bold rounded-lg text-white shadow-sm flex items-center gap-1">
                    {item.type === 'hotel' && 'Đối tác VIP'}
                    {item.type !== 'hotel' && 'Nổi bật'}
                  </span>
                </div>
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-sm z-10"
                  title="Xóa khỏi danh sách"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1 text-xs font-bold uppercase">
                  <span className="truncate">{item.location}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded w-fit mb-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700">{item.rating}</span>
                    </div>
                    {item.price && (
                      <span className="text-blue-700 font-bold mt-1 text-lg">{item.price}<span className="text-xs font-normal text-slate-500">/đêm</span></span>
                    )}
                  </div>
                  <Link
                    to={item.type === 'location' || item.type === 'checkin' ? `/location/${item.id}` : `/service/hotel/${item.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    {item.type === 'hotel' ? 'Đặt phòng' : 'Chi tiết'} <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-slate-50 pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
              <Heart className="text-rose-500 fill-rose-500" size={36} />
              Danh Sách Yêu Thích
            </h1>
            <p className="text-slate-500 text-lg">
              Lưu trữ và quản lý những địa điểm, khách sạn mà bạn muốn ghé thăm trong tương lai.
            </p>
          </div>

          {/* Layout: Sidebar (Left) + Content (Right) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar Filter (Left) */}
            <div className="w-full lg:w-1/4 shrink-0 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 sticky top-28 z-20">
              <h3 className="text-lg font-bold text-slate-800 mb-5">Bộ lọc & Tìm kiếm</h3>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-600 mb-2 block">Tìm nhanh</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Nhập tên, địa điểm..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-600 mb-2 block">Sắp xếp</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none text-sm text-slate-700 cursor-pointer"
                  >
                    <option value="newest">Mới thêm gần đây</option>
                    <option value="1_day">Thêm 1 ngày trước</option>
                    <option value="1_week">Thêm 1 tuần trước</option>
                    <option value="oldest">Thêm cũ nhất</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="mb-2">
                <label className="text-sm font-semibold text-slate-600 mb-3 block">Danh mục yêu thích</label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                      }`}
                  >
                    <span>Tất cả mục đã lưu</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'all' ? 'bg-blue-500/50 text-white' : 'bg-white text-slate-500 shadow-sm border border-slate-200'}`}>{countAll}</span>
                  </button>
                  <button
                    onClick={() => setFilter('location')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between ${filter === 'location' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-2"><Map size={18} /> Địa điểm</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'location' ? 'bg-blue-500/50 text-white' : 'bg-white text-slate-500 shadow-sm border border-slate-200'}`}>{countLocation}</span>
                  </button>
                  <button
                    onClick={() => setFilter('hotel')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between ${filter === 'hotel' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-2"><Hotel size={18} /> Resort & Khách sạn</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'hotel' ? 'bg-blue-500/50 text-white' : 'bg-white text-slate-500 shadow-sm border border-slate-200'}`}>{countHotel}</span>
                  </button>
                  <button
                    onClick={() => setFilter('checkin')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between ${filter === 'checkin' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-2"><Compass size={18} /> Điểm Check-in</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'checkin' ? 'bg-blue-500/50 text-white' : 'bg-white text-slate-500 shadow-sm border border-slate-200'}`}>{countCheckin}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content (Right) */}
            <div className="w-full lg:w-3/4">
              {processedFavorites.length > 0 ? (
                <>
                  {(filter === 'all' || filter === 'location') && renderGrid(locations, 'location')}
                  {(filter === 'all' || filter === 'hotel') && renderGrid(hotels, 'hotel')}
                  {(filter === 'all' || filter === 'checkin') && renderGrid(checkins, 'checkin')}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {favorites.length === 0 ? "Chưa có mục yêu thích nào" : "Không tìm thấy mục nào"}
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    {favorites.length === 0 
                      ? "Bạn chưa lưu địa điểm hay khách sạn nào. Hãy tiếp tục khám phá và lưu lại những nơi bạn muốn đến nhé!" 
                      : "Không có mục nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
