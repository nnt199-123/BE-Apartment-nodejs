// ==========================
// 📁 controllers/rooms/room.controller.js
// ==========================

const { pool } = require("../../config/database/postgresql");
const roomService = require("../../services/room.service");
const { validateRoomInput } = require('../../validator/room');

// Tạo 1 phòng
exports.createRoom = async (req, res) => {
  try {
    const userId = req.user.userId;
    req.body.ownerId = userId;

    const cleanData = await validateRoomInput(req.body, userId);
    const created = await roomService.createRoom(cleanData);

    return res.status(201).json({
      message: 'Tạo phòng thành công',
      data: created
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Cập nhật 1 phòng
exports.updateRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);
    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'ID phòng không hợp lệ' });
    }
    const userId = req.user.userId;
    const existing = await roomService.getRoomById(roomId);
    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy phòng' });
    }
    if (existing.owner_id !== userId) {
      return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa phòng này' });
    }

    const cleanData = await validateRoomInput(req.body, userId, true, roomId);
    const updated = await roomService.updateRoom(roomId, cleanData);
    return res.status(200).json({ message: 'Cập nhật phòng thành công', data: updated });

  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ' });
  }
};

// Tạo nhiều phòng cùng lúc
exports.createManyRooms = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      quantity,
      roomsPerFloor,
      buildingId,
      price,
      deposit,
      size,
      maxTenants
    } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Số lượng phòng phải là số nguyên dương' });
    }

    if (!Number.isInteger(roomsPerFloor) || roomsPerFloor <= 0) {
      return res.status(400).json({ error: 'Số phòng mỗi tầng phải là số nguyên dương' });
    }

    const roomPromises = [];

    for (let i = 0; i < quantity; i++) {
      const roomName = `P${String(i + 1).padStart(2, '0')}`;
      const floor = Math.floor(i / roomsPerFloor) + 1;

      const roomData = {
        name: roomName,
        price,
        deposit,
        size,
        maxTenants,
        buildingId,
        floor
      };

      const cleanRoom = await validateRoomInput(roomData, userId);
      roomPromises.push(roomService.createRoom(cleanRoom));
    }

    const createdRooms = await Promise.all(roomPromises);

    return res.status(201).json({
      message: `Tạo ${createdRooms.length} phòng thành công`,
      data: createdRooms
    });

  } catch (error) {
    console.error('Error creating many rooms:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Cập nhật hàng loạt phòng
exports.updateRooms = async (req, res) => {
  try {
     console.log(req.body);
    const userId = req.user.userId;
    const { ids, updates } = req.body;
   

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Danh sách phòng cần cập nhật không hợp lệ' });
    }

    const results = [];

    for (const roomId of ids) {
      if (!Number.isInteger(roomId)) {
        results.push({ id: roomId, status: 'invalid_id', message: 'ID không hợp lệ' });
        continue;
      }

      const existing = await roomService.getRoomById(roomId);
      if (!existing) {
        results.push({ id: roomId, status: 'not_found', message: 'Không tìm thấy phòng' });
        continue;
      }

      if (existing.owner_id !== userId) {
        results.push({ id: roomId, status: 'unauthorized', message: 'Không có quyền chỉnh sửa phòng này' });
        continue;
      }

      try {
        const cleanData = await validateRoomInput(updates, userId, true, roomId);

        if (cleanData.floor !== undefined && cleanData.floor !== existing.floor) {
          results.push({
            id: roomId,
            status: 'warning_floor_change',
            message: `Tầng mới (${cleanData.floor}) khác với tầng cũ (${existing.floor})`
          });
        }

        const updated = await roomService.updateRoom(roomId, cleanData);
        results.push({ id: roomId, status: 'updated', data: updated });

      } catch (err) {
        results.push({ id: roomId, status: 'validation_error', message: err.message });
      }
    }

    return res.status(200).json({ message: 'Đã xử lý cập nhật hàng loạt', results });

  } catch (error) {
    console.error('❌ Error bulk updating rooms:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy tất cả phòng
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    return res.status(200).json({ data: rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Lấy 1 phòng theo ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);

    if (!room) {
      return res.status(404).json({ error: 'Phòng không tồn tại' });
    }

    return res.status(200).json({ data: room });
  } catch (error) {
    console.error('lỗi lấy phòng theo ID:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};
