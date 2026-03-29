const { pool } = require('../../../config/database');

/**
 * Get Flash Sale Products (High Performance)
 */
exports.getFeaturedProducts = async (page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const sql = `
      WITH today_orders AS (
        SELECT 
            oi.productid,
            SUM(oi.quantity) AS total_sold
        FROM tborderitem oi
        JOIN tborder o ON oi.orderid = o.orderid
        --WHERE o.orderdate::date = CURRENT_DATE
        GROUP BY oi.productid
      ),
      product_data AS (
          SELECT 
              p.productid,
              p.productname,
              p.productcode,

              COALESCE(i.imagepath, '/images/default.jpg') AS productimage,
              i.ishasclude,
              COALESCE(i.cludeimagepath, '/images/default.jpg') AS productcludeimage,

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

              -- ✅ SOLD (Today Orders)
              COALESCE(to1.total_sold, 0) AS total_sold,

              -- ✅ STOCK (FROM PURCHASE ITEMS)
              COALESCE(SUM(pi.quantity), 0) AS total_stock,

              -- ✅ SOLD PERCENT (OPTIONAL)
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
              ON p.categoryid = c.categoryid 
              AND c.isactive = true

          JOIN tbcategorygroup cg 
              ON c.groupid = cg.groupid 
              AND cg.isactive = true

          JOIN tbsubcategory s 
              ON p.subcategoryid = s.subcategoryid 
              AND s.isactive = true

          JOIN tbdepartment d 
              ON p.deptid = d.deptid

          JOIN tbstore st 
              ON p.storeid = st.storeid

          LEFT JOIN tbproductimage i 
              ON p.productid = i.productid 
              AND i.isprimary = true 
              AND i.isactive = true

          WHERE 
              p.isactive = true 
              AND p.delflag = false

          GROUP BY 
              p.productid,
              p.productname,
              p.productcode,
              i.imagepath,
              i.ishasclude,
              i.cludeimagepath,
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
      ),
      final_data AS (
        SELECT *
        FROM product_data
        ORDER BY total_sold DESC NULLS LAST, productname
      )
      SELECT *,
             COUNT(*) OVER() AS total_count
      FROM final_data
      LIMIT $1 OFFSET $2;
    `;
    const { rows } = await pool.query(sql, [pageSize, offset]);
    const totalRecords = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
    return {
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      totalRecords,
      data: rows.map(({ total_count, ...rest }) => rest)
    };

  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    throw error;
  }
};