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

  const params = [];
  let whereClause = `
    WHERE p.isactive = true 
    AND p.delflag = false
  `;

  // Category filter
  if (categoryId) {
    params.push(categoryId);
    whereClause += ` AND p.categoryid = $${params.length}`;
  }

  // Search filter
  if (findWhat) {
    params.push(`%${findWhat}%`);
    whereClause += ` AND p.productname ILIKE $${params.length}`;
  }

  const dataQuery = `
    WITH today_orders AS (
      SELECT 
        oi.productid,
        SUM(oi.quantity) AS total_sold
      FROM tborderitem oi
      JOIN tborder o ON oi.orderid = o.orderid
      -- WHERE o.orderdate::date = CURRENT_DATE
      GROUP BY oi.productid
    ),

    product_data AS (
      SELECT 
        p.productid,
        p.productcode,
        p.productname,
        p.shortdescription,

        COALESCE(img.imagepath, '/images/default.jpg') AS image,
        img.ishasclude,
        COALESCE(img.cludeimagepath, '/images/default.jpg') AS cludeimage,

        cg.groupid,
        cg.groupname,

        c.categoryid,
        c.categoryname,

        s.subcategoryid,
        s.subcategoryname,

        d.deptid,
        d.deptname,

        st.storeid,
        st.storename,

        pp.mrp,
        pp.wholesaleprice,

        COALESCE(to1.total_sold, 0) AS total_sold,

        COALESCE(SUM(pi.quantity), 0) AS total_stock,

        CASE 
          WHEN COALESCE(SUM(pi.quantity), 0) > 0 
          THEN (COALESCE(to1.total_sold, 0) * 100.0 / SUM(pi.quantity))
          ELSE 0
        END AS total_soldpercentage

      FROM tbproduct p

      LEFT JOIN today_orders to1 
        ON p.productid = to1.productid

      LEFT JOIN tbpurchaseitem pi 
        ON p.productid = pi.productid

      LEFT JOIN tbproductprice pp 
        ON p.productid = pp.productid

      LEFT JOIN tbproductimage img 
        ON img.productid = p.productid 
        AND img.isprimary = true 
        AND img.isactive = true

      JOIN tbcategory c 
        ON p.categoryid = c.categoryid AND c.isactive = true

      JOIN tbcategorygroup cg 
        ON c.groupid = cg.groupid AND cg.isactive = true

      JOIN tbsubcategory s 
        ON p.subcategoryid = s.subcategoryid AND s.isactive = true

      JOIN tbdepartment d 
        ON p.deptid = d.deptid

      JOIN tbstore st 
        ON p.storeid = st.storeid

      ${whereClause}

      GROUP BY 
        p.productid,
        p.productcode,
        p.productname,
        p.shortdescription,
        img.imagepath,
        img.ishasclude,
        img.cludeimagepath,
        cg.groupid,
        cg.groupname,
        c.categoryid,
        c.categoryname,
        s.subcategoryid,
        s.subcategoryname,
        d.deptid,
        d.deptname,
        st.storeid,
        st.storename,
        pp.mrp,
        pp.wholesaleprice,
        to1.total_sold
    )

    SELECT *,
           COUNT(*) OVER() AS total_count
    FROM product_data
    ORDER BY total_sold DESC NULLS LAST, productname
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  // Add pagination params
  params.push(pageSize, offset);

  const result = await pool.query(dataQuery, params);

  const totalRecords = result.rows.length > 0
    ? parseInt(result.rows[0].total_count)
    : 0;

  return {
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalRecords / pageSize),
    totalRecords,
    data: result.rows
  };
};

/**
 * ================= GET PRODUCT BY ID =================
 */
exports.getProductById = async (productId) => {
  if (!productId || isNaN(productId)) {
    throw new Error('Invalid Product ID');
  }

  // 🔹 Query 1: Product
  const productQuery = `
          WITH today_orders AS (
            SELECT 
              oi.productid,
              SUM(oi.quantity) AS total_sold
            FROM tborderitem oi
            JOIN tborder o ON oi.orderid = o.orderid
            GROUP BY oi.productid
          )

          SELECT 
            p.productid,
            p.productcode,
            p.productname,
            p.shortdescription,

            cg.groupid,
            cg.groupname,

            c.categoryid,
            c.categoryname,

            s.subcategoryid,
            s.subcategoryname,

            d.deptid,
            d.deptname,

            st.storeid,
            st.storename,

            pp.mrp,
            pp.wholesaleprice,

            COALESCE(to1.total_sold, 0) AS total_sold,

            COALESCE(SUM(pi.quantity), 0) AS total_stock,

            CASE 
              WHEN COALESCE(SUM(pi.quantity), 0) > 0 
              THEN (COALESCE(to1.total_sold, 0) * 100.0 / SUM(pi.quantity))
              ELSE 0
            END AS total_soldpercentage

          FROM tbproduct p

          LEFT JOIN today_orders to1 
            ON p.productid = to1.productid

          LEFT JOIN tbpurchaseitem pi 
            ON p.productid = pi.productid

          LEFT JOIN tbproductprice pp 
            ON p.productid = pp.productid

          JOIN tbcategory c 
            ON p.categoryid = c.categoryid AND c.isactive = true

          JOIN tbcategorygroup cg 
            ON c.groupid = cg.groupid AND cg.isactive = true

          JOIN tbsubcategory s 
            ON p.subcategoryid = s.subcategoryid AND s.isactive = true

          JOIN tbdepartment d 
            ON p.deptid = d.deptid

          JOIN tbstore st 
            ON p.storeid = st.storeid

          WHERE 
            p.productid = $1
            AND p.isactive = true
            AND p.delflag = false

          GROUP BY 
            p.productid,
            p.productcode,
            p.productname,
            p.shortdescription,
            cg.groupid,
            cg.groupname,
            c.categoryid,
            c.categoryname,
            s.subcategoryid,
            s.subcategoryname,
            d.deptid,
            d.deptname,
            st.storeid,
            st.storename,
            pp.mrp,
            pp.wholesaleprice,
            to1.total_sold
