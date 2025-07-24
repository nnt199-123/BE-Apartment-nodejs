const { pool } = require('../config/database/postgresql');

async function createBuilding({
  name,
  full_address,
  short_name,
  rooms,
  owner_id,
  created_at,
  updated_at
}) {
  const query = `
    INSERT INTO buildings (
      name, full_address, short_name, rooms, owner_id, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    name,
    full_address,
    short_name,
    rooms,
    owner_id,
    created_at,
    updated_at
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByNameInsensitive(name) {
  const query = `
    SELECT * FROM buildings WHERE LOWER(name) = LOWER($1) LIMIT 1;
  `;
  const { rows } = await pool.query(query, [name]);
  return rows[0];
}

async function findByExactAddress(address) {
  const query = `
    SELECT * FROM buildings WHERE full_address = $1 LIMIT 1;
  `;
  const { rows } = await pool.query(query, [address]);
  return rows[0];
}

async function getAllBuildings() {
  const query = 'SELECT * FROM buildings ORDER BY created_at DESC;';
  const { rows } = await pool.query(query);
  return rows;
}
async function getBuildingById(id) {
  const query = 'SELECT * FROM buildings WHERE id = $1;';           
  const { rows } = await pool.query
(query, [id]);
  return rows[0]; 
}
async function updateBuilding(id, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) return null; // không có gì để update

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const query = `
    UPDATE buildings
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

module.exports = {
  createBuilding,
  findByNameInsensitive,
  findByExactAddress,
  getAllBuildings,
  getBuildingById,
  updateBuilding
};
