const { pool } = require('../config/database/postgresql');

async function createServiceBuilding(data) {
  const { name, price, fee_id, building_id, created_at, updated_at } = data;
  const query = `
    INSERT INTO services (name, price, fee_id, building_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [name, price, fee_id, building_id, created_at, updated_at];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getAllServiceBuildings() {
  const { rows } = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
  return rows;
}

async function getServiceBuildingById(id) {
  const { rows } = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
  return rows[0];
}

async function updateServiceBuilding(id, data) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
  const query = `
    UPDATE services
    SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [...values, id]);
  return rows[0];
}

module.exports = {
  createServiceBuilding,
  getAllServiceBuildings,
  getServiceBuildingById,
  updateServiceBuilding
};
