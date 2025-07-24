const express = require('express');
const router = express.Router();
const roomController = require('../../../../controllers/rooms/room.Controller');
const { verifyToken } = require('../../../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Quản lý phòng trong tòa nhà
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Lấy danh sách tất cả các phòng
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Trả về danh sách phòng
 */

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết phòng theo ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin phòng
 */

/**
 * @swagger
 * /rooms/create:
 *   post:
 *     summary: Tạo một phòng mới
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: P101
 *               buildingId:
 *                 type: string
 *                 example: 1
 *               floor:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Phòng được tạo thành công
 */

/**
 * @swagger
 * /rooms/{id}/update:
 *   put:
 *     summary: Cập nhật thông tin phòng
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               floor:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /rooms/create-many:
 *   post:
 *     summary: Tạo nhiều phòng cùng lúc
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: P301
 *                 buildingId:
 *                   type: string
 *                   example: 1
 *                 floor:
 *                   type: integer
 *                   example: 3
 *     responses:
 *       201:
 *         description: Tạo thành công
 */

/**
 * @swagger
 * /rooms/update-many:
 *   put:
 *     summary: Cập nhật nhiều phòng
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 floor:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

router.post('/create', verifyToken, roomController.createRoom);
router.put('/:id/update', verifyToken, roomController.updateRoom);
router.post('/create-many', verifyToken, roomController.createManyRooms);
router.put('/update-many', verifyToken, roomController.updateRooms);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

module.exports = router;
