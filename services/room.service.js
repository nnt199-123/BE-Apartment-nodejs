  const { pool } = require('../config/database/postgresql');

async function createRoom(data) {
  const query = `
    INSERT INTO rooms (
      name, price, deposit, size, max_tenants,
      building_id, floors, owner_id,
      active, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *;
  `;
  const values = [
    data.name,
    data.price,
    data.deposit,
    data.size,
    data.max_tenants,
    data.building_id,
    data.floors,
    data.owner_id,
    data.active,
    data.created_at,
    data.updated_at
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByNameInBuilding(name, buildingId) {
  const query = `
    SELECT * FROM rooms
    WHERE LOWER(name) = LOWER($1) AND building_id = $2
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [name, buildingId]);
  return rows[0];
}
           
async function getAllRooms() {
  const query = 'SELECT * FROM rooms;';
  const { rows } = await pool.query(query);
    return rows;    
}
async function getRoomById(id) {
  const query = 'SELECT * FROM rooms WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  return rows[0];   
}
async function updateRoom(id, data) {
  const query = `
    UPDATE rooms SET
      name = $1,
      price = $2,
      deposit = $3,
      size = $4,
      max_tenants = $5,
      building_id = $6,
      floors = $7,
      owner_id = $8,
      active = $9,
      updated_at = $10
    WHERE id = $11
    RETURNING *;
  `;
  const values = [
    data.name,
    data.price,
    data.deposit,
    data.size,
    data.max_tenants,
    data.building_id,
    data.floors,
    data.owner_id,
    data.active,
    data.updated_at,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}
  
module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  findByNameInBuilding,
  updateRoom
};
