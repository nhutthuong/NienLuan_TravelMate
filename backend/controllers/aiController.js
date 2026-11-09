const path = require('path');
const fs = require('fs');
const aiService = require('../services/aiService');
const locationModel = require('../models/locationModel');
const hotelModel = require('../models/hotelModel');
const attractionModel = require('../models/attractionModel');
const interactionModel = require('../models/interactionModel');
const { historyDir } = require('../middleware/uploadMiddleware');

const predict = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'Vui long tai len tep anh hop le de nhan dien' });
    }

    const aiResult = await aiService.predictImage(req.file.buffer, req.file.originalname);
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    let anhTaiLenUrl = null;

    if (currentUserId) {
      try {
        const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
        const filename = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
        const targetPath = path.join(historyDir, filename);
        await fs.promises.writeFile(targetPath, req.file.buffer);
        anhTaiLenUrl = `/uploads/history/${filename}`;

        await interactionModel.saveSearchHistory(
          currentUserId,
          aiResult.maDiaDiem,
          anhTaiLenUrl,
          aiResult.confidence,
          aiResult.topK
        );
      } catch (saveErr) {
        console.error('Loi khi luu lich su tim kiem:', saveErr.message);
      }
    }

    const topKIds = (aiResult.topK || []).map((k) => k.maDiaDiem).filter(Boolean);
    const [location, suggestedHotels, suggestedAttractions, topKDetails] = await Promise.all([
      locationModel.getById(aiResult.maDiaDiem, currentUserId),
      hotelModel.getSuggestedHotels(aiResult.maDiaDiem, currentUserId, 6),
      attractionModel.getSuggestedAttractions(aiResult.maDiaDiem, currentUserId, 6),
      locationModel.getMultipleByIds(topKIds),
    ]);

    const detailsMap = new Map((topKDetails || []).map((d) => [d.maDiaDiem, d]));

    const enrichedTopK = (aiResult.topK || []).map((k, idx) => {
      const detail = detailsMap.get(k.maDiaDiem) || {};
      return {
        index: idx,
        maDiaDiem: k.maDiaDiem,
        ten: detail.ten || k.locationName,
        tinhThanh: detail.tinhThanh || '',
        danhHieu: detail.danhHieu || '',
        anhUrl: detail.anhUrl || '',
        confidence: k.confidence,
      };
    });

    return res.status(200).json({
      prediction: {
        maDiaDiem: aiResult.maDiaDiem,
        tenDiaDiem: aiResult.locationName,
        doTinCay: aiResult.confidence,
        lowConfidence: aiResult.lowConfidence,
        topK: enrichedTopK,
        anhTaiLenUrl,
      },
      location,
      suggestedHotels,
      suggestedAttractions,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Loi xu ly nhan dien hinh anh' });
  }
};

module.exports = {
  predict,
};

