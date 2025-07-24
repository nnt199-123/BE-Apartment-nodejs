const express = require('express');
const router = express.Router();
const assetController = require('../../../../controllers/assets/asset.controller');
const { verifyToken } = require('../../../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: Quản lý tài sản
 */

/**
 * @swagger
 * /assets:
 *   get:
 *     summary: Lấy danh sách tất cả tài sản
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: Thành công
 *
 *   post:
 *     summary: Tạo tài sản mới
 *     tags: [Assets]
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
 *                 example: Máy lạnh LG
 *               value:
 *                 type: number
 *                 example: 15000000
 *     responses:
 *       201:
 *         description: Tạo thành công
 */

/**
 * @swagger
 * /assets/total-value:
 *   get:
 *     summary: Tổng giá trị tất cả tài sản
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /assets/{id}/detail:
 *   get:
 *     summary: Lấy chi tiết 1 tài sản
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID tài sản
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /assets/{id}/update:
 *   put:
 *     summary: Cập nhật tài sản
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
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
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

router.post('/', verifyToken, assetController.createAsset);
router.put('/:id/update', verifyToken, assetController.updateAsset);
router.get('/total-value', verifyToken, assetController.getTotalAssetValue);
router.get('/:id/detail', assetController.getAssetById);
router.get('/', assetController.getAllAssets);

module.exports = router;
