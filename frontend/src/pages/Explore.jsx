import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../services/api';

const LOCATION_IMAGES = {
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
  3: '/images/hoi_an.jpg',
  4: '/images/cau_vang.jpg',
  5: '/images/fansipan.jpg',
  6: '/images/cho_noi.jpg',
  7: '/images/phu_quoc.jpg',
  8: '/images/ho_xuan_huong.jpg',
  9: '/images/mui_ne.jpg',
  10: '/images/ho_hoan_kiem.jpg',
};

const DEFAULT_DESTINATIONS = [
  {
    id: "DD0010",
    name: "Vịnh Hạ Long",
    location: "Quảng Ninh",
    category: "Thiên nhiên kỳ quan",
    image: "/images/vinh_ha_long.jpg",
    rating: 4.9,
    reviews: 1205,
    desc: "Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi tuyệt đẹp và mặt nước xanh ngắt."
  },
  {
    id: "DD0006",
    name: "Tràng An",
    location: "Ninh Bình",
    category: "Thiên nhiên kỳ quan",
    image: "/images/trang_an.jpg",
    rating: 4.8,
    reviews: 940,
    desc: "Khu du lịch sinh thái kết hợp tâm linh với hệ thống hang động kỳ bí và phong cảnh hữu tình."
  },
  {
    id: "DD0005",
    name: "Phố Cổ Hội An",
    location: "Quảng Nam",
    category: "Văn hóa",
    image: "/images/hoi_an.jpg",
    rating: 4.9,
    reviews: 2100,
    desc: "Di sản văn hóa thế giới lưu giữ vẻ đẹp hoài cổ qua từng nếp nhà, ánh đèn lồng rực rỡ."
  },
  {
    id: "DD0003",
    name: "Cầu Vàng",
    location: "Đà Nẵng",
    category: "Khám phá",
    image: "/images/cau_vang.jpg",
    rating: 4.7,
    reviews: 1530,
    desc: "Biểu tượng kiến trúc độc đáo vắt ngang lưng chừng trời, thu hút du khách toàn cầu."
  },
  {
    id: "DD0009",
    name: "Đỉnh Fansipan",
    location: "Sapa",
    category: "Khám phá",
    image: "/images/fansipan.jpg",
    rating: 4.8,
    reviews: 1120,
    desc: "Nóc nhà Đông Dương - Điểm đến lý tưởng cho những người đam mê chinh phục."
  },
  {
    id: "DD0001",
    name: "Chợ Nổi Cái Răng",
    location: "Cần Thơ",
    category: "Văn hóa",
    image: "/images/cho_noi.jpg",
    rating: 4.6,
    reviews: 850,
    desc: "Trải nghiệm văn hóa giao thương đặc sắc trên sông nước miền Tây nhộn nhịp."
  },
  {
    id: "DD0008",
    name: "Phú Quốc",
    location: "Kiên Giang",
    category: "Nghỉ dưỡng",
    image: "/images/phu_quoc.jpg",
    rating: 4.9,
    reviews: 3200,
    desc: "Đảo ngọc thiên đường với những bãi biển cát trắng mịn màng và hệ sinh thái đa dạng."
  },
  {
    id: "DD0002",
    name: "Hồ Xuân Hương",
    location: "Đà Lạt",
    category: "Nghỉ dưỡng",
    image: "/images/ho_xuan_huong.jpg",
    rating: 4.7,
    reviews: 1800,
    desc: "Trái tim của thành phố ngàn hoa với không khí se lạnh lãng mạn quanh năm."
  },
  {
    id: "DD0007",
    name: "Mũi Né",
    location: "Phan Thiết",
    category: "Nghỉ dưỡng",
    image: "/images/mui_ne.jpg",
    rating: 4.6,
    reviews: 1450,
    desc: "Thủ phủ resort với những đồi cát mênh mông vàng óng và biển xanh mát."
  },
  {
    id: "DD0004",
    name: "Hồ Hoàn Kiếm",
    location: "Hà Nội",
    category: "Văn hóa",
    image: "/images/ho_hoan_kiem.jpg",
    rating: 4.8,
    reviews: 2800,
    desc: "Trái tim thủ đô mang đậm dấu ấn lịch sử nghìn năm văn hiến, bình yên và cổ kính."
  }
];

