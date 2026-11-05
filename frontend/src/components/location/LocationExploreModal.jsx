import React from 'react';
import { X, ChevronRight } from 'lucide-react';

const LocationExploreModal = ({
  locationName,
  defaultImage = '/images/vinh_ha_long.jpg',
  activeTab,
  setActiveTab,
  searchKeyword,
  setSearchKeyword,
  filteredSpots = [],
  filteredHotels = [],
  spotsCount = 0,
  hotelsCount = 0,
  onClose,
  onNavigate,
  formatCurrency,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 w-full max-w-4xl h-full shadow-2xl flex flex-col transform transition-transform overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 sm:px-8 py-5 flex justify-between items-center border-b border-gray-100 shadow-sm z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Khám phá & Trải nghiệm
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Toàn bộ dịch vụ & điểm đến tiêu biểu tại {locationName}
            </p>
          </div>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Filter */}
          <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-5 overflow-y-auto flex-shrink-0">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex md:flex-col gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex-1 md:flex-none ${
                  activeTab === 'all'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tất cả ({spotsCount + hotelsCount})
              </button>
              <button
                onClick={() => setActiveTab('spots')}
                className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex-1 md:flex-none ${
                  activeTab === 'spots'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Điểm Check-in ({spotsCount})
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex-1 md:flex-none ${
                  activeTab === 'hotels'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Nơi lưu trú ({hotelsCount})
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(activeTab === 'all' || activeTab === 'spots') &&
                filteredSpots.map((spot) => (
                  <div
                    key={`modal-spot-${spot.maDiemTQ}`}
                    onClick={() => {
                      onClose();
                      onNavigate(`/service/attraction/${spot.maDiemTQ}`);
                    }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={spot.anhDaiDien || defaultImage}
                        alt={spot.ten}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 text-sky-700 px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                        Điểm tham quan
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 mb-1">
                          {spot.ten}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {spot.diemNoiBat || spot.moTa}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-emerald-700 font-semibold">
                          {spot.giaVe || 'Miễn phí'}
                        </span>
                        <span className="text-sky-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {(activeTab === 'all' || activeTab === 'hotels') &&
                filteredHotels.map((hotel) => (
                  <div
                    key={`modal-hotel-${hotel.maKhachSan}`}
                    onClick={() => {
                      onClose();
                      onNavigate(`/service/hotel/${hotel.maKhachSan}`);
                    }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={hotel.anhDaiDien || defaultImage}
                        alt={hotel.ten}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                        Khách sạn / Resort
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 leading-snug text-sm line-clamp-1">
                            {hotel.ten}
                          </h3>
                          {hotel.diemDanhGia && (
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded ml-1 flex-shrink-0">
                              {parseFloat(hotel.diemDanhGia).toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {hotel.diaChi}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-rose-600 font-bold text-sm">
                          {formatCurrency(hotel.giaThamKhao)}
                        </span>
                        <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Đặt phòng <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {filteredSpots.length === 0 && filteredHotels.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Không tìm thấy dịch vụ nào phù hợp với từ khóa "{searchKeyword}".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationExploreModal;

