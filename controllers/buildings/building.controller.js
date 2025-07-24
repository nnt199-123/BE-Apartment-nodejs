const { pool } = require("../../config/database/postgresql");
const buildingService = require("../../services/building.service");
const { validateBuildingInput } = require('../../validator/building');

exports.createBuilding = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Không xác thực được người dùng' });
    }
    const cleanData = await validateBuildingInput(req.body, userId);
    const building = await buildingService.createBuilding(cleanData);
    return res.status(201).json({
      message: 'Tòa nhà được tạo thành công',
      data: building
    });
  } catch (error) {
    console.error('Error creating building:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await buildingService.getAllBuildings();
    return res.status(200).json({ message: 'Buildings retrieved successfully', data: buildings });
  } catch (error) {
    console.error('Error retrieving buildings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await buildingService.getBuildingById(id);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    return res.status(200).json({ message: 'Building retrieved successfully', data: building });
  } catch (error) {
    console.error('Error retrieving building:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.updateBuilding = async (req, res) => {
  try {
    const buildingId = parseInt(req.params.id);
    if (isNaN(buildingId)) {
      return res.status(400).json({ error: 'ID tòa nhà không hợp lệ' });
    }

    const userId = req.user.userId;

    // 1. Kiểm tra tòa nhà có tồn tại
    const existing = await buildingService.getBuildingById(buildingId);
    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy tòa nhà' });
    }

    // 2. Chỉ chủ sở hữu được cập nhật
    if (existing.owner_id !== userId) {
      return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa tòa nhà này' });
    }

    // 3. Gọi lại validator, tái sử dụng
    const cleanData = await validateBuildingInput(
      req.body, 
      userId,
      true,             // isUpdate = true
      buildingId        // để validator bỏ qua check trùng với chính mình
    );

    // 4. Gọi service cập nhật
    const updated = await buildingService.updateBuilding(buildingId, cleanData);

    return res.status(200).json({ message: 'Cập nhật tòa nhà thành công', data: updated });

  } catch (error) {
    console.error('Error updating building:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ' });
  }
};