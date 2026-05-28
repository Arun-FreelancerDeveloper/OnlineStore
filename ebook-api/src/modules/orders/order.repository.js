const { pool } = require('../../config/database');
const { sendOrderEmail } = require('../../services/email.service');
/**
 * CREATE ORDER + ITEMS + STATUS (TRANSACTION)
 */
exports.createorder = async (data) => {

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      userid,
      totalamount,
      totaltaxamount,
      paymentstatus,
      shippingaddressid,
      createdby,
      items
    } = data;

    // ✅ Generate order number INSIDE transaction
    const orderno = await generateOrderNo(client);

    // 1️⃣ CREATE ORDER
    const orderSql = `
      INSERT INTO tborder (
        userid, orderno, orderdate, orderstatus,
        totalamount, totaltaxamount, discountamount, payamount, currency, paymentstatus, shippingaddressid,
        isactive, createdby, createdon,
        modifiedby, modifiedon,
        delflag, deletedby
      )
      VALUES (
        $1, $2, NOW(), 'PLACED',
        $3, $4, $5,
        true, $6, NOW(),
        $6, NOW(),
        0, 0
      )
      RETURNING orderid, orderno, totalamount;
    `;

    const { rows } = await client.query(orderSql, [
      userid,
      orderno,
      totalamount,
      totaltaxamount,
      discountamount,
      payamount,
      currency,
      paymentstatus,
      shippingaddressid,
      createdby
    ]);

    const order = rows[0];

    // 2️⃣ CREATE ORDER ITEMS
    const itemSql = `
      INSERT INTO tborderitem (
        orderid, productid, productname, productcode,
        quantity, unitprice, totalprice, taxpercentage, taxamount, totalpayamount,
        createdby, createdon,
        modifiedby, modifiedon,
        delflag, deletedby
      )
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10,
        $11, NOW(),
        0, 0
      );
    `;

    for (const item of items) {
      await client.query(itemSql, [
        order.orderid,
        item.productid,
        item.productname,
        item.productcode,
        item.quantity,
        item.unitprice,
        item.quantity * item.unitprice,
        item.taxpercentage,
        item.taxamount,
        item.totalpayamount,
        createdby
      ]);
    }

    // 3️⃣ CREATE ORDER STATUS
    const statusSql = `
      INSERT INTO tborderstatus (
        orderid, status, remarks, isactive,
        createdby, createdon,
        modifiedby, modifiedon,
        delflag, deletedby
      )
      VALUES (
        $1, 'PLACED', 'Order placed successfully', true,
        $2, NOW(),
        $2, NOW(),
        0, 0
      );
    `;

    await client.query(statusSql, [
      order.orderid,
      createdby
    ]);

    // 4) CLEAR THE USER CART 
    const sql = `
        UPDATE tbcart
        SET delflag = 1,
            deletedby = $1,
            deletedon = NOW()
        WHERE userid = $1
    `;
    await pool.query(sql, [createdby]);


    // Fetch user email & name
    const user = await getUserEmail(client, userid);
    const { email, fullname } = user;

    await client.query('COMMIT');

     // ✅ SEND EMAIL (NON-BLOCKING)
    sendOrderEmail({
      email,
      fullname,
      order_id: order.orderno,
      order_date: new Date().toLocaleDateString(),
      payment_mode: paymentstatus
    }).catch(err => {
      console.error('Order email failed:', err.message);
    });

    return order;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getUserEmail = async (client, userid) => {
  const sql = `
    SELECT email, fullname
    FROM tbuser
    WHERE userid = $1
  `;

  const { rows } = await client.query(sql, [userid]);
  return rows[0]; // { email, fullname }
};



/**
 * <summary>
 * Retrieve all orders for administrative reporting.
 * </summary>
 * <returns>Promise resolving to an array of order header records.</returns>
 */
exports.getAllOrders = async () => {
  const sql = `
    SELECT
      o.orderid,
      o.orderno,
      o.orderdate,
      o.orderstatus,
      o.totalamount,
      o.paymentstatus,
      sa.fullname AS shippingname
    FROM tborder o
    JOIN tbuser u ON u.userid = o.userid
    JOIN tbshippingaddress sa ON sa.addressid = o.shippingaddressid
    WHERE o.delflag = 0
    ORDER BY o.orderdate DESC;
  `;

  const { rows } = await pool.query(sql);
  return rows;
};


/**
 * <summary>
 * Retrieve order summaries for a single user.
 * </summary>
 * <param name="userid">User identifier.</param>
 * <returns>Promise resolving to an array of orders.</returns>
 */
exports.getOrdersByUserId = async (userid) => {
  const sql = `
    SELECT
      orderid,
      orderno,
      orderdate,
      orderstatus,
      totalamount,
      discountamount,
      payamount,
      currency,
      paymentstatus
    FROM tborder
    WHERE userid = $1
      AND delflag = 0
    ORDER BY orderdate DESC;
  `;

  const { rows } = await pool.query(sql, [userid]);
  return rows;
};

/**
 * <summary>
 * Retrieve a single order with shipping address and item details by order ID.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <returns>Promise resolving to the order detail object.</returns>
 */
