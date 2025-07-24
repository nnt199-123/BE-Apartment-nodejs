const { validateServiceBuildingInput } = require('../../validator/service_building.validator');
const serviceBuildingService = require('../../services/service_building.service');

exports.createServiceBuilding = async (req, res) => {
  try {
    const cleanData = validateServiceBuildingInput(req.body);
    const created = await serviceBuildingService.createServiceBuilding(cleanData);
    return res.status(201).json({ message: 'Tạo dịch vụ thành công', data: created });
  } catch (error) {
    console.error('Lỗi tạo service_building:', error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
exports.getallServiceBuildings = async (req, res) => {
  try {
    const serviceBuildings = await serviceBuildingService.getAllServiceBuildings();
    return res.status(200).json({ data: serviceBuildings });
  } catch (error) {
    console.error('Lỗi lấy danh sách dịch vụ:', error);
    return res.status(500).json({ error: error.message });
  }
};
exports.getServiceBuildingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID không hợp lệ' });

    const serviceBuilding = await serviceBuildingService.getServiceBuildingById(id);
    if (!serviceBuilding) return res.status(404).json({ error: 'Không tìm thấy dịch vụ tòa nhà' });

    return res.status(200).json({ data: serviceBuilding });
  } catch (error) {
    console.error('Lỗi lấy dịch vụ tòa nhà:', error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
exports.updateServiceBuilding = async (req, res) => {
  try {
    console.log('Yêu cầu cập nhật dịch vụ tòa nhà:', req.body);
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID không hợp lệ' });

    const existing = await serviceBuildingService.getServiceBuildingById(id);
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy dịch vụ tòa nhà' });

    const cleanData = validateServiceBuildingInput(req.body, true);
    const updated = await serviceBuildingService.updateServiceBuilding(id, cleanData);

    return res.status(200).json({ message: 'Cập nhật dịch vụ thành công', data: updated });
  } catch (error) {
    console.error('Lỗi cập nhật service_building:', error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

