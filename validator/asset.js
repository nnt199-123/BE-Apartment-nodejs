// =========================
// 📁 validators/asset.validator.js
// =========================

function validateAssetInput(data, ownerIdFromToken, isUpdate = false) {
  const errors = [];
  const clean = {};

  // ===== Tên thiết bị =====
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Tên thiết bị không được để trống');
    } else if (data.name.length > 100) {
      errors.push('Tên thiết bị vượt quá 100 ký tự');
    } else {
      clean.name = data.name.trim();
    }
  }

  // ===== Màu sắc =====
  if (data.color !== undefined) {
    if (typeof data.color !== 'string') {
      errors.push('Màu sắc phải là chuỗi');
    } else if (data.color.length > 50) {
      errors.push('Màu sắc vượt quá 50 ký tự');
    } else {
      clean.color = data.color.trim();
    }
  }

  // ===== Giá =====
  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || data.price === null) {
      errors.push('Giá là bắt buộc');
    } else if (typeof data.price !== 'number' || isNaN(data.price)) {
      errors.push('Giá phải là số');
    } else if (data.price < 0) {
      errors.push('Giá không được âm');
    } else if (data.price > 1_000_000_000) {
      errors.push('Giá vượt quá giới hạn cho phép (1 tỷ đồng)');
    } else {
      clean.price = data.price;
    }
  }

  // ===== Chủ sở hữu (lấy từ token) =====
  if (!ownerIdFromToken || typeof ownerIdFromToken !== 'number' || ownerIdFromToken <= 0) {
    errors.push('ownerId từ token không hợp lệ');
  } else {
    clean.owner_id = ownerIdFromToken;
  }

  // ===== Phòng =====
  if (data.roomId !== undefined) {
    if (typeof data.roomId !== 'number' || data.roomId <= 0) {
      errors.push('roomId không hợp lệ');
    } else {
      clean.room_id = data.roomId;
    }
  }

  // ===== Ngày bảo hành =====
  if (data.warranty !== undefined) {
    const warrantyDate = new Date(data.warranty);
    const now = new Date();
    if (isNaN(warrantyDate.getTime())) {
      errors.push('Ngày bảo hành không hợp lệ');
    } else if (warrantyDate < now) {
      errors.push('Ngày bảo hành không thể trong quá khứ');
    } else {
      clean.warranty = warrantyDate;
    }
  }

  if (!isUpdate) {
    clean.created_at = new Date();
  }
  clean.updated_at = new Date();

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    throw error;
  }

  return clean;
}

module.exports = { validateAssetInput };
