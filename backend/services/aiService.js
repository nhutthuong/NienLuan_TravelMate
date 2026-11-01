const axios = require('axios');
const FormData = require('form-data');

const getAiServiceUrl = () => process.env.AI_SERVICE_URL || 'http://localhost:5001';
const getConfidenceThreshold = () => parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '50');

const predictImage = async (imageBuffer, originalFilename = 'upload.jpg') => {
  if (!imageBuffer) {
    throw new Error('Du lieu tep anh khong ton tai');
  }

  const formData = new FormData();
  formData.append('image', imageBuffer, {
    filename: originalFilename,
    contentType: 'image/jpeg',
  });

  const aiUrl = getAiServiceUrl();

  try {
    const response = await axios.post(`${aiUrl}/api/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 15000,
    });

    const data = response.data;
    const threshold = getConfidenceThreshold();
    const confidence = parseFloat(data.confidence || 0);

    return {
      predictedIndex: data.predicted_index,
      maDiaDiem: data.ma_dia_diem,
      locationName: data.location_name,
      confidence,
      topK: (data.top_k || []).map((item) => ({
        index: item.index,
        maDiaDiem: item.ma_dia_diem,
        locationName: item.location_name,
        confidence: item.confidence,
      })),
      lowConfidence: confidence < threshold,
    };
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(`Dich vu AI bao loi: ${err.response.data.error}`);
    }
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Khong the ket noi den dich vu AI. Vui long kiem tra lai tien trinh Flask tren cong 5001');
    }
    throw new Error(`Loi khi goi dich vu nhan dien AI: ${err.message}`);
  }
};

const checkAiHealth = async () => {
  const aiUrl = getAiServiceUrl();
  try {
    const res = await axios.get(`${aiUrl}/health`, { timeout: 5000 });
    return res.data;
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
    };
  }
};

module.exports = {
  predictImage,
  checkAiHealth,
};

