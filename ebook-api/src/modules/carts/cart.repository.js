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
      COALESCE(pp.mrp, 0) AS marketprice,
      COALESCE(pp.wholesaleprice, 0) AS dealprice,
      COALESCE(pp.mrp, 0) - COALESCE(pp.wholesaleprice, 0) AS saveprice,
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
 * GET THE USER DISCOUNT BASED RULES
 * ===============================
 */
exports.getUserDiscountRule = async (userid) => {

  /* =========================================
   * 1. GET USER ORDER COUNT
   * ========================================= */
  const orderCountSql = `
    SELECT COUNT(*) AS total_orders
    FROM tborder
    WHERE userid = $1
      AND delflag = 0;
  `;

  const orderResult = await pool.query(orderCountSql, [userid]);
  const orderCount = parseInt(orderResult.rows[0].total_orders, 10);

  /* =========================================
   * 2. FETCH ACTIVE RULES (PRIORITY ORDER)
   * ========================================= */
  const rulesSql = `
    SELECT *
    FROM discount_rules
    WHERE is_active = TRUE
      AND (valid_from IS NULL OR valid_from <= NOW())
      AND (valid_to IS NULL OR valid_to >= NOW())
    ORDER BY priority ASC;
  `;

  const { rows: rules } = await pool.query(rulesSql);

  /* =========================================
   * 3. APPLY RULE ENGINE
   * ========================================= */
  let matchedRule = null;

  for (const rule of rules) {

    switch (rule.rule_type) {

      case 'FIRST_ORDER':
        if (orderCount === 0) {
          matchedRule = rule;
        }
        break;

      case 'ORDER_COUNT':
        if (
          (rule.min_orders === null || orderCount >= rule.min_orders) &&
          (rule.max_orders === null || orderCount <= rule.max_orders)
        ) {
          matchedRule = rule;
        }
        break;

      case 'DEFAULT':
        matchedRule = rule;
        break;
    }

    if (matchedRule) break;
  }

  /* =========================================
   * 4. RETURN RESULT
   * ========================================= */
  return {
    orderCount,
    rule: matchedRule ? matchedRule.rule_type : null,
    discount: matchedRule ? Number(matchedRule.discount_percent) : 0
  };
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
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const item of items) {
      if (!item.cartid || item.qty < 1) continue;

      const sql = `
        UPDATE tbcart
        SET qty = $1,
            modifiedon = NOW()
        WHERE cartid = $2
          AND userid = $3
          AND delflag = 0;
      `;

      await client.query(sql, [item.qty, item.cartid, userid]);
    }

    await client.query('COMMIT');
    return true;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }
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