`;

  // 🔹 Query 2: Images
  const imageQuery = `
    SELECT
      pi.productimageid,
      pi.imagepath,
      pi.ishasclude,
      pi.cludeimagepath,
      pi.isprimary
    FROM tbproductimage pi
    WHERE pi.productid = $1
    ORDER BY pi.isprimary DESC
  `;

  // 🔥 Execute both queries
  const [productResult, imageResult] = await Promise.all([
    pool.query(productQuery, [productId]),
    pool.query(imageQuery, [productId])
  ]);

  if (productResult.rows.length === 0) {
    return null;
  }

  const product = productResult.rows[0];

  // 🔹 Attach images
  product.images = imageResult.rows || [];


  
  return product;
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


/**
 * ================= UPDATE PRODUCT IMAGES ONLY =================
 */
/**
 * ================= UPDATE PRODUCT IMAGES (CORRECTED) =================
 */
exports.updateProductImages = async (productId, images, userId) => {
  if (!productId || isNaN(productId)) {
    throw new Error('Invalid Product ID');
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new Error('Images array is required');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Check product exists
    const check = await client.query(
      `SELECT productid FROM tbproduct 
       WHERE productid = $1 AND delflag = false`,
      [productId]
    );

    if (!check.rows.length) {
      throw new Error('Product not found');
    }

    // 2️⃣ Soft delete old images (BEST PRACTICE)
    await client.query(
      `UPDATE tbproductimage
       SET delflag = 1,
           isactive = false,
           deletedby = $1,
           deletedon = NOW()
       WHERE productid = $2`,
      [userId, productId]
    );

    // 3️⃣ Bulk insert new images
    const values = images
      .map((img, i) => {
        const baseIndex = i * 7;
        return `(
          $1, 
          $${baseIndex + 2},  -- imagename
          $${baseIndex + 3},  -- imagepath
          $${baseIndex + 4},  -- isprimary
          $${baseIndex + 5},  -- sortorder
          true,               -- isactive
          $${baseIndex + 6},  -- createdby
          NOW(),
          $${baseIndex + 7},  -- modifiedby
          NOW(),
          0,                  -- delflag
          0,                  -- deletedby
          NULL                -- deletedon
        )`;
      })
      .join(',');

    const params = [productId];

    images.forEach((img, index) => {
      params.push(img.imagename);           // imagename
      params.push(true);           // imagename
      params.push(img.imagepath);           // imagepath
      params.push(index === 0);             // isprimary (first image)
      params.push(index + 1);               // sortorder
      params.push(userId);                  // createdby
      params.push(userId);                  // modifiedby
    });

    await client.query(
      `INSERT INTO tbproductimage
      (
        productid,
        ishasclude
        cludeimagepath,
        isprimary,
        sortorder,
        isactive,
        createdby,
        createdon,
        modifiedby,
        modifiedon,
        delflag,
        deletedby,
        deletedon
      )
      VALUES ${values}`,
      params
    );

    await client.query('COMMIT');

    return {
      message: 'Product images updated successfully',
      productId
    };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};