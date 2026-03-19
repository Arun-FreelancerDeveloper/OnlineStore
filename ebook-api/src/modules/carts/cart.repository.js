const { pool } = require('../../config/database');

/**
 * ===============================
 * ADD TO CART (UPSERT)
 * ===============================
 */
exports.addToCart = async (data) => {
const { userid, productid, qty, createdby } = data;

  const checkSql = `
    SELECT cartid, qty
    FROM tbcart
    WHERE userid = $1
      AND productid = $2
      AND delflag = 0
  `;

  const { rows } = await pool.query(checkSql, [userid, productid]);

  if (rows.length > 0) {
    const updateSql = `
      UPDATE tbcart
      SET qty = qty + $1,
          modifiedby = $2,
          modifiedon = NOW()
      WHERE cartid = $3
      RETURNING *
    `;
    const result = await pool.query(updateSql, [
      qty,
      createdby,
      rows[0].cartid
    ]);
    return result.rows[0];
  }

  const insertSql = `
    INSERT INTO tbcart
      (userid, productid, qty, createdby, createdon, delflag, modifiedby, deletedby)
    VALUES
      ($1, $2, $3, $4, NOW(), 0, 0, 0)
    RETURNING *
  `;

  const result = await pool.query(insertSql, [
    userid,
    productid,
    qty,
    createdby
  ]);

  return result.rows[0];
};

/**
 * ===============================
 * GET CART BY USER
 * ===============================
 */
exports.getCartByUserId = async (userid) => {
  const sql = `
    SELECT
      c.cartid,
      c.qty,
      p.productid,
      p.productname,
      COALESCE(pp.mrp, 0) AS mrp,
      COALESCE(pp.wholesaleprice, 0) AS wholesaleprice,
      COALESCE(pi.imagepath, '/images/default.jpg') AS image,
      (COALESCE(pp.mrp, 0) * c.qty) AS totalamount
    FROM tbcart c
    JOIN tbproduct p 
      ON p.productid = c.productid
    LEFT JOIN tbproductprice pp 
      ON pp.productid = p.productid
    LEFT JOIN tbproductimage pi
      ON pi.productid = p.productid AND pi.isprimary = true
    WHERE c.userid = $1
      AND c.delflag = 0;
  `;

  const { rows } = await pool.query(sql, [userid]);
  return rows;
};

/**
 * ===============================
 * UPDATE CART QTY
 * ===============================
 */
exports.updateCartQty = async (cartid, qty, userid) => {
  if (qty <= 0) throw new Error('Invalid quantity');

  const sql = `
    UPDATE tbcart
    SET qty = $1,
        modifiedon = NOW()
    WHERE cartid = $2
      AND userid = $3
      AND delflag = 0
    RETURNING *;
  `;

  const { rows } = await pool.query(sql, [
    qty,
    cartid,
    userid
  ]);

  return rows[0];
};

/**
 * ===============================
 * BULK UPDATE CART
 * ===============================
 */
exports.updateCartBulk = async (items, userid) => {
  const values = [];
  const ids = [];

  items.forEach((item) => {
    if (!item.cartid || item.qty < 1) return;

    values.push(item.cartid, item.qty);
    ids.push(`($${values.length - 1}, $${values.length})`);
  });

  if (values.length === 0) return false;

  const sql = `
    UPDATE tbcart AS c SET
      qty = v.qty,
      modifiedon = NOW()
    FROM (VALUES ${ids.join(',')}) AS v(cartid, qty)
    WHERE c.cartid = v.cartid
      AND c.userid = $${values.length + 1}
      AND c.delflag = 0;
  `;

  await pool.query(sql, [...values, userid]);

  return true;
};

/**
 * ===============================
 * DELETE CART ITEM
 * ===============================
 */
exports.deleteCartItem = async (cartid, userid) => {
  const sql = `
    UPDATE tbcart
    SET delflag = 1,
        deletedon = NOW()
    WHERE cartid = $1
      AND userid = $2
      AND delflag = 0
    RETURNING cartid;
  `;

  const { rows } = await pool.query(sql, [cartid, userid]);

  return rows.length > 0;
};