const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const attractionRoutes = require('./routes/attractionRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const aiRoutes = require('./routes/aiRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { cleanupUnusedAvatars } = require('./utils/avatarStorage');
const { cleanupAllUnusedLocationImages } = require('./utils/locationStorage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TravelMate Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', locationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint khong ton tai' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Loi he thong', error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
    cleanupUnusedAvatars().catch((err) => {
      console.error('[Avatar Cleanup] Loi khi khoi dong:', err.message);
    });
    cleanupAllUnusedLocationImages().catch((err) => {
      console.error('[Location Image Cleanup] Loi khi khoi dong:', err.message);
    });
  });
}

module.exports = app;
