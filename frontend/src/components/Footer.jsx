import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sky-700 pt-16 border-t border-sky-600 text-sky-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/traveler_filled_white.png"
                alt="TravelMate"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
              <span className="text-2xl font-heading font-extrabold tracking-tight text-white">
                Travel<span className="text-sky-200">Mate</span>
              </span>
            </div>
          </div>
          <p className="text-sky-50/90 leading-relaxed mb-6 text-sm">
            Nền tảng gợi ý địa điểm du lịch nổi tiếng ở Việt Nam. Khám phá 10 địa điểm du lịch nổi tiếng với công nghệ nhận diện thị giác máy tính và gợi ý lịch trình cá nhân hóa chuẩn xác.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-sky-50 rounded-full text-xs font-semibold border border-sky-500 shadow-inner">
            <Zap size={16} className="text-sky-200" />
            <span>ResNet50 3-Tier Computer Vision Engine</span>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-6">Khám phá & Trải nghiệm</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">10 Địa danh tiêu biểu Việt Nam</a></li>
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Quét ảnh nhận diện di tích</a></li>
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Khu nghỉ dưỡng & Khách sạn boutique</a></li>
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Bản đồ ẩm thực & Văn hóa địa phương</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-6">Hỗ trợ & Pháp lý</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Trung tâm trợ giúp 24/7</a></li>
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Điều khoản & Điều kiện dịch vụ</a></li>
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Chính sách bảo mật dữ liệu cá nhân</a></li>
            <li><a href="#" className="text-sm text-sky-100/90 hover:text-white hover:pl-1 transition-all">Quy chuẩn dữ liệu ResNet AI Model</a></li>
          </ul>
        </div>
      </div>

      <div className="bg-sky-800 py-6 text-center text-sm text-sky-100/70 border-t border-sky-700">
        <div className="max-w-7xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} TravelMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
