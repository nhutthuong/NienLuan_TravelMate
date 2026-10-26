import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ExternalLink } from 'lucide-react';

const AdminHeader = ({ activeTab }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'destinations':
        return 'Quản Lý 10 Địa Danh ResNet50';
      case 'checkins':
        return 'Quản Lý Điểm Check-in & Tham Quan';
      case 'services':
        return 'Quản Lý Khách Sạn & Dịch Vụ Nghỉ Dưỡng';
      case 'reviews':
        return 'Kiểm Duyệt & Quản Lý Đánh Giá, Bình Luận';
      case 'users':
        return 'Quản Lý Thành Viên & Khóa Tài Khoản';
      case 'analytics':
        return 'Báo Cáo Dự Đoán & Hiệu Suất ResNet50';
      default:
        return 'Bảng Điều Khiển Quản Trị';
    }
  };

  return (
    <header className="h-20 shrink-0 bg-white border-b border-slate-200/90 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center gap-2">
          {getTabTitle()}
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
  );
};

export default AdminHeader;
