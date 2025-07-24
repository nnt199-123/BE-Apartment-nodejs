function validateServiceBuildingInput(data) {
  const errors = [];
  const clean = {};

  // ===== Tên dịch vụ =====
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Tên dịch vụ không được để trống');
  } else if (data.name.trim().length > 100) {
    errors.push('Tên dịch vụ vượt quá 100 ký tự');
  } else {
    clean.name = data.name.trim();
  }

  // ===== Giá =====
  if (data.price === undefined || data.price === null) {
    errors.push('Giá là bắt buộc');
  } else if (typeof data.price !== 'number' || isNaN(data.price)) {
    errors.push('Giá phải là một số hợp lệ');
  } else if (data.price < 0) {
    errors.push('Giá không được âm');
  } else if (data.price > 10_000_000_000) {
    errors.push('Giá vượt giới hạn cho phép (10 tỷ)');
  } else {
    clean.price = data.price;
  }
  
  // ===== Fee ID =====
  if (!data.fee_id || typeof data.fee_id !== 'number' || data.fee_id <= 0) {
    errors.push('fee_id phải là số nguyên dương');
  } else {
    clean.fee_id = data.fee_id;
  }

  // ===== Building ID =====
  if (!data.building_id || typeof data.building_id !== 'number' || data.building_id <= 0) {
    errors.push('building_id phải là số nguyên dương');
  } else {
    clean.building_id = data.building_id;
  }

  // ===== Timestamp =====
  clean.created_at = new Date();
  clean.updated_at = new Date();

  // ===== Trả lỗi nếu có =====
  if (errors.length > 0) {
    const error = new Error(errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  return clean;
}

module.exports = { validateServiceBuildingInput };
