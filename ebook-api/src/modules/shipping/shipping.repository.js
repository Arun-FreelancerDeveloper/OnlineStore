const { pool } = require('../../config/database');

/**
 * Shipping Address Repository
 *
 * - Handles database operations for shipping addresses
 * - Only responsible for DB queries
 */

/**
 * <summary>
 * Insert a new shipping address for a user.
 * </summary>
 * <param name="data">Payload containing userid, fullname, phone, address lines, city, state, postalcode, country, and isdefault.</param>
 * <returns>Promise resolving to the created address record.</returns>
 */
exports.createAddress = async (data) => {
  const sql = `
    INSERT INTO tbshippingaddress (
      userid,
      fullname,
      phone,
      addressline1,
      addressline2,
      city,
      state,
      postalcode,
      country,
      isdefault,
      isactive,
      createdby,
      createdon,
      delflag,
      modifiedby,
      deletedby
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9,
      $10,
      true,
      $11,
      NOW(),
      0,
      0,
      0
    )
    RETURNING *;
  `;

  const { rows } = await pool.query(sql, [
    data.userid,
    data.fullname,
    data.phone,
    data.addressline1,
    data.addressline2,
    data.city,
    data.state,
    data.postalcode,
    data.country,
    data.isdefault,      // ✅ now used
    data.userid          // createdby
  ]);

  return rows[0];
};


/**
 * <summary>
 * Fetch all active shipping addresses for a user.
 * </summary>
 * <param name="userid">User identifier.</param>
 * <returns>Promise resolving to an array of active address records.</returns>
 */
exports.getAddressByUser = async (userid) => {
  const { rows } = await pool.query(
    `SELECT 
        addressid,
        userid,
        fullname,
        phone,
        addressline1,
        addressline2,
        city,
        state,
        postalcode,
        country
      FROM tbshippingaddress
      WHERE userid = $1 AND delflag = 0 AND isactive = true 
      ORDER BY addressid DESC`,
    [userid]
  );
  return rows;
};

/**
 * <summary>
 * Update a shipping address by ID.
 * </summary>
 * <param name="id">Address identifier.</param>
 * <param name="data">Update payload containing fullname, phone, address details, and isdefault.</param>
 * <returns>Promise resolving to the updated address record.</returns>
 */
exports.updateAddress = async (id, data) => {
  const sql = `
      UPDATE tbshippingaddress
      SET fullname = $1,
          phone = $2,
          addressline1 = $3,
          addressline2 = $4,
          city = $5,
          state = $6,
          postalcode = $7,
          country = $8,
          isdefault = $9,
          modifiedon = NOW()
      WHERE addressid = $10
      RETURNING *;
    `;

    const values = [
      data.fullname,
      data.phone,
      data.addressline1,
      data.addressline2,
      data.city,
      data.state,
      data.postalcode,
      data.country,
      data.isdefault,
      id
    ];

    // ✅ LOG
    console.log('SQL:', sql);
    console.log('VALUES:', values);
    const { rows } = await pool.query(sql, values);
    return rows[0];

};

/**
 * <summary>
 * Soft delete a shipping address record.
 * </summary>
 * <param name="id">Address identifier.</param>
 * <returns>Promise resolving once the record is marked deleted.</returns>
 */
exports.deleteAddress = async (id) => {
  await pool.query(
    `UPDATE tbshippingaddress SET delflag = 1 WHERE addressid = $1`,
    [id]
  );
};
