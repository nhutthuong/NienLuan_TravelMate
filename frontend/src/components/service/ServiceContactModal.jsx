import React from 'react';
import { Phone, X } from 'lucide-react';

const ServiceContactModal = ({ serviceName, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition cursor-pointer p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Hỗ trợ thông tin du lịch</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Bạn cần giải đáp về chính sách dịch vụ, đặt vé đoàn hoặc thông tin đặt phòng tại{' '}
          <strong className="text-gray-900">{serviceName}</strong>?
        </p>

        <div className="space-y-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
            <span className="text-xs text-gray-500 block">Đường dây nóng hỗ trợ khách hàng:</span>
            <span className="font-bold text-sky-700 text-base">1900 6868 (8:00 - 21:00)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
            <span className="text-xs text-gray-500 block">Email tư vấn lịch trình:</span>
            <span className="font-bold text-gray-800">support@travelmate.com</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
};

export default ServiceContactModal;

