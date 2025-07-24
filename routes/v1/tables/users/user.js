const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 */
router.get('/', async (req, res) => {
    res.json({ message: 'All users' });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id}` });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 */
router.post('/', async (req, res) => {
    const data = req.body;
    res.status(201).json({ message: 'User created', data });
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    res.json({ message: `User ${id} updated`, data });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xoá người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng cần xoá
 *     responses:
 *       200:
 *         description: Xoá thành công
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id} deleted` });
});

module.exports = router;
