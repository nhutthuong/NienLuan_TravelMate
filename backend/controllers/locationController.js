const locationModel = require('../models/locationModel');
const attractionModel = require('../models/attractionModel');
const hotelModel = require('../models/hotelModel');

const getLocations = async (req, res) => {
  try {
    const { search, maLoaiHinh } = req.query;
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    const locations = await locationModel.getAllLocations(
      {
        search: search || '',
        maLoaiHinh: maLoaiHinh || '',
      },
      currentUserId
    );

    return res.status(200).json(locations);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getLocationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.maNguoiDung : null;

    const location = await locationModel.getById(id, currentUserId);
    if (!location) {
      return res.status(404).json({ message: 'Khong tim thay dia diem' });
    }

    const [attractions, hotels, relatedLocations] = await Promise.all([
      attractionModel.getSuggestedAttractions(id, currentUserId, 6),
      hotelModel.getSuggestedHotels(id, currentUserId, 6),
      locationModel.getRelatedLocations(id, 4),
    ]);

    return res.status(200).json({
      ...location,
      attractions,
      hotels,
      relatedLocations,
    });
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await locationModel.getAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getAmenities = async (req, res) => {
  try {
    const amenities = await locationModel.getAllAmenities();
    return res.status(200).json(amenities);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

const getActivities = async (req, res) => {
  try {
    const activities = await locationModel.getAllActivities();
    return res.status(200).json(activities);
  } catch (err) {
    return res.status(500).json({ message: `Loi may chu: ${err.message}` });
  }
};

module.exports = {
  getLocations,
  getLocationDetail,
  getCategories,
  getAmenities,
  getActivities,
};

