const express = require('express');
const router = express.Router();

// Lấy danh sách người dùng
router.get('/', async (req, res) => {
    res.json({ message: 'All users' });
});

// Lấy chi tiết 1 user theo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id}` });
});

// Tạo mới user
router.post('/', async (req, res) => {
    const data = req.body;
    res.status(201).json({ message: 'User created', data });
});

// Cập nhật user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    res.json({ message: `User ${id} updated`, data });
});

// Xoá user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id} deleted` });
});

module.exports = router;
