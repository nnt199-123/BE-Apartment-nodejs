const express = require('express');
const router = express.Router();
const feeController = require('../../../../controllers/fees/fee.controller');

/**
 * @swagger
 * tags:
 *   name: Fees
 *   description: Quản lý phí dịch vụ
 */

/**
 * @swagger
 * /fees:
 *   get:
 *     summary: Lấy danh sách các loại phí
 *     tags: [Fees]
 *     responses:
 *       200:
 *         description: Danh sách phí
 *
 *   post:
 *     summary: Tạo một loại phí mới
 *     tags: [Fees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phí quản lý
 *               amount:
 *                 type: number
 *                 example: 500000
 *     responses:
 *       201:
 *         description: Tạo thành công
 */

/**
 * @swagger
 * /fees/{id}/update:
 *   put:
 *     summary: Cập nhật thông tin phí
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phí bảo trì
 *               amount:
 *                 type: number
 *                 example: 750000
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /fees/{id}/detail:
 *   get:
 *     summary: Lấy chi tiết một loại phí
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết phí
 */

router.post('/', feeController.createFee);
router.put('/:id/update', feeController.updateFee);
router.get('/', feeController.getAllFees);  
router.get('/:id/detail', feeController.getFeeById);

module.exports = router;
