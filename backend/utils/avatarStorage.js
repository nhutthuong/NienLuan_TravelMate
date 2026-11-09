const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');

const avatarDir = path.join(__dirname, '../uploads/avatars');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

/**
 * Xóa một file avatar trên đĩa nếu không còn bất kỳ người dùng nào trong hệ thống sử dụng
 * @param {string} avatarUrl - URL hoặc tên file của avatar
 * @returns {Promise<boolean>}
 */
const deleteAvatarFile = async (avatarUrl) => {
  try {
    if (!avatarUrl || typeof avatarUrl !== 'string') return false;

    // Không xử lý ảnh từ bên thứ ba (Google OAuth, URL tuyệt đối, data URI)
    if (
      avatarUrl.startsWith('http://') ||
      avatarUrl.startsWith('https://') ||
      avatarUrl.startsWith('data:')
    ) {
      return false;
    }

    const filename = path.basename(avatarUrl);
    if (!filename || !filename.startsWith('avatar-')) return false;

    const fullPath = path.join(avatarDir, filename);

    // Kiểm tra an toàn: ngăn chặn directory traversal
    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(path.resolve(avatarDir))) {
      return false;
    }

    if (!fs.existsSync(resolvedPath)) {
      return false;
    }

    // Kiểm tra xem trong CSDL còn người dùng nào đang sử dụng avatar này không
    const checkSql = `
      SELECT COUNT(*) AS count
      FROM NguoiDung
      WHERE avatar_url LIKE $1
    `;
    const checkRes = await query(checkSql, [`%${filename}%`]);
    const inUseCount = parseInt(checkRes.rows[0]?.count || 0, 10);

    // Nếu không còn ai dùng nữa, xóa file để giải phóng dung lượng
    if (inUseCount === 0) {
      await fs.promises.unlink(resolvedPath);
      console.log(`[Avatar Cleanup] Đã xóa file avatar cũ không còn sử dụng: ${filename}`);
      return true;
    }

    return false;
  } catch (err) {
    console.error('[Avatar Cleanup] Lỗi khi xóa file avatar:', err.message);
    return false;
  }
};

/**
 * Dọn dẹp toàn bộ file avatar rác/thừa trong thư mục uploads/avatars
 * Nguyên tắc: "Đang sử dụng thì mới để lại, không còn sử dụng nữa thì xóa"
 * @returns {Promise<number>} Số lượng file đã được xóa
 */
const cleanupUnusedAvatars = async () => {
  try {
    if (!fs.existsSync(avatarDir)) return 0;

    // Lấy toàn bộ các avatar_url đang được người dùng sử dụng
    const res = await query(`
      SELECT DISTINCT avatar_url
      FROM NguoiDung
      WHERE avatar_url IS NOT NULL AND avatar_url <> ''
    `);

    const activeFilenames = new Set(
      res.rows
        .map((r) => r.avatar_url)
        .filter((url) => url && typeof url === 'string')
        .map((url) => path.basename(url))
        .filter((name) => name && name.startsWith('avatar-'))
    );

    const filesOnDisk = await fs.promises.readdir(avatarDir);
    let deletedCount = 0;

    for (const file of filesOnDisk) {
      // Chỉ quét các file avatar do hệ thống sinh ra
      if (!file.startsWith('avatar-')) continue;

      if (!activeFilenames.has(file)) {
        const filePath = path.join(avatarDir, file);
        try {
          await fs.promises.unlink(filePath);
          deletedCount++;
          console.log(`[Avatar Cleanup] Đã dọn dẹp file avatar rác: ${file}`);
        } catch (unlinkErr) {
          console.error(`[Avatar Cleanup] Không thể xóa file ${file}:`, unlinkErr.message);
        }
      }
    }

    return deletedCount;
  } catch (err) {
    console.error('[Avatar Cleanup] Lỗi khi dọn dẹp avatar rác:', err.message);
    return 0;
  }
};

module.exports = {
  deleteAvatarFile,
  cleanupUnusedAvatars,
  avatarDir,
};

