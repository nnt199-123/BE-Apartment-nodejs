const express = require('express');
const router = express.Router();
const serviceBuildingController = require('../../../../controllers/service_buildings/service_building.controller');

/**
 * @swagger
 * tags:
 *   name: ServiceBuildings
 *   description: Quản lý dịch vụ của tòa nhà
 */

/**
 * @swagger
 * /service-buildings:
 *   get:
 *     summary: Lấy danh sách tất cả dịch vụ tòa nhà
 *     tags: [ServiceBuildings]
 *     responses:
 *       200:
 *         description: Trả về danh sách dịch vụ
 */
router.get('/', serviceBuildingController.getallServiceBuildings);

/**
 * @swagger
 * /service-buildings:
 *   post:
 *     summary: Tạo dịch vụ tòa nhà mới
 *     tags: [ServiceBuildings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo mới thành công
 */
router.post('/', serviceBuildingController.createServiceBuilding);

/**
 * @swagger
 * /service-buildings/{id}/detail:
 *   get:
 *     summary: Lấy chi tiết dịch vụ theo ID
 *     tags: [ServiceBuildings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của dịch vụ
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về chi tiết dịch vụ
 */
router.get('/:id/detail', serviceBuildingController.getServiceBuildingById);

/**
 * @swagger
 * /service-buildings/{id}/update:
 *   put:
 *     summary: Cập nhật thông tin dịch vụ
 *     tags: [ServiceBuildings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dịch vụ cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id/update', serviceBuildingController.updateServiceBuilding);

module.exports = router;
