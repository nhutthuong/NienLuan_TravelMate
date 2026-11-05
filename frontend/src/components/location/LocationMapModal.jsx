import React from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';

const LocationMapModal = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl p-6 relative shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition cursor-pointer p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-600" />
            Bản đồ tương tác {location.ten}
          </h2>
          <p className="text-sm text-gray-500">
            Tọa độ:{' '}
            <span className="font-mono font-medium text-gray-700">
              {location.viDo}°N, {location.kinhDo}°E
            </span>{' '}
            • {location.tinhThanh}
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden h-[450px] border border-slate-200 shadow-inner bg-slate-100">
          <iframe
            src={`https://maps.google.com/maps?q=${location.viDo || 20.91},${location.kinhDo || 107.18}&hl=vi&z=12&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Bản đồ ${location.ten}`}
          ></iframe>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Sử dụng cử chỉ chuột để phóng to/thu nhỏ và di chuyển trên bản đồ.
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location.ten + ' ' + (location.tinhThanh || '')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <span>Mở trong Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LocationMapModal;

