// =========================
// 📁 services/asset.service.js
// =========================

const { pool } = require('../config/database/postgresql');

async function createAsset(data) {
  const {
    name, color, price,
    owner_id, room_id,
    warranty, created_at, updated_at
  } = data;

  const query = `
    INSERT INTO assets (name, color, price, owner_id, room_id, warranty, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [name, color, price, owner_id, room_id, warranty, created_at, updated_at];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getAssetById(id) {
  const { rows } = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);
  return rows[0];
}

async function updateAsset(id, data) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');

  const query = `
    UPDATE assets
    SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING *
  `;

  const { rows } = await pool.query(query, [...values, id]);
  return rows[0];
}
async function getAllAssets() {
  const { rows } = await pool.query('SELECT * FROM assets');
  return rows;
}

    

module.exports = {
  createAsset,
  getAssetById,
  updateAsset,
  getAllAssets
};