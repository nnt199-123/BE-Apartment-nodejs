// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'my-secret';

exports.verifyToken = (req, res, next) => {
  // 👇 1. Ưu tiên đọc từ cookie
  const cookieToken = req.cookies?.token;

  // 👇 2. Nếu không có thì đọc từ Authorization header
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  // 👇 3. Chọn token nào có
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: 'Không tìm thấy token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // chứa userId, email, iat, exp
    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
