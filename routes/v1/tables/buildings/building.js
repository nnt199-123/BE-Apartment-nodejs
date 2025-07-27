const express = require('express');
const router = express.Router();
const buildingController = require('../../../../controllers/buildings/building.controller');
const { verifyToken } = require('../../../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Buildings
 *   description: Quản lý toà nhà
 */

/**
 * @swagger
 * /buildings:
 *   get:
 *     summary: Lấy danh sách toà nhà
 *     tags: [Buildings]
 *     responses:
 *       200:
 *         description: Thành công
 *
 * /buildings/create:
 *   post:
 *     summary: Tạo toà nhà
 *     tags: [Buildings]
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
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *
 * /buildings/{id}:
 *   get:
 *     summary: Lấy chi tiết toà nhà
 *     tags: [Buildings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Thành công
 *
 *   put:
 *     summary: Cập nhật toà nhà
 *     tags: [Buildings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

router.post('/create', verifyToken, buildingController.createBuilding);
router.put('/:id/PUT', verifyToken, buildingController.updateBuilding);
router.get('/', buildingController.getAllBuildings);
router.get('/:id/GET', buildingController.getBuildingById);
router.delete('/:id/DELETE', buildingController.deleteBuilding); // Assuming you have a delete function in the controller

module.exports = router;
