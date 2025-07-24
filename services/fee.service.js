const { pool } = require('../config/database/postgresql');

exports.createFee = async (data) => {
  const {
    room_id, cycle_month, quantity,
    unit_price, total_price, created_at, updated_at
  } = data;

  const query = `
    INSERT INTO fees (room_id, cycle_month, quantity, unit_price, total_price, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [room_id, cycle_month, quantity, unit_price, total_price, created_at, updated_at];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
exports.updateFee = async (id, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
  const query = `
    UPDATE fees
    SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING *
  `;

  const { rows } = await pool.query(query, [...values, id]);
  return rows[0];
};
exports.getAllFees = async () => {
  const { rows } = await pool.query('SELECT * FROM fees ORDER BY cycle_month DESC');
  return rows;
};
exports.getFeeById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM fees WHERE id = $1', [id]);
  return rows[0];
};