exports.getOrderById = async (orderid) => {
  const sql = `
    SELECT
  o.orderid,
  o.orderno,
  o.orderdate,
  o.orderstatus,
  o.totalamount,
  o.paymentstatus,

  /* 🏠 Shipping Address */
  json_build_object(
    'addressid', sa.addressid,
    'fullname', sa.fullname,
    'phone', sa.phone,
    'addressline1', sa.addressline1,
    'addressline2', sa.addressline2,
    'city', sa.city,
    'state', sa.state,
    'postalcode', sa.postalcode,
    'country', sa.country
  ) AS shippingaddress,

  /* 📦 Order Items */
  COALESCE(
    json_agg(
      json_build_object(
        'orderitemid', i.orderitemid,
        'productid', i.productid,
        'productname', i.productname,
        'productcode', i.productcode,
        'quantity', i.quantity,
        'unitprice', i.unitprice,
        'totalprice', i.totalprice
      )
    ) FILTER (WHERE i.orderitemid IS NOT NULL),
    '[]'
  ) AS items

FROM tborder o
LEFT JOIN tborderitem i
  ON i.orderid = o.orderid
LEFT JOIN tbshippingaddress sa
  ON sa.addressid = o.shippingaddressid

WHERE o.orderid = $1
  AND o.delflag = 0

GROUP BY
  o.orderid,
  sa.addressid;

  `;

  const { rows } = await pool.query(sql, [orderid]);
  return rows[0];
};

/**
 * <summary>
 * Retrieve a single order by its external order number.
 * </summary>
 * <param name="orderno">External order number.</param>
 * <returns>Promise resolving to the order detail object.</returns>
 */
exports.getOrderByInvoiceNo = async (orderno) => {
  const sql = `
    SELECT
  o.orderid,
  o.orderno,
  o.orderdate,
  o.orderstatus,
  o.totalamount,
  o.paymentstatus,

  /* 🏠 Shipping Address */
  json_build_object(
    'addressid', sa.addressid,
    'fullname', sa.fullname,
    'phone', sa.phone,
    'addressline1', sa.addressline1,
    'addressline2', sa.addressline2,
    'city', sa.city,
    'state', sa.state,
    'postalcode', sa.postalcode,
    'country', sa.country
  ) AS shippingaddress,

  /* 📦 Order Items */
  COALESCE(
    json_agg(
      json_build_object(
        'orderitemid', i.orderitemid,
        'productid', i.productid,
        'productname', i.productname,
        'productcode', i.productcode,
        'quantity', i.quantity,
        'unitprice', i.unitprice,
        'totalprice', i.totalprice
      )
    ) FILTER (WHERE i.orderitemid IS NOT NULL),
    '[]'
  ) AS items

FROM tborder o
LEFT JOIN tborderitem i
  ON i.orderid = o.orderid
LEFT JOIN tbshippingaddress sa
  ON sa.addressid = o.shippingaddressid

WHERE o.orderno = $1
  AND o.delflag = 0

GROUP BY
  o.orderid,
  sa.addressid;

  `;

  const { rows } = await pool.query(sql, [orderno]);
  return rows[0];
};

/**
 * <summary>
 * Retrieve the status change history for an order.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <returns>Promise resolving to an ordered array of status history records.</returns>
 */
exports.getOrderStatusHistory = async (orderid) => {
  const sql = `
    SELECT
      orderstatusid,
      status,
      remarks,
      createdon
    FROM tborderstatus
    WHERE orderid = $1
      AND delflag = 0
    ORDER BY createdon ASC;
  `;

  const { rows } = await pool.query(sql, [orderid]);
  return rows;
};


/**
 * <summary>
 * Persist a new status for an order and append a history record.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <param name="status">New status value.</param>
 * <param name="remarks">Optional remark text.</param>
 * <param name="modifiedby">User ID making the status update.</param>
 * <returns>Promise resolving to the updated order summary.</returns>
 */
exports.updateOrderStatus = async (orderid, status, remarks, modifiedby) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateSql = `
      UPDATE tborder
      SET orderstatus = $1,
          modifiedby = $2,
          modifiedon = NOW()
      WHERE orderid = $3
      RETURNING orderid, orderstatus;
    `;

    const { rows } = await client.query(updateSql, [
      status,
      modifiedby,
      orderid
    ]);

    const historySql = `
      INSERT INTO tborderstatus (
        orderid, status, remarks, isactive,
        createdby, createdon,
        modifiedby, modifiedon, delflag
      )
      VALUES (
        $1, $2, $3, true,
        $4, NOW(),
        $4, NOW(), 0
      );
    `;

    await client.query(historySql, [
      orderid,
      status,
      remarks,
      modifiedby
    ]);

    await client.query('COMMIT');
    return rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * <summary>
 * Soft delete an order by setting delflag and archive fields.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <param name="deletedby">User ID performing deletion.</param>
 * <returns>Promise resolving once the order is marked deleted.</returns>
 */
exports.deleteOrder = async (orderid, deletedby) => {
  await pool.query(
    `
    UPDATE tborder
    SET delflag = 1,
        isactive = false,
        deletedby = $1,
        deletedon = NOW()
    WHERE orderid = $2;
    `,
    [deletedby, orderid]
  );
};

// Generate order number: ORD-20260119-0001
const generateOrderNo = async (client) => {
  const { rows } = await client.query(
    `SELECT COUNT(*) + 1 AS seq FROM tborder`
  );

  const seq = rows[0].seq.toString().padStart(4, '0');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return `ORD-${date}-${seq}`;
};

