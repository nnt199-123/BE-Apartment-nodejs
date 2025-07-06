const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database/postgresql');

const SECRET = process.env.JWT_SECRET || 'your-secret-key'; // nhớ khai báo .env

exports.registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2)';
  await pool.query(query, [email, hashedPassword]);
  return { success: true, msg: 'Đăng ký thành công' };
};

exports.loginUser = async (email, password) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    return { success: false, msg: 'Tài khoản không tồn tại' };
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return { success: false, msg: 'Sai mật khẩu' };
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
  );

  
  return {
    success: true,
    msg: 'Đăng nhập thành công',
    token,
    user: { id: user.id, email: user.email },
  };
};
