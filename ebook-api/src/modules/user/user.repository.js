const { pool } = require('../../config/database');
const bcrypt = require('bcryptjs');

/**
 * User Repository
 *
 * - Handles all database operations for users
 * - Uses parameterized queries to prevent SQL injection
 * - Only interacts with the database; no business logic
 */

/**
 * Check if email exists
 *
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists, false otherwise
 */
exports.isEmailExists = async (email) => {
  const sql = `
    SELECT 1
    FROM tbuser
    WHERE email = $1
      AND delflag = 0 AND isactive = true
    LIMIT 1
  `;
  const { rowCount } = await pool.query(sql, [email]);
  return rowCount > 0;
};



/**
 * Create User
 *
 * - Inserts a new user into tbuser table
 * - Returns the created user (userid, fullname, email)
 * - @param {Object} user - { fullname, email, password }
 * - @returns {Object} Created user
 */
exports.createUser = async (user) => {

   // 1️⃣ Hash password
  let hashedPassword = await bcrypt.hash(user.password, 10);

  const sql = `
    INSERT INTO tbuser
      (fullname, email, passwordhash,userType,vendorNumber, phone, isactive,
       createdby, createdon,
       modifiedby, modifiedon,
       delflag, deletedby, deletedon)
    VALUES
      ($1, $2, $3, $4, $5, '-', true,
       1, NOW(),
       1, NOW(),
       0, 0, NULL)
    RETURNING userid, fullname, email, usertype;
  `;

  const { rows } = await pool.query(sql, [
    user.fullname,
    user.email,
    hashedPassword,
    user.userType,
    user.vendorNumber
  ]);

  return rows[0];
};

/**
 * Get user by email (Login)
 *
 * - Fetches active user by email
 * - Returns passwordhash for validation
 */
exports.getUserByEmail = async (email) => {
  const sql = `
    SELECT userid, fullname, email, userType, passwordhash  
    FROM tbuser
    WHERE email = $1
      AND delflag = 0
      AND isactive = true
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [email]);
  return rows[0]; // undefined if not exists
};

/**
 * 🔐 Update User Password
 * ------------------------------------------------------------
 * - Hashes new password
 * - Updates passwordhash in DB
 *
 * @param {number} userId
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
exports.updatePassword = async (userId, newPassword) => {

   // 1️⃣ Hash password
  let hashedPassword = await bcrypt.hash(newPassword, 10);

  // 2️⃣ Update in DB
  const sql = `
    UPDATE tbuser
    SET passwordhash = $1,
        modifiedon = NOW()
    WHERE userid = $2
      AND delflag = 0
  `;
  const result = await pool.query(sql, [hashedPassword, userId]);
  return result.rowCount > 0;
};


/**
 * Get user by email (Login)
 *
 * - Compares plain password with hashed password
 * - Returns boolean indicating if passwords match
 */
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Get All Users
 *
 * - Fetches all active users
 * - Ignores soft-deleted records
 * - @returns {Array} List of users
 */
exports.getUsers = async (page, pageSize, findWhat) => {
  const offset = (page - 1) * pageSize;

  // 1️⃣ Total records with optional search
  let countQuery = `SELECT COUNT(*) AS total FROM tbuser WHERE delflag = 0 AND isactive = true`;
  let dataQuery = `SELECT userid, fullname, email, userType
                   FROM tbuser
                   WHERE delflag = 0 AND isactive = true`;
  
  const params = [];
  if (findWhat) {
    params.push(`%${findWhat}%`);
    countQuery += ` AND (fullname ILIKE $1 OR email ILIKE $1)`;
    dataQuery += ` AND (fullname ILIKE $1 OR email ILIKE $1)`;
  }

  dataQuery += ` ORDER BY userid LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

  // Add limit & offset to params
  params.push(pageSize, offset);

  // Execute queries
  const countResult = await pool.query(countQuery, findWhat ? [ `%${findWhat}%` ] : []);
  const totalRecords = parseInt(countResult.rows[0].total);

  const { rows } = await pool.query(dataQuery, params);
  return { rows, totalRecords };
};

/**
 * Get User By ID
 *
 * - Fetches a user by their ID
 * - Ignores soft-deleted records
 * - @param {number} id - User ID
 * - @returns {Object} User record or null
 */
exports.getUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT userid, fullname, email , userType
     FROM tbuser 
     WHERE userid = $1 AND delflag = 0 AND isactive = true`,
    [id]
  );
  return rows[0];
};

/**
 * Update User
 *
 * - Updates fullname and email by userid
 * - Updates modifiedon timestamp automatically
 * - Returns updated user record
 * - @param {number} id - User ID
 * - @param {Object} user - { fullname, email }
 * - @returns {Object} Updated user
 */
exports.updateUser = async (id, user) => {
  const sql = `
    UPDATE tbuser
    SET fullname = $1,
        email = $2,
        modifiedon = NOW()
    WHERE userid = $3
    RETURNING userid, fullname, email
  `;
  const { rows } = await pool.query(sql, [
    user.fullname,
    user.email,
    id
  ]);
  return rows[0];
};

/**
 * Delete User (Soft Delete)
 *
 * - Marks user as deleted (delflag = 1)
 * - Data remains in DB for auditing purposes
 * - @param {number} id - User ID
 */
exports.deleteUser = async (id) => {
  await pool.query(
    `UPDATE tbuser SET delflag = 1 WHERE userid = $1`,
    [id]
  );
};
