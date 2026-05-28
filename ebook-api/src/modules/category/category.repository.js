const { pool } = require('../../config/database');

/**
 * ---------------------------------------------------------------------------
 * Category DATA ACCESS LAYER
 * ---------------------------------------------------------------------------
 */

/**
 * <summary>
 * Insert a new category into the database.
 * </summary>
 * <param name="data">Payload containing groupId, categoryName, imagepath, and createdby.</param>
 * <returns>Promise resolving to the inserted category record.</returns>
 */
exports.createCategory = async (data) => {
  const imagepath =
    data.imagepath?.trim() ||
    'content/Category/1/1-general-books.png';

  const sql = `
    INSERT INTO tbcategory (
      groupid,
      categoryname,
      imagepath,
      isactive,
      createdby,
      modifiedby
    )
    VALUES ($1, $2, $3, true, $4, 0)
    RETURNING
      categoryid   AS "categoryId",
      categoryname AS "categoryName",
      imagepath    AS "imagePath";
  `;

  const values = [
    data.groupId,
    data.categoryName,
    imagepath,
    data.createdby
  ];

  const { rows } = await pool.query(sql, values);
  return rows[0];
};

/**
 * <summary>
 * Retrieve categories for a group with product count, pagination, and search support.
 * </summary>
 * <param name="groupid">Group identifier to filter categories.</param>
 * <param name="page">Page number.</param>
 * <param name="pageSize">Number of records per page.</param>
 * <param name="findWhat">Optional category name search term.</param>
 * <returns>Promise resolving to a paginated category result object.</returns>
 */
exports.getAllCategorys = async (
  groupid,
  page = 1,
  pageSize = 10,
  findWhat = ''
) => {
  const offset = (page - 1) * pageSize;

  let dataQuery = `
    SELECT
        g.groupid,
        g.groupname,
        COALESCE(c.categoryid, 0) AS categoryid,
        COALESCE(c.categoryname, '-') AS categoryname,
        COALESCE(t.taxid, 0) AS taxid,
        COALESCE(t.taxname, 'No Tax') AS taxname,
        COALESCE(t.taxpercentage, 0) AS taxpercentage,
        COALESCE(p.cnt, 0) AS activeproductcount
    FROM tbcategorygroup g
        LEFT JOIN tbcategory c
            ON c.groupid = g.groupid
            AND c.isactive = true
            AND c.delflag = 0
        LEFT JOIN tbtax t
            ON t.taxid = c.taxid
            AND t.isactive = true
            AND t.delflag = false
        LEFT JOIN (
            SELECT categoryid, COUNT(*) AS cnt
            FROM tbproduct
            WHERE isactive = true
              AND delflag = false
            GROUP BY categoryid
        ) p ON p.categoryid = c.categoryid
    WHERE g.isactive = true
        AND g.delflag = false
        AND g.groupid = $1`;

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM tbcategory c
    WHERE c.isactive = true
      AND c.delflag = 0
      AND c.groupid = $1
  `;

  const params = [groupid];

  // 🔍 Search
  if (findWhat) {
    params.push(`%${findWhat}%`);
    dataQuery += ` AND c.categoryname ILIKE $${params.length}`;
    countQuery += ` AND c.categoryname ILIKE $${params.length}`;
  }

  // 📊 Pagination
  dataQuery += `
    GROUP BY g.groupid, g.groupname, c.categoryid, c.categoryname, p.cnt, t.taxid, t.taxname, t.taxpercentage
    ORDER BY g.groupname
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  params.push(pageSize, offset);

  const dataResult = await pool.query(dataQuery, params);
  const countResult = await pool.query(
    countQuery,
    params.slice(0, params.length - 2)
  );

  const totalRecords = parseInt(countResult.rows[0].total);

  return {
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalRecords / pageSize),
    totalRecords,
    data: dataResult.rows
  };
};

/**
 * <summary>
 * Retrieve a category by its identifier.
 * </summary>
 * <param name="categoryid">Category identifier.</param>
 * <returns>Promise resolving to the category details.</returns>
 */
exports.getCategoryById = async (categoryid) => {
  const sql = `
    SELECT 
        c.categoryid,
        c.categoryname,
        COALESCE(COUNT(p.productid), 0) AS availableproductcount
    FROM tbcategory c
    LEFT JOIN tbproduct p
      ON p.categoryid = c.categoryid
      AND p.isactive = true
      AND p.delflag = 0
    WHERE c.categoryid = $1
      AND c.isactive = true
      AND c.delflag = 0
    GROUP BY c.categoryid, c.categoryname
  `;

  const { rows } = await pool.query(sql, [categoryid]);
  return rows[0];
};

/**
 * <summary>
 * Update an existing category record.
 * </summary>
 * <param name="categoryId">Category identifier.</param>
 * <param name="data">Payload containing categoryName, imagepath, and modifiedby.</param>
 * <returns>Promise resolving to the updated category record.</returns>
 */
exports.updateCategory = async (categoryId, data) => {
  const sql = `
    UPDATE tbcategory
    SET categoryname = $1,
        imagepath   = $2,
        modifiedby  = $3,
        modifiedon  = NOW()
    WHERE categoryid = $4
    RETURNING
      categoryid   AS "categoryId",
      categoryname AS "categoryName",
      imagepath    AS "imagePath";
  `;

  const values = [
    data.categoryName,
    data.imagepath,
    data.modifiedby,
    categoryId
  ];

  const { rows } = await pool.query(sql, values);
  return rows[0];
};

/**
 * <summary>
 * Soft delete a category by setting delflag and deactivating the record.
 * </summary>
 * <param name="categoryId">Category identifier.</param>
 * <param name="deletedBy">User ID performing the deletion.</param>
 * <returns>Promise resolving once the deletion is complete.</returns>
 */
exports.deleteCategory = async (categoryId, deletedBy) => {
  const sql = `
    UPDATE tbcategory
    SET delflag   = 1,
        isactive  = false,
        deletedby = $1,
        deletedon = NOW()
    WHERE categoryid = $2
  `;

  await pool.query(sql, [deletedBy, categoryId]);
};