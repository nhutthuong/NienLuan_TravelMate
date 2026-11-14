const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mediaDir = path.join(__dirname, '../uploads/media');
const historyDir = path.join(__dirname, '../uploads/history');
const avatarDir = path.join(__dirname, '../uploads/avatars');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Dinh dang tep khong duoc ho tro. Vui long tai len anh JPG, PNG hoac WEBP.'), false);
  }
};

const memoryStorage = multer.memoryStorage();

const uploadPredict = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

const mediaDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

const uploadMedia = multer({
  storage: mediaDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

const avatarDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const uploadAvatar = multer({
  storage: avatarDiskStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const locationImagesDir = path.resolve(__dirname, '../../frontend/public/images');
if (!fs.existsSync(locationImagesDir)) {
  fs.mkdirSync(locationImagesDir, { recursive: true });
}

const locationDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, locationImagesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `location_${cleanBase || 'img'}_${uniqueSuffix}${ext}`);
  },
});

const uploadLocationImage = multer({
  storage: locationDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

module.exports = {
  uploadPredict,
  uploadMedia,
  uploadAvatar,
  uploadLocationImage,
  mediaDir,
  historyDir,
  avatarDir,
  locationImagesDir,
};

