const { pool } = require('../../config/database');

/**
 * ---------------------------------------------------------------------------
 * PRODUCT DATA ACCESS LAYER (Optimized)
 * ---------------------------------------------------------------------------
 * Improvements:
 * ✔ Bulk insert instead of loops
 * ✔ Transaction support
 * ✔ Pagination
 * ✔ Optimized joins
 * ✔ Soft delete with audit
 * ✔ Parallel queries (Promise.all)
 * ---------------------------------------------------------------------------
 */

/**
 * ================= CREATE PRODUCT =================
 */
exports.createProduct = async (data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert product
    const productSql = `
      INSERT INTO tbproduct
      (productcode, productname, shortdescription, categoryid, subcategoryid, deptid, storeid)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING productid
    `;

    const { rows } = await client.query(productSql, [
      data.productcode,
      data.productname,
      data.shortdescription,
      data.categoryid,
      data.subcategoryid,
      data.deptid,
      data.storeid
    ]);

    const productId = rows[0].productid;

    // Bulk insert images (single query)
    if (data.images?.length) {
      const values = data.images
        .map((_, i) => `($1, $${i + 2})`)
        .join(',');

      await client.query(
        `INSERT INTO tbproductimage (productid, imagepath)
         VALUES ${values}`,
        [productId, ...data.images]
      );
    }

    await client.query('COMMIT');
    return { productId };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * ================= GET ALL PRODUCTS =================
 * - Supports pagination + search + category filter
 */
exports.getAllProducts = async (categoryId, page = 1, pageSize = 10, findWhat = '') => {
  const offset = (page - 1) * pageSize;

  let baseQuery = `
  FROM tbproduct p
  LEFT JOIN tbproductimage img 
    ON img.productid = p.productid AND img.isprimary = true
  WHERE p.isactive = true
    AND p.delflag = false
`;

  const params = [];

  // Filter by category
  if (categoryId) {
    params.push(categoryId);
    baseQuery += ` AND p.categoryid = $${params.length}`;
  }

  // Search
  if (findWhat) {
    params.push(`%${findWhat}%`);
    baseQuery += ` AND p.productname ILIKE $${params.length}`;
  }

  // Data query
  const dataQuery = `
  SELECT 
    p.productid,
    p.productcode,
    p.productname,
    p.shortdescription,
    COALESCE(img.imagepath, '/images/default.jpg') AS image
  FROM tbproduct p
  LEFT JOIN tbproductimage img 
    ON img.productid = p.productid AND img.isprimary = true
  WHERE p.isactive = true
    AND p.delflag = false
    ${categoryId ? `AND p.categoryid = $1` : ''}
    ${findWhat ? `AND p.productname ILIKE $${categoryId ? 2 : 1}` : ''}
  ORDER BY p.productname
  LIMIT $${params.length + 1}
  OFFSET $${params.length + 2}
`;

  params.push(pageSize, offset);

  // Count query
  const countQuery = `SELECT COUNT(*) ${baseQuery}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, params),
    pool.query(countQuery, params.slice(0, params.length - 2))
  ]);

  const totalRecords = parseInt(countResult.rows[0].count);

  return {
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalRecords / pageSize),
    totalRecords,
    data: dataResult.rows
  };
};

/**
 * ================= GET PRODUCT BY ID =================
 */
exports.getProductById = async (productId) => {
  if (!productId || isNaN(productId)) {
    throw new Error('Invalid Product ID');
  }

  const sql = `
    SELECT
      p.productid,
      p.productcode,
      p.productname,
      p.shortdescription,
      COALESCE(
        json_agg(
          json_build_object(
            'imagepath', pi.imagepath,
            'isprimary', pi.isprimary
          )
        ) FILTER (WHERE pi.productimageid IS NOT NULL),
        '[]'
      ) AS images
    FROM tbproduct p
    LEFT JOIN tbproductimage pi 
      ON p.productid = pi.productid
    WHERE p.productid = $1
      AND p.isactive = true
      AND p.delflag = false
    GROUP BY p.productid
  `;

  const { rows } = await pool.query(sql, [productId]);
  return rows[0] || null;
};

/**
 * ================= UPDATE PRODUCT =================
 */
exports.updateProduct = async (productId, data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update product
    const updateSql = `
      UPDATE tbproduct
      SET
        productcode = $1,
        productname = $2,
        shortdescription = $3,
        categoryid = $4,
        subcategoryid = $5,
        deptid = $6,
        storeid = $7,
        modifiedon = NOW()
      WHERE productid = $8
        AND delflag = false
      RETURNING *
    `;

    const { rows } = await client.query(updateSql, [
      data.productcode,
      data.productname,
      data.shortdescription,
      data.categoryid,
      data.subcategoryid,
      data.deptid,
      data.storeid,
      productId
    ]);

    if (!rows.length) {
      throw new Error('Product not found');
    }

    // Replace images only if new images provided
    if (data.images?.length) {
      await client.query(
        `DELETE FROM tbproductimage WHERE productid = $1`,
        [productId]
      );

      const values = data.images
        .map((_, i) => `($1, $${i + 2})`)
        .join(',');

      await client.query(
        `INSERT INTO tbproductimage (productid, imagepath)
         VALUES ${values}`,
        [productId, ...data.images]
      );
    }

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
 * ================= DELETE PRODUCT (SOFT DELETE) =================
 */
exports.deleteProduct = async (productId, deletedBy) => {
  await pool.query(
    `UPDATE tbproduct
     SET delflag = true,
         isactive = false,
         deletedby = $1,
         deletedon = NOW()
     WHERE productid = $2`,
    [deletedBy, productId]
  );
};