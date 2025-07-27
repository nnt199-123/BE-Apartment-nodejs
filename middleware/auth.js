// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'my-secret';

exports.verifyToken = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: 'Không tìm thấy token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);

    // 👇 Phân loại lỗi rõ ràng hơn
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token đã hết hạn. Vui lòng đăng nhập lại.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token không hợp lệ. Có thể đã bị chỉnh sửa hoặc sai SECRET.' });
    }

    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ error: 'Token chưa được kích hoạt. Vui lòng thử lại sau.' });
    }

    // Lỗi không xác định
    return res.status(401).json({ error: 'Lỗi xác thực token.' });
  }
};
