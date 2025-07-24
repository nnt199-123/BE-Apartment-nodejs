
const { pool } = require('../../config/database/postgresql');
const { validateAssetInput } = require('../../validator/asset');
const assetService = require('../../services/asset.service');

exports.createAsset = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cleanData = validateAssetInput(req.body, userId);
    const asset = await assetService.createAsset(cleanData);
    return res.status(201).json({ message: 'Tạo tài sản thành công', data: asset });
  } catch (error) {
    console.error('Error creating asset:', error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
exports.updateAsset = async (req, res) => {
  try {
    const assetId = parseInt(req.params.id);
    if (isNaN(assetId)) {
      return res.status(400).json({ error: 'ID thiết bị không hợp lệ' });
    }

    const existing = await assetService.getAssetById(assetId);
    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy thiết bị' });
    }

    if (existing.owner_id !== req.user.userId) {
      return res.status(403).json({ error: 'Bạn không có quyền sửa thiết bị này' });
    }

    const cleanData = validateAssetInput(req.body, req.user.userId, true);
    const updated = await assetService.updateAsset(assetId, cleanData);

    return res.status(200).json({ message: 'Cập nhật thiết bị thành công', data: updated });
  } catch (err) {
    console.error('Lỗi cập nhật asset:', err);
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.getTotalAssetValue = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT COALESCE(SUM(price), 0) AS total_value FROM assets WHERE owner_id = $1',
      [userId]
    );
    return res.status(200).json({
      message: 'Tổng giá trị tài sản',
      total: parseInt(result.rows[0].total_value, 10)
    });
  } catch (error) {
    console.error('Lỗi truy vấn tổng giá trị tài sản:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const assetId = parseInt(req.params.id);
    if (isNaN(assetId)) {
      return res.status(400).json({ error: 'ID thiết bị không hợp lệ' });
    }

    const asset = await assetService.getAssetById(assetId);
    if (!asset) {
      return res.status(404).json({ error: 'Không tìm thấy thiết bị' });
    }

    return res.status(200).json({ data: asset });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return res.status(500).json({ error: error.message });
  }
};      
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await assetService.getAllAssets();
    return res.status(200).json({ data: assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return res.status(500).json({ error: error.message });
  }
};  
