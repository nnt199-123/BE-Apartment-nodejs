// =========================
// 📁 validators/fee.validator.js
// =========================

function validateFeeInput(data, isUpdate = false) {
  const errors = [];
  const clean = {};

  // ===== room_id =====
  if (!isUpdate || data.room_id !== undefined) {
    if (!Number.isInteger(data.room_id) || data.room_id <= 0) {
      errors.push('Phòng (room_id) không hợp lệ. Phải là số nguyên dương.');
    } else {
      clean.room_id = data.room_id;
    }
  }

  // ===== cycle_month =====
  if (!isUpdate || data.cycle_month !== undefined) {
    const cycleDate = new Date(data.cycle_month);
    if (isNaN(cycleDate.getTime())) {
      errors.push('Kỳ tính phí (cycle_month) không hợp lệ. Phải theo định dạng YYYY-MM-DD.');
    } else {
      // Ép về ngày đầu tháng
      cycleDate.setDate(1);
      clean.cycle_month = cycleDate;
    }
  }

  // ===== quantity =====
  if (data.quantity !== undefined) {
    const quantity = parseFloat(data.quantity);
    if (isNaN(quantity) || quantity < 0) {
      errors.push('Số lượng sử dụng (quantity) không hợp lệ.');
    } else if (quantity > 1000000) {
      errors.push('Số lượng vượt giới hạn cho phép.');
    } else {
      clean.quantity = quantity;
    }
  } else if (!isUpdate) {
    clean.quantity = 1.0; // default nếu không truyền
  }

  // ===== unit_price =====
  if (!isUpdate || data.unit_price !== undefined) {
    if (!Number.isInteger(data.unit_price) || data.unit_price < 0) {
      errors.push('Đơn giá (unit_price) không hợp lệ.');
    } else if (data.unit_price > 100_000_000) {
      errors.push('Đơn giá vượt giới hạn cho phép.');
    } else {
      clean.unit_price = data.unit_price;
    }
  }

  // ===== total_price =====
  if (!isUpdate || data.total_price !== undefined) {
    if (!Number.isInteger(data.total_price) || data.total_price < 0) {
      errors.push('Tổng tiền (total_price) không hợp lệ.');
    } else {
      const expectedTotal = Math.round((clean.quantity || 1.0) * (clean.unit_price || 0));
      if (!isUpdate && data.total_price !== expectedTotal) {
        errors.push(`Tổng tiền không đúng. Dự kiến: ${expectedTotal} đồng.`);
      } else {
        clean.total_price = data.total_price;
      }
    }
  }

  // ===== Timestamp =====
  if (!isUpdate) {
    clean.created_at = new Date();
  }
  clean.updated_at = new Date();

  if (errors.length > 0) {
    const err = new Error(errors.join(', '));
    err.statusCode = 400;
    throw err;
  }

  return clean;
}

module.exports = { validateFeeInput };
