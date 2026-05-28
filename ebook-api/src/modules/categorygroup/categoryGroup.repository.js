const { pool } = require('../../config/database');

/**
 * ---------------------------------------------------------------------------
 * CATEGORY GROUP DATA ACCESS LAYER
 * ---------------------------------------------------------------------------
 * Handles CRUD operations for Category Groups.
 */

/**
 * <summary>
 * Create a new category group record.
 * </summary>
 * <param name="data">Payload containing groupname, imagepath, and createdby.</param>
 * <returns>Promise resolving to the newly created category group.</returns>
 */
exports.createCategoryGroup = async (data) => {
  const imagepath =
    data.imagepath?.trim() ||
    'content/categorygroup/1/1-general-books.png';
  const createdby = data.createdby;
  const sql = `
    INSERT INTO tbcategorygroup (
      groupname,
      imagepath,
      isactive,
      createdby,
      modifiedby
    )
    VALUES (
      $1,
      $2,
      true,
      $3,
      0
    )
    RETURNING
      groupid   AS "groupId",
      groupname AS "groupName",
      imagepath AS "imagePath";
  `;
  const values = [
    data.groupname,
    imagepath,
    createdby
  ];
  const { rows } = await pool.query(sql, values);
  return rows[0];
};


/**
 * <summary>
 * Retrieve active category groups with pagination and optional search.
 * </summary>
 * <param name="page">Page number.</param>
 * <param name="pageSize">Items per page.</param>
 * <param name="findWhat">Optional search text.</param>
 * <returns>Promise resolving to a paginated result object.</returns>
 */
exports.getAllCategoryGroups = async (page = 1, pageSize = 10, findWhat = '') => {
  const offset = (page - 1) * pageSize; 
  // Base queries
  let dataQuery = `
    SELECT
        g.groupid,
        g.groupname,
        g.imagepath,
        COUNT(c.categoryid) AS activecategorycount
    FROM tbcategorygroup g
    LEFT JOIN tbcategory c
           ON c.groupid = g.groupid
          AND c.isactive = true
          AND c.delflag = 0
    WHERE g.isactive = true
      AND g.delflag = false
  `;
  
  let countQuery = `
    SELECT COUNT(*) AS total
    FROM tbcategorygroup g
    WHERE g.isactive = true
      AND g.delflag = false
  `;

  const params = [];
  // Add search filter if findWhat is provided
  if (findWhat) {
    params.push(`%${findWhat}%`);
    dataQuery += ` AND g.groupname ILIKE $${params.length}`;
    countQuery += ` AND g.groupname ILIKE $${params.length}`;
  }

  dataQuery += `
    GROUP BY g.groupid, g.groupname, g.imagepath
    ORDER BY g.groupname
    LIMIT $${params.length + 1} OFFSET $${params.length + 2};
  `;
  params.push(pageSize, offset);

  // Execute queries
  const dataResult = await pool.query(dataQuery, params);
  const countResult = await pool.query(countQuery, params.slice(0, params.length - 2)); // count doesn't need limit/offset

  const totalRecords = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(totalRecords / pageSize);



  return {
    currentPage: page,
    pageSize,
    totalPages,
    totalRecords,
    data: dataResult.rows
  };
};

/**
 * <summary>
 * Retrieve a category group by ID.
 * </summary>
 * <param name="groupId">Group identifier.</param>
 * <returns>Promise resolving to the category group details.</returns>
 */
exports.getCategoryGroupById = async (groupId) => {
  const sql = `
    SELECT
        g.groupid,
        g.groupname,
        g.imagepath,
        COUNT(c.categoryid) AS activecategorycount
    FROM tbcategorygroup g
    LEFT JOIN tbcategory c
           ON c.groupid = g.groupid
          AND c.isactive = true
          AND c.delflag = 0
    WHERE g.isactive = true
      AND g.delflag = false
      AND g.groupid = $1
    GROUP BY g.groupid, g.groupname, g.imagepath
    ORDER BY g.groupname;
  `;

  const { rows } = await pool.query(sql, [groupId]);
  return rows[0];
};

/**
 * <summary>
 * Update a category group record.
 * </summary>
 * <param name="groupId">Group identifier.</param>
 * <param name="data">Payload containing updated groupname, imagepath, and modifiedby.</param>
 * <returns>Promise resolving to the updated category group.</returns>
 */
exports.updateCategoryGroup = async (groupId, data) => {
  const sql = `
    UPDATE tbcategorygroup
    SET groupname  = $1,
        imagepath  = $2,
        modifiedby = $3,
        modifiedon = NOW()
    WHERE groupid = $4
    RETURNING groupid, groupname, imagepath;
  `;

  const { rows } = await pool.query(sql, [
    data.groupname,
    data.imagepath,
    data.modifiedby,
    groupId
  ]);

  return rows[0];
};

/**
 * <summary>
 * Soft delete a category group record.
 * </summary>
 * <param name="groupId">Group identifier.</param>
 * <param name="deletedBy">User ID performing deletion.</param>
 * <returns>Promise resolving once deletion is complete.</returns>
 */
exports.deleteCategoryGroup = async (groupId, deletedBy) => {
  const sql = `
    UPDATE tbcategorygroup
    SET delflag   = true,
        isactive  = false,
        deletedby = $1,
        deletedon = NOW()
    WHERE groupid = $2;
  `;
  await pool.query(sql, [deletedBy, groupId]);
};
