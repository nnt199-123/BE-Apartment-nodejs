const {pool}= require("../../config/database/postgresql");
const feeService = require("../../services/fee.service");
const { validateFeeInput } = require("../../validator/fee.validator");
exports.createFee = async (req, res) => {
  try {
    const cleanData = validateFeeInput(req.body);
    const fee = await feeService.createFee(cleanData);
    return res.status(201).json({ message: 'Tạo phí thành công', data: fee });
  } catch (error) {
    console.error('Lỗi tạo phí:', error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
exports.updateFee = async (req, res) => {
  try {
    const feeId = parseInt(req.params.id);
    if (isNaN(feeId) || feeId <= 0) {
      return res.status(400).json({ error: 'ID phí không hợp lệ' });
    }
    const existingFee = await feeService.getFeeById(feeId);
    if (!existingFee) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi phí' });
    }
    const cleanData = validateFeeInput(req.body, true);

    const updatedFee = await feeService.updateFee(feeId, cleanData);

    return res.status(200).json({
      message: 'Cập nhật phí thành công',
      data: updatedFee
    });

  } catch (err) {
    console.error('Lỗi khi cập nhật phí:', err);
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.getAllFees = async (req, res) => {
  try {
    const fees = await feeService.getAllFees();
    return res.status(200).json({ data: fees });
  } catch (error) {
    console.error('Lỗi lấy danh sách phí:', error);
    return res.status(500).json({ error: error.message });
  }
};
exports.getFeeById = async (req, res) => {
  try {
    const feeId = parseInt(req.params.id);
    if (isNaN(feeId) || feeId <= 0) {
      return res.status(400).json({ error: 'ID phí không hợp lệ' });
    }
    const fee = await feeService.getFeeById(feeId);
    if (!fee) {
      return res.status(404).json({ error: 'Không tìm thấy phí' });
    }
    return res.status(200).json({ data: fee });
  } catch (error) {
    console.error('Lỗi lấy phí:', error);
    return res.status(500).json({ error: error.message });
  }
}