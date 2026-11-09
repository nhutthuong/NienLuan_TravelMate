import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  MapPin,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  X,
  Info,
} from "lucide-react";

const AiPredictTab = ({
  previewUrl,
  isAnalyzing,
  predictionResult,
  aiError,
  onFileSelect,
  onImageChange,
  onAnalyzeImage,
  onResetImage,
  onClearError,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="p-8">
      {/* Thong bao loi neu co */}
      {aiError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Lỗi nhận diện</p>
            <p className="text-xs text-rose-600 mt-0.5">{aiError}</p>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-rose-400 hover:text-rose-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Khi chua chon anh */}
      {!previewUrl && (
        <label
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center text-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group ${
            isDragging
              ? "border-primary bg-sky-50/90 scale-[1.01] shadow-inner"
              : "border-slate-300 hover:border-primary hover:bg-sky-50"
          }`}
        >
          <div
            className={`p-4 rounded-full mb-4 transition-transform duration-200 ${
              isDragging
                ? "bg-primary text-white scale-110 shadow-md"
                : "bg-sky-100 text-primary group-hover:scale-105"
            }`}
          >
            <UploadCloud
              size={40}
              className={isDragging ? "text-white" : "text-primary"}
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">
            {isDragging
              ? "Thả ảnh phong cảnh vào đây để tải lên"
              : "Kéo thả ảnh phong cảnh vào đây hoặc tải lên từ máy"}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Tự động phân loại danh thắng qua mạng nơ-ron ResNet50 (Tối đa 5MB)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
          <div className="btn-primary">Chọn ảnh từ thiết bị</div>
        </label>
      )}

      {/* Khi da chon anh va chua co ket qua */}
      {previewUrl && !predictionResult && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[400px] rounded-xl object-cover shadow-md"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3" />
                <p className="font-bold text-base">Đang phân tích phong cảnh...</p>
                <p className="text-xs text-sky-200 mt-1">
                  Mạng ResNet50 đang trích xuất đặc trưng nhận dạng
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              className="btn-primary inline-flex items-center gap-2"
              onClick={onAnalyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Đang phân tích...</span>
                </>
              ) : (
                "Phân tích ảnh"
              )}
            </button>
            <button
              className="px-6 py-3 rounded-xl font-semibold border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-50"
              onClick={onResetImage}
              disabled={isAnalyzing}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      {/* Khi da co ket qua du doan AI */}
      {predictionResult && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Thumbnail */}
            <div className="relative w-full md:w-52 h-44 rounded-xl overflow-hidden shrink-0 shadow-sm bg-black">
              <img
                src={previewUrl}
                alt={predictionResult.prediction.tenDiaDiem}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-bold ${predictionResult.prediction.lowConfidence
                ? "bg-amber-900/80 text-amber-200 border border-amber-500/40"
                : "bg-black/70 text-white"
                }`}>
                Độ tin cậy: {predictionResult.prediction.doTinCay}%
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center">
                {predictionResult.prediction.lowConfidence ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-300">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span>Độ tin cậy dưới ngưỡng khuyến nghị</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-primary text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    <span>Đã nhận diện thành công</span>
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {predictionResult.prediction.tenDiaDiem}
                </h2>
                {(predictionResult.location?.tinhThanh ||
                  predictionResult.location?.tinhthanh) && (
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin size={15} className="text-primary shrink-0" />
                      <span>
                        {predictionResult.location.tinhThanh ||
                          predictionResult.location.tinhthanh}
                      </span>
                      {(predictionResult.location.danhHieu ||
                        predictionResult.location.danhhieu) && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600">
                              {predictionResult.location.danhHieu ||
                                predictionResult.location.danhhieu}
                            </span>
                          </>
                        )}
                    </p>
                  )}
              </div>

              {predictionResult.prediction.lowConfidence && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800 text-xs">
                  <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    Ảnh có độ tin cậy dưới ngưỡng khuyến nghị. Bạn có thể tham khảo thêm các địa danh tương tự trong Top-3 bên dưới.
                  </span>
                </div>
              )}

              {/* Top-3 Softmax */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Xác suất dự đoán Top-3
                </p>
                <div className="space-y-2">
                  {(predictionResult.prediction?.topK || []).map((k, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <Link
                          to={`/location/${k.maDiaDiem}`}
                          state={{
                            fromAI: true,
                            confidence: `${k.confidence}%`,
                            topK: predictionResult.prediction?.topK || [],
                          }}
                          className={`hover:underline cursor-pointer ${
                            idx === 0
                              ? "text-primary font-bold"
                              : "text-slate-600 hover:text-primary"
                          }`}
                        >
                          #{idx + 1} {k.ten}
                        </Link>
                        <span
                          className={
                            idx === 0
                              ? "text-primary font-bold"
                              : "text-slate-500"
                          }
                        >
                          {k.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${idx === 0 ? "bg-primary" : "bg-slate-400"
                            }`}
                          style={{ width: `${k.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons Action */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onResetImage}
                  className="px-5 py-2.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors text-sm inline-flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw size={15} />
                  <span>Thử ảnh khác</span>
                </button>
                <Link
                  to={`/location/${predictionResult.prediction.maDiaDiem}`}
                  state={{
                    fromAI: true,
                    confidence: `${predictionResult.prediction.doTinCay}%`,
                    topK: predictionResult.prediction?.topK || [],
                  }}
                  className="btn-primary py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Khám phá toàn bộ {predictionResult.prediction.tenDiaDiem}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPredictTab;
