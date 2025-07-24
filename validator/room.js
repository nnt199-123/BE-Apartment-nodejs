const buildingService = require('../services/building.service');
const roomService = require('../services/room.service');

async function validateRoomInput(data, ownerId, isUpdate = false, currentRoomId = null) {
  const {
    name,
    price,
    deposit,
    size,
    maxTenants,
    buildingId, // Chỉ dùng khi tạo mới
    floor
  } = data;

  const normalize = str => str.trim().replace(/\s+/g, ' ');
  const clean = {};
  let existingRoom = null;

  // Lấy dữ liệu gốc nếu là update
  if (isUpdate) {
    if (!currentRoomId) throw new Error('Thiếu ID phòng khi cập nhật');
    existingRoom = await roomService.getRoomById(currentRoomId);
    if (!existingRoom) throw new Error('Phòng không tồn tại');
  }

  // ===== Name =====
  if (!isUpdate || name !== undefined) {
    const finalName = name !== undefined ? normalize(name) : existingRoom?.name;
    if (!finalName || typeof finalName !== 'string' || finalName.trim() === '') {
      throw new Error('Tên phòng không được để trống');
    }
    if (finalName.length > 255) {
      throw new Error('Tên phòng quá dài');
    }

    const buildingIdToCheck = isUpdate
      ? existingRoom.building_id
      : buildingId;

    const existing = await roomService.findByNameInBuilding(finalName, buildingIdToCheck);
    if (existing && existing.id !== currentRoomId) {
      throw new Error('Tên phòng đã tồn tại trong tòa nhà');
    }

    clean.name = finalName;
  } else {
    clean.name = existingRoom.name;
  }

  // ===== Price =====
  clean.price = price !== undefined
    ? (typeof price === 'number' && price >= 0 ? price : (() => { throw new Error('Giá phòng không hợp lệ'); })())
    : existingRoom?.price;

  // ===== Deposit =====
  clean.deposit = deposit !== undefined
    ? (typeof deposit === 'number' && deposit >= 0 ? deposit : (() => { throw new Error('Tiền cọc không hợp lệ'); })())
    : existingRoom?.deposit;

  // ===== Size =====
  clean.size = size !== undefined
    ? (Number.isInteger(size) && size > 0 ? size : (() => { throw new Error('Diện tích không hợp lệ'); })())
    : existingRoom?.size;

  // ===== Max Tenants =====
  clean.max_tenants = maxTenants !== undefined
    ? (Number.isInteger(maxTenants) && maxTenants > 0 ? maxTenants : (() => { throw new Error('Số người tối đa không hợp lệ'); })())
    : existingRoom?.max_tenants;

  // ===== Floor =====
  clean.floors = floor !== undefined
    ? (Number.isInteger(floor) && floor >= 0 ? floor : (() => { throw new Error('Tầng không hợp lệ'); })())
    : existingRoom?.floors;

  // ===== Building ID =====
  if (!isUpdate) {
    if (!buildingId || typeof buildingId !== 'number') {
      throw new Error('Tòa nhà không hợp lệ');
    }
    const building = await buildingService.getBuildingById(buildingId);
    if (!building) {
      throw new Error('Tòa nhà không tồn tại');
    }
    clean.building_id = buildingId;
  } else {
    clean.building_id = existingRoom.building_id; // Không cho phép đổi
  }

  // ===== Owner =====
  if (!ownerId || typeof ownerId !== 'number') {
    throw new Error('Chủ sở hữu không hợp lệ');
  }
  clean.owner_id = ownerId;

  // ===== Active =====
  clean.active = isUpdate ? (existingRoom.active ?? true) : true;

  // ===== Timestamps =====
  if (!isUpdate) clean.created_at = new Date();
  clean.updated_at = new Date();

  return clean;
}

module.exports = { validateRoomInput };
