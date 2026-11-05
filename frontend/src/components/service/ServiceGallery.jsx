import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

const ServiceGallery = ({ images = [], serviceName = '' }) => {
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const openModal = (idx) => {
    setActivePhotoIndex(idx);
    setShowGalleryModal(true);
  };

  return (
    <>
      {/* 5-Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-3xl overflow-hidden mb-10 h-[300px] sm:h-[420px] md:h-[480px] shadow-sm">
        {/* Large photo left */}
        <div
          onClick={() => openModal(0)}
          className="md:col-span-2 h-full cursor-pointer group overflow-hidden relative bg-slate-100"
        >
          <img
            src={images[0]}
            alt={`${serviceName} 1`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
        </div>

        {/* 2 photos middle */}
        <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
          <div
            onClick={() => openModal(1)}
            className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
          >
            <img
              src={images[1]}
              alt={`${serviceName} 2`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
          </div>
          <div
            onClick={() => openModal(2)}
            className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
          >
            <img
              src={images[2]}
              alt={`${serviceName} 3`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
          </div>
        </div>

        {/* 2 photos right */}
        <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
          <div
            onClick={() => openModal(3)}
            className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
          >
            <img
              src={images[3]}
              alt={`${serviceName} 4`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
          </div>
          {/* Overlay "Xem tất cả ảnh" */}
          <div
            onClick={() => openModal(4)}
            className="cursor-pointer group overflow-hidden relative h-full bg-slate-100"
          >
            <img
              src={images[4]}
              alt={`${serviceName} 5`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/45 hover:bg-black/60 transition duration-300 flex items-center justify-center">
              <span className="text-white font-bold text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Xem tất cả ảnh
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowGalleryModal(false)}
        >
          <div
            className="max-w-4xl w-full relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition cursor-pointer p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full max-h-[75vh] rounded-2xl overflow-hidden mb-4 bg-black flex items-center justify-center">
              <img
                src={images[activePhotoIndex]}
                alt={`${serviceName} full`}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto p-2 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'border-sky-400 scale-105'
                      : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceGallery;

