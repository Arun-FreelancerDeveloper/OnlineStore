const repo = require('./user.repository');

/**
 * <summary>
 * User Service — business logic layer for users.
 * </summary>
 * <remarks>
 * This module orchestrates repository calls and enforces business rules
 * such as password hashing, uniqueness checks and removing sensitive data
 * before returning user objects to controllers.
 * </remarks>
 */

/**
 * <summary>
 * Create a new user.
 * </summary>
 * <param name="data">User payload: { fullname, email, password, userType, vendorNumber }</param>
 * <returns>Created user object (userid, fullname, email, usertype).</returns>
 */
exports.createUser = (data) => repo.createUser(data);

/**
 * <summary>
 * Check whether an email already exists.
 * </summary>
 * <param name="email">Email address to check.</param>
 * <returns>Boolean indicating existence.</returns>
 */
exports.isEmailExists = (email) => repo.isEmailExists(email);

/**
 * <summary>
 * Get all users with pagination and optional search.
 * </summary>
 * <param name="page">Page number (1-based).</param>
 * <param name="pageSize">Records per page.</param>
 * <param name="findWhat">Optional search term for fullname/email.</param>
 * <returns>Paginated object: { currentPage, pageSize, totalPages, totalRecords, users }.</returns>
 */
exports.getUsers = async (page = 1, pageSize = 10, findWhat = '') => {
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const { rows, totalRecords } = await repo.getUsers(page, pageSize, findWhat);
  const totalPages = Math.ceil(totalRecords / pageSize);
  return {
    currentPage: page,
    pageSize,
    totalPages,
    totalRecords,
    users: rows
  };
};

/**
 * <summary>
 * Update a user by id.
 * </summary>
 * <param name="id">User id</param>
 * <param name="data">Partial user data to update</param>
 * <returns>Updated user object or null.</returns>
 */
exports.updateUser = (id, data) => repo.updateUser(id, data);

/**
 * <summary>
 * Soft delete a user by id.
 * </summary>
 * <param name="id">User id</param>
 * <returns>Promise resolved when deletion flag is set.</returns>
 */
exports.deleteUser = (id) => repo.deleteUser(id);

/**
 * <summary>
 * Get single user by id.
 * </summary>
 * <param name="id">User id</param>
 * <returns>User object or undefined if not found.</returns>
 */
exports.getUserById = (id) => repo.getUserById(id);

/**
 * <summary>
 * Authenticate a user by email and password.
 * </summary>
 * <remarks>
 * Steps:
 * 1. Fetch user row by email.
 * 2. If not found, throw 401.
 * 3. Compare provided password with stored passwordhash using bcrypt.
 * 4. If mismatch, throw 401. Otherwise remove `passwordhash` and return user.
 * </remarks>
 * <param name="param0">Object with `email` and `password`.</param>
 * <returns>Safe user object (without `passwordhash`).</returns>
 */
exports.login = async ({ email, password }) => {
  // 1. Fetch user by email
  const user = await repo.getUserByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // 2. Compare password
  const isMatch = await repo.comparePassword(password, user.passwordhash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // 3. Remove sensitive data before returning
  const safeUser = { ...user };
  delete safeUser.passwordhash;
  return safeUser;
};