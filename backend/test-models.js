const userModel = require('./models/userModel');
const locationModel = require('./models/locationModel');
const attractionModel = require('./models/attractionModel');
const hotelModel = require('./models/hotelModel');
const interactionModel = require('./models/interactionModel');

async function testAllModels() {
  try {
    console.log('Kiem tra cac models:');

    const admin = await userModel.findByEmail('admin@travelmate.com');
    console.log('- userModel.findByEmail:', admin ? admin.email : 'null');

    const locations = await locationModel.getAllLocations();
    console.log('- locationModel.getAllLocations:', locations.length, 'dia diem');

    const attractions = await attractionModel.getAllAttractions();
    console.log('- attractionModel.getAllAttractions:', attractions.length, 'diem tham quan');

    const hotels = await hotelModel.getAllHotels();
    console.log('- hotelModel.getAllHotels:', hotels.length, 'khach san');

    const reviews = await interactionModel.getAllReviews();
    console.log('- interactionModel.getAllReviews:', reviews.total, 'danh gia');

    console.log('Toan bo cac models hoat dong hoan hao voi PostgreSQL.');
    process.exit(0);
  } catch (err) {
    console.error('Loi khi kiem tra models:', err);
    process.exit(1);
  }
}

testAllModels();

