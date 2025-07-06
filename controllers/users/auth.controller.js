const { pool } = require("../../config/database/postgresql");
const { registerUser, loginUser } = require("../../services/auth.service");


exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    await registerUser(email, password);
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Logged in successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  // Nếu dùng session/token thì xử lý ở đây
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, email, name,  created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('🔥 Error at /profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }

};
