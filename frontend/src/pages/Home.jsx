import React, { useState } from "react";
import { UploadCloud, Search, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";

const destinations = [
  {
    name: "Vịnh Hạ Long",
    location: "Quảng Ninh",
    category: "Kỳ quan thiên nhiên",
    image: "/images/vinh_ha_long.jpg",
  },
  {
    name: "Tràng An",
    location: "Ninh Bình",
    category: "Di sản kép",
    image: "/images/trang_an.jpg",
  },
  {
    name: "Phố Cổ Hội An",
    location: "Quảng Nam",
    category: "Di sản thế giới",
    image: "/images/hoi_an.jpg",
  },
  {
    name: "Cầu Vàng",
    location: "Đà Nẵng",
    category: "Điểm nhấn kiến trúc",
    image: "/images/cau_vang.jpg",
  },
  {
    name: "Đỉnh Fansipan",
    location: "Sapa",
    category: "Khám phá mạo hiểm",
    image: "/images/fansipan.jpg",
  },
  {
    name: "Chợ Nổi Cái Răng",
    location: "Cần Thơ",
    category: "Sông nước miền Tây",
    image: "/images/cho_noi.jpg",
  },
  {
    name: "Phú Quốc",
    location: "Kiên Giang",
    category: "Nghỉ dưỡng biển",
    image: "/images/phu_quoc.jpg",
  },
  {
    name: "Hồ Xuân Hương",
    location: "Đà Lạt",
    category: "Thành phố ngàn hoa",
    image: "/images/ho_xuan_huong.jpg",
  },
  {
    name: "Mũi Né",
    location: "Phan Thiết",
    category: "Nắng vàng biển xanh",
    image: "/images/mui_ne.jpg",
  },
  {
    name: "Hồ Hoàn Kiếm",
    location: "Hà Nội",
    category: "Nghìn năm văn hiến",
    image: "/images/ho_hoan_kiem.jpg",
  },
];

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex justify-center items-center pt-24 pb-8 px-6 bg-[url('/src/assets/hero_bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="absolute top-0 left-0 w-full h-3/5 bg-gradient-to-b from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
          <h1 className="font-sans text-5xl md:text-6xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
            Khám phá Việt Nam theo cách của bạn
          </h1>
          <p className="font-sans text-lg md:text-xl text-white drop-shadow-md mb-12">
            Nhận diện tức thì địa danh qua hình ảnh và khám phá trải nghiệm du
            lịch cá nhân hóa.
          </p>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-left mx-auto max-w-4xl">
            <div className="flex bg-slate-100 border-b border-slate-200">
              <div className="flex-1 p-5 flex items-center justify-center gap-2 font-semibold cursor-pointer bg-white text-primary border-b-2 border-primary">
                <UploadCloud size={20} />
                <span>Nhận diện AI (ResNet50)</span>
              </div>
              <div className="flex-1 p-5 flex items-center justify-center gap-2 font-semibold text-slate-500 cursor-pointer hover:bg-white transition-colors">
                <Search size={20} />
                <span>Khám phá theo sở thích</span>
              </div>
            </div>

            <div className="p-8">
              {!previewUrl ? (
                <label className="flex flex-col items-center text-center p-10 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-sky-50 transition-colors">
                  <div className="bg-sky-100 p-4 rounded-full mb-4">
                    <UploadCloud size={40} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    Kéo thả ảnh phong cảnh vào đây hoặc tải lên từ máy
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Tự động phân loại danh thắng qua mạng nơ-ron ResNet50 (Tối
                    đa 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="btn-primary">Chọn ảnh từ thiết bị</div>
                </label>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[400px] rounded-xl object-cover shadow-md"
                  />
                  <div className="flex gap-4">
                    <button
                      className="btn-primary"
                      onClick={() => alert("Đang phân tích ảnh...")}
                    >
                      Phân tích AI
                    </button>
                    <button
                      className="px-6 py-3 rounded-xl font-semibold border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors"
                      onClick={() => setPreviewUrl(null)}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="text-primary font-semibold text-sm mb-2 flex items-center gap-1">
              <Search size={16} />
              Hệ thống danh thắng AI
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              10 Địa danh tiêu biểu được hỗ trợ nhận diện
            </h2>
            <p className="text-slate-500 max-w-2xl">
              Chỉ cần chụp hoặc tải ảnh bất kỳ, mạng ResNet50 sẽ nhận dạng chuẩn
              xác trong chưa đầy 1 giây kèm đầy đủ thông tin lưu trú.
            </p>
          </div>
          <a
            href="#"
            className="text-primary font-semibold flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            Xem toàn bộ 10 địa danh <ChevronRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {destinations.map((dest, index) => (
            <div
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary transition-all cursor-pointer flex flex-col overflow-hidden group"
              key={index}
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {dest.name}
                </h3>
                <div className="text-sm text-slate-500 flex flex-col gap-1 mt-1">
                  <span>{dest.location}</span>
                  <span className="text-slate-400">{dest.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-teal-700 to-sky-700 rounded-3xl p-12 flex flex-col md:flex-row justify-between items-center text-white shadow-xl gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Gợi ý địa điểm du lịch
              <br />
              theo sở thích cá nhân
            </h2>
            <p className="text-lg text-white/90 max-w-xl">
              Sau khi nhận diện danh lam thắng cảnh, TravelMate sẽ chọn lọc các
              khách sạn, dịch vụ, địa điểm check-in theo sở thích của bạn
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button className="bg-white text-teal-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-md">
              Khám phá danh sách Khách sạn
            </button>
            <button className="bg-transparent border border-white/50 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Xem 10 địa điểm
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
