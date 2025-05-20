const db = require('../config/db');

class Character {
  static async findAll(search = '') {
    let query = 'SELECT * FROM characters';
    let params = [];
    
    if (search) {
      query += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM characters WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ name, image_path, abyss_rating, pvp_rating, high_pressure_rating, single_target_rating, multi_target_rating, stamina_rating }) {
    const [result] = await db.query(
      `INSERT INTO characters 
       (name, image_path, abyss_rating, pvp_rating, high_pressure_rating, 
        single_target_rating, multi_target_rating, stamina_rating) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, image_path, abyss_rating, pvp_rating, high_pressure_rating, 
       single_target_rating, multi_target_rating, stamina_rating]
    );
    return result.insertId;
  }

  static async update(id, { name, image_path, abyss_rating, pvp_rating, high_pressure_rating, single_target_rating, multi_target_rating, stamina_rating }) {
    await db.query(
      `UPDATE characters SET 
       name = ?, image_path = ?, abyss_rating = ?, pvp_rating = ?, 
       high_pressure_rating = ?, single_target_rating = ?, 
       multi_target_rating = ?, stamina_rating = ? 
       WHERE id = ?`,
      [name, image_path, abyss_rating, pvp_rating, high_pressure_rating, 
       single_target_rating, multi_target_rating, stamina_rating, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM characters WHERE id = ?', [id]);
  }

  static async getImagePath(id) {
    const [rows] = await db.query('SELECT image_path FROM characters WHERE id = ?', [id]);
    return rows[0]?.image_path;
  }

// 修改findWithPagination方法，将默认limit从5改为10
static async findWithPagination(page = 1, limit = 10, search = '') {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM characters';
  let countQuery = 'SELECT COUNT(*) as total FROM characters';
  let params = [];
  let countParams = [];
  
  if (search) {
      query += ' WHERE name LIKE ?';
      countQuery += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
  }
  
  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const [rows] = await db.query(query, params);
  const [[total]] = await db.query(countQuery, countParams);
  
  return {
      data: rows,
      total: total.total,
      page,
      limit,
      totalPages: Math.ceil(total.total / limit)
  };
}
}

module.exports = Character;