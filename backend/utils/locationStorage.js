const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');

const locationImagesDir = path.resolve(__dirname, '../../frontend/public/images');
const distImagesDir = path.resolve(__dirname, '../../frontend/dist/images');

// Đảm bảo thư mục public/images tồn tại
if (!fs.existsSync(locationImagesDir)) {
  fs.mkdirSync(locationImagesDir, { recursive: true });
}

/**
 * Xóa một file ảnh địa danh trên đĩa nếu không còn bất kỳ địa danh nào trong DiaDiem sử dụng
 * @param {string} imageUrl - URL hoặc đường dẫn ảnh (VD: /images/cho_noi.jpg)
 * @returns {Promise<boolean>} - true nếu đã xóa file, false nếu file đang được dùng hoặc không hợp lệ
 */
const deleteLocationImageFile = async (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return false;

    // Không xử lý ảnh URL tuyệt đối bên thứ ba hoặc data URI
    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('data:')
    ) {
      return false;
    }

    const filename = path.basename(imageUrl);
    if (!filename) return false;

    // Ngăn chặn directory traversal
    const fullPath = path.join(locationImagesDir, filename);
    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(path.resolve(locationImagesDir))) {
      return false;
    }

    // Kiểm tra xem trong bảng DiaDiem còn địa danh nào đang sử dụng ảnh này không
    const checkSql = `
      SELECT COUNT(*) AS count
      FROM DiaDiem
      WHERE anh_url LIKE $1
    `;
    const checkRes = await query(checkSql, [`%${filename}%`]);
    const inUseCount = parseInt(checkRes.rows[0]?.count || 0, 10);

    // Nếu không còn địa danh nào sử dụng nữa, xóa file để giải phóng dung lượng
    if (inUseCount === 0) {
      if (fs.existsSync(resolvedPath)) {
        await fs.promises.unlink(resolvedPath);
        console.log(`[Location Cleanup] Đã xóa file ảnh không còn sử dụng: ${filename}`);
      }

      // Xóa cả trong frontend/dist/images nếu có
      if (fs.existsSync(distImagesDir)) {
        const distFilePath = path.join(distImagesDir, filename);
        if (fs.existsSync(distFilePath)) {
          try {
            await fs.promises.unlink(distFilePath);
          } catch (e) {
            // bỏ qua nếu không xóa được trên dist
          }
        }
      }

      return true;
    }

    return false;
  } catch (err) {
    console.error('[Location Cleanup] Lỗi khi xóa file ảnh địa danh:', err.message);
    return false;
  }
};

/**
 * Dọn dẹp toàn bộ file ảnh địa danh thừa trong thư mục public/images
 * Nguyên tắc: "Đang sử dụng thì mới để lại, không còn sử dụng nữa thì xóa"
 * @returns {Promise<number>} Số lượng file đã được xóa
 */
const cleanupAllUnusedLocationImages = async () => {
  try {
    if (!fs.existsSync(locationImagesDir)) return 0;

    // Lấy toàn bộ các anh_url đang được DiaDiem sử dụng
    const res = await query(`
      SELECT DISTINCT anh_url
      FROM DiaDiem
      WHERE anh_url IS NOT NULL AND anh_url <> ''
    `);

    const activeFilenames = new Set(
      res.rows
        .map((r) => r.anh_url)
        .filter((url) => url && typeof url === 'string')
        .map((url) => path.basename(url))
        .filter((name) => Boolean(name))
    );

    const filesOnDisk = await fs.promises.readdir(locationImagesDir);
    let deletedCount = 0;

    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    for (const file of filesOnDisk) {
      const ext = path.extname(file).toLowerCase();
      if (!allowedExts.includes(ext)) continue;

      if (!activeFilenames.has(file)) {
        const filePath = path.join(locationImagesDir, file);
        try {
          await fs.promises.unlink(filePath);
          deletedCount++;
          console.log(`[Location Cleanup] Đã dọn dẹp ảnh địa danh rác: ${file}`);

          if (fs.existsSync(distImagesDir)) {
            const distFilePath = path.join(distImagesDir, file);
            if (fs.existsSync(distFilePath)) {
              await fs.promises.unlink(distFilePath).catch(() => {});
            }
          }
        } catch (unlinkErr) {
          console.error(`[Location Cleanup] Không thể xóa file ${file}:`, unlinkErr.message);
        }
      }
    }

    return deletedCount;
  } catch (err) {
    console.error('[Location Cleanup] Lỗi khi dọn dẹp ảnh địa danh:', err.message);
    return 0;
  }
};

module.exports = {
  deleteLocationImageFile,
  cleanupAllUnusedLocationImages,
  locationImagesDir,
  distImagesDir,
};

