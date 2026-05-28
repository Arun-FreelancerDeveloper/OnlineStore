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
 * <summary>
 * Check whether an active user exists for the provided email.
 * </summary>
 * <param name="email">Email address to check.</param>
 * <returns>Boolean indicating whether the email exists.</returns>
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
 * <summary>
 * Create a new user record in `tbuser`.
 * </summary>
 * <param name="user">User payload. Required fields: `fullname`, `email`, `password`.
 * Optional: `userType`, `vendorNumber`.</param>
 * <returns>The created user row (userid, fullname, email, usertype).</returns>
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
 * <summary>
 * Fetch a user row by email for login/validation.
 * </summary>
 * <param name="email">Email address to lookup.</param>
 * <returns>Row with userid, fullname, email, userType, passwordhash or undefined.</returns>
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
 * <summary>
 * Update a user's password (hashing internally).
 * </summary>
 * <param name="userId">Target user id.</param>
 * <param name="newPassword">Plaintext new password.</param>
 * <returns>Boolean indicating whether the update affected a row.</returns>
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
 * <summary>
 * Compare a plaintext password against a bcrypt hash.
 * </summary>
 * <param name="plainPassword">Plaintext password.</param>
 * <param name="hashedPassword">Bcrypt hashed password from DB.</param>
 * <returns>Boolean whether the passwords match.</returns>
 */
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * <summary>
 * Get users list with pagination and optional search term.
 * </summary>
 * <param name="page">Page number (1-based).</param>
 * <param name="pageSize">Records per page.</param>
 * <param name="findWhat">Optional search string applied to fullname and email.</param>
 * <returns>{ rows: Array, totalRecords: number }</returns>
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
 * <summary>
 * Fetch a user by id (ignores soft-deleted rows).
 * </summary>
 * <param name="id">User id</param>
 * <returns>User record or undefined.</returns>
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
 * <summary>
 * Update a user's fullname and email.
 * </summary>
 * <param name="id">User id</param>
 * <param name="user">Object containing `fullname` and `email`.</param>
 * <returns>Updated user row or undefined.</returns>
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
 * <summary>
 * Soft delete a user by setting `delflag = 1`.
 * </summary>
 * <param name="id">User id</param>
 */
exports.deleteUser = async (id) => {
  await pool.query(
    `UPDATE tbuser SET delflag = 1 WHERE userid = $1`,
    [id]
  );
};
