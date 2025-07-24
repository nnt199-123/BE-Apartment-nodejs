const buildingService = require('../services/building.service');
const userService = require('../services/auth.service');


async function validateBuildingInput(data, ownerId, isUpdate = false, currentBuildingId = null) {
  const { name, address, rooms, shortName } = data;

  const normalize = str => str.trim().replace(/\s+/g, ' ');
  const clean = {};

  // ===== Validate name =====
  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Tên tòa nhà không được để trống');
    }
    if (name.length > 255) {
      throw new Error('Tên tòa nhà quá dài');
    }

    const existing = await buildingService.findByNameInsensitive(name.trim());
    if (existing && existing.id !== currentBuildingId) {
      throw new Error('Tên tòa nhà đã tồn tại');
    }

    clean.name = normalize(name);
  }

  // ===== Validate address =====
  if (!isUpdate || address !== undefined) {
    if (!address || typeof address !== 'string' || address.trim() === '') {
      throw new Error('Địa chỉ không được để trống');
    }
    if (address.length > 500) {
      throw new Error('Địa chỉ quá dài');
    }

    const addressUsed = await buildingService.findByExactAddress(address.trim());
    if (addressUsed && addressUsed.id !== currentBuildingId) {
      throw new Error('Địa chỉ này đã được sử dụng');
    }

    clean.full_address = normalize(address);
  }

  // ===== Validate rooms =====
  if (!isUpdate || rooms !== undefined) {
    if (
      rooms === undefined || rooms === null ||
      typeof rooms !== 'number' || rooms < 0 || !Number.isInteger(rooms)
    ) {
      throw new Error('Số phòng phải là số nguyên không âm');
    }
    clean.rooms = rooms;
  }

  // ===== Validate shortName =====
  if (shortName !== undefined) {
    if (typeof shortName !== 'string') {
      throw new Error('Tên viết tắt không hợp lệ');
    }
    if (shortName.length > 50) {
      throw new Error('Tên viết tắt quá dài');
    }
    clean.short_name = shortName.trim();
  }

  // ===== Validate ownerId =====
  if (!ownerId || typeof ownerId !== 'number') {
    throw new Error('Chủ sở hữu không hợp lệ');
  }

  clean.owner_id = ownerId;

  // ===== Timestamps =====
  if (!isUpdate) {
    clean.created_at = new Date();
  }
  clean.updated_at = new Date();

  return clean;
}

module.exports = { validateBuildingInput };