const DEFAULT_CATEGORIES = ["Tất cả", "Thiên nhiên kỳ quan", "Văn hóa", "Nghỉ dưỡng", "Khám phá"];

const Explore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || 'Tất cả';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    let isMounted = true;

    // Load locations from backend
    api.locations
      .getAll()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;

        const mapped = data.map((loc) => {
          const locId = loc.maDiaDiem || loc.id;
          const categoriesList = Array.isArray(loc.loaiHinh)
            ? loc.loaiHinh
            : (Array.isArray(loc.loai_hinh) ? loc.loai_hinh : []);

          const primaryCategory = categoriesList[0] || loc.theLoai || loc.category || 'Khám phá';
          const imgUrl =
            loc.anhUrl ||
            loc.anh_url ||
            loc.hinhAnh ||
            loc.image ||
            LOCATION_IMAGES[locId] ||
            '/images/vinh_ha_long.jpg';

          return {
            id: locId,
            name: loc.ten || loc.tenDiaDiem || loc.name,
            location: loc.tinhThanh || loc.location || '',
            category: primaryCategory,
            categories: categoriesList.length > 0 ? categoriesList : [primaryCategory],
            categoryIds: Array.isArray(loc.maLoaiHinh) ? loc.maLoaiHinh : [],
            image: imgUrl,
            rating: parseFloat(loc.danhGiaTB || loc.rating || 4.8),
            reviews: parseInt(loc.soLuotDanhGia || loc.reviews || 1000, 10),
            desc: loc.moTa || loc.desc || '',
          };
        });

        setDestinations(mapped);
      })
      .catch(() => {
        // Retain default destinations on error
      });

    // Load dynamic categories if available
    api.locations
      .getCategories()
      .then((cats) => {
        if (!isMounted || !Array.isArray(cats) || cats.length === 0) return;
        const catNames = cats.map((c) => (typeof c === 'string' ? c : c.ten || c.tenChuDe || c.name)).filter(Boolean);
        if (catNames.length > 0) {
          const merged = ['Tất cả', ...new Set([...DEFAULT_CATEGORIES.slice(1), ...catNames])];
          setCategories(merged);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    const destCategories = Array.isArray(dest.categories) && dest.categories.length > 0
      ? dest.categories
      : [dest.category || ''];
    const destCategoryIds = Array.isArray(dest.categoryIds) ? dest.categoryIds : [];

    const activeCats = activeCategory === 'Tất cả'
      ? []
      : activeCategory.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);

    const matchCategory =
      activeCats.length === 0 ||
      activeCats.some((filterCat) =>
        destCategories.some((c) =>
          c.toLowerCase().includes(filterCat) || filterCat.includes(c.toLowerCase())
        ) ||
        destCategoryIds.some((cid) => cid.toLowerCase() === filterCat) ||
        (dest.category && (
          dest.category.toLowerCase().includes(filterCat) || filterCat.includes(dest.category.toLowerCase())
        ))
      );

    const matchSearch =
      (dest.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Khám Phá Điểm Đến Tuyệt Vời</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Bộ lọc giúp bạn tìm kiếm và lựa chọn những địa điểm du lịch phù hợp với sở thích cá nhân của bạn.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-12 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm địa danh, tỉnh thành..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-hide">
              <Filter size={20} className="text-slate-400 mx-2 shrink-0 hidden md:block" />
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => navigate(`/location/${dest.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = LOCATION_IMAGES[dest.id] || '/images/vinh_ha_long.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      {dest.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-500 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      <Star size={14} fill="currentColor" /> {dest.rating}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {dest.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                      <MapPin size={16} />
                      <span>{dest.location}</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-2">{dest.desc}</p>
                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                      <span className="text-slate-400 text-xs font-medium">
                        {dest.reviews.toLocaleString()} đánh giá
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/location/${dest.id}`);
                        }}
                        className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
                      >
                        Xem chi tiết <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm mb-16">
              <div className="text-slate-300 mb-4 flex justify-center">
                <Search size={64} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-slate-500">Thử tìm kiếm với một từ khóa khác hoặc xóa bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
