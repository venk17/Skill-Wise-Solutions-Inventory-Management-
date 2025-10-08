import database from '../db.js';
import csv from 'csv-parser';
import fs from 'fs';

const db = database.getDb();

export const getAllProducts = (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  // Validate pagination parameters
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
  const offset = (pageNum - 1) * limitNum;
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND name LIKE ?';
      countParams.push(`%${search}%`);
    }

    if (category && category !== 'All') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        products: rows,
        totalCount: countResult.total,
        currentPage: pageNum,
        totalPages: Math.ceil(countResult.total / limitNum),
        itemsPerPage: limitNum
      });
    });
  });
};

export const getProductById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
};

export const createProduct = (req, res) => {
  const { name, unit, category, brand, stock } = req.body;
  const status = stock > 0 ? 'In Stock' : 'Out of Stock';

  db.run(
    'INSERT INTO products (name, unit, category, brand, stock, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, unit, category, brand, stock, status],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        name,
        unit,
        category,
        brand,
        stock,
        status
      });
    }
  );
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, unit, category, brand, stock } = req.body;
  const status = stock > 0 ? 'In Stock' : 'Out of Stock';

  // First get the current product to check if stock changed
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, currentProduct) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!currentProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product
    db.run(
      'UPDATE products SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, unit, category, brand, stock, status, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // If stock changed, add to history
        if (currentProduct.stock !== stock) {
          db.run(
            'INSERT INTO inventory_history (product_id, old_quantity, new_quantity) VALUES (?, ?, ?)',
            [id, currentProduct.stock, stock],
            (historyErr) => {
              if (historyErr) {
                console.error('Error adding to history:', historyErr);
              }
            }
          );
        }

        res.json({
          id: parseInt(id),
          name,
          unit,
          category,
          brand,
          stock,
          status
        });
      }
    );
  });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
};

export const getProductHistory = (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT ih.*, p.name as product_name 
     FROM inventory_history ih 
     JOIN products p ON ih.product_id = p.id 
     WHERE ih.product_id = ? 
     ORDER BY ih.change_date DESC`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};

export const importProducts = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const products = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const stock = parseInt(data.stock) || 0;
      products.push({
        name: data.name,
        unit: data.unit,
        category: data.category,
        brand: data.brand,
        stock: stock,
        status: stock > 0 ? 'In Stock' : 'Out of Stock'
      });
    })
    .on('end', () => {
      const stmt = db.prepare(
        'INSERT INTO products (name, unit, category, brand, stock, status) VALUES (?, ?, ?, ?, ?, ?)'
      );

      let imported = 0;
      products.forEach((product) => {
        stmt.run(
          [product.name, product.unit, product.category, product.brand, product.stock, product.status],
          (err) => {
            if (err) {
              console.error('Error importing product:', err);
            } else {
              imported++;
            }
          }
        );
      });

      stmt.finalize(() => {
        fs.unlinkSync(filePath); // Clean up uploaded file
        res.json({ message: `Successfully imported ${imported} products` });
      });
    })
    .on('error', (err) => {
      fs.unlinkSync(filePath);
      res.status(500).json({ error: 'Error parsing CSV file' });
    });
};

export const exportProducts = (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const csvHeader = 'name,unit,category,brand,stock,status\n';
    const csvContent = rows.map(product => 
      `${product.name},${product.unit},${product.category},${product.brand},${product.stock},${product.status}`
    ).join('\n');

    const csv = csvHeader + csvContent;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csv);
  });
};

export const getCategories = (req, res) => {
  db.all('SELECT DISTINCT category FROM products ORDER BY category', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
};