import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Search } from "lucide-react";
import { api } from "../services/api";
import Footer from "../components/Footer";
import { ORIGINAL_DESTINATIONS } from "../components/home/homeConstants";
import AiPredictTab from "../components/home/AiPredictTab";
import PreferencesTab from "../components/home/PreferencesTab";
import DestinationsSection from "../components/home/DestinationsSection";
import HomeCtaBanner from "../components/home/HomeCtaBanner";

const Home = () => {
  const navigate = useNavigate();

  // Tab State: 'ai' | 'preferences'
  const [activeTab, setActiveTab] = useState("ai");

  // AI Prediction State
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [aiError, setAiError] = useState("");

  // Categories for Tab 2
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const handleSelectCategories = (catIds) => {
    setSelectedCategories(catIds);
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  // Load danh muc tu Database cho Tab 2
  useEffect(() => {
    let isMounted = true;
    api.locations
      .getCategories()
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setCategories(res);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Xu ly khi nhan duoc file anh (tu chon file hoac keo tha)
  const handleFileSelect = (file) => {
    if (!file) return;
    setAiError("");
    setPredictionResult(null);

    if (!file.type.startsWith("image/")) {
      setAiError("Vui lòng chọn tệp tin hình ảnh hợp lệ (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAiError("Dung lượng ảnh vượt quá giới hạn cho phép (Tối đa 5MB)");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Goi API nhan dien AI ResNet50
  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAiError("");

    try {
      const result = await api.ai.predict(selectedImage);
      setPredictionResult(result);
    } catch (err) {
      setAiError(
        err.message ||
          "Không thể thực hiện nhận diện ảnh. Vui lòng kiểm tra lại dịch vụ AI."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Huy bo va reset form upload
  const handleResetImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    setAiError("");
  };

  // Xu ly tim kiem theo so thich o Tab 2
  const handleSearchByPreference = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.append("category", selectedCategories.join(","));
    }
    if (searchKeyword.trim()) {
      params.append("search", searchKeyword.trim());
    }
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex justify-center items-center pt-24 pb-8 px-6 bg-[url('/src/assets/hero_bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="absolute top-0 left-0 w-full h-3/5 bg-gradient-to-b from-black/70 to-transparent z-0" />

        <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
          <h1 className="font-sans text-5xl md:text-6xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
            Khám phá Việt Nam theo cách của bạn
          </h1>
          <p className="font-sans text-lg md:text-xl text-white drop-shadow-md mb-12">
            Nhận diện tức thì địa danh qua hình ảnh và khám phá trải nghiệm du
            lịch cá nhân hóa.
          </p>

          {/* Interactive Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-left mx-auto max-w-4xl">
            {/* Tabs Header */}
            <div className="flex bg-slate-100 border-b border-slate-200">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab("ai")}
                onKeyDown={(e) => e.key === "Enter" && setActiveTab("ai")}
                className={`flex-1 p-5 flex items-center justify-center gap-2 font-semibold cursor-pointer transition-colors ${
                  activeTab === "ai"
                    ? "bg-white text-primary border-b-2 border-primary"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                <UploadCloud size={20} />
                <span>Nhận diện AI (ResNet50)</span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab("preferences")}
                onKeyDown={(e) => e.key === "Enter" && setActiveTab("preferences")}
                className={`flex-1 p-5 flex items-center justify-center gap-2 font-semibold cursor-pointer transition-colors ${
                  activeTab === "preferences"
                    ? "bg-white text-primary border-b-2 border-primary"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                <Search size={20} />
                <span>Khám phá theo sở thích</span>
              </div>
            </div>

            {/* Tab 1: Nhan dien AI */}
            {activeTab === "ai" && (
              <AiPredictTab
                previewUrl={previewUrl}
                isAnalyzing={isAnalyzing}
                predictionResult={predictionResult}
                aiError={aiError}
                onFileSelect={handleFileSelect}
                onImageChange={handleImageChange}
                onAnalyzeImage={handleAnalyzeImage}
                onResetImage={handleResetImage}
                onClearError={() => setAiError("")}
              />
            )}

            {/* Tab 2: Kham pha theo so thich */}
            {activeTab === "preferences" && (
              <PreferencesTab
                searchKeyword={searchKeyword}
                onSearchKeywordChange={setSearchKeyword}
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                onSelectCategories={handleSelectCategories}
                onClearCategories={handleClearCategories}
                onSubmit={handleSearchByPreference}
              />
            )}
          </div>
        </div>
      </section>

      {/* 10 Destinations Section */}
      <DestinationsSection destinations={ORIGINAL_DESTINATIONS} />

      {/* CTA Banner */}
      <HomeCtaBanner />

      <Footer />
    </div>
  );
};

export default Home;
