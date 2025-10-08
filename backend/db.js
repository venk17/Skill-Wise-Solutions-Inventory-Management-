import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'inventory.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('✅ Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        image TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createHistoryTable = `
      CREATE TABLE IF NOT EXISTS inventory_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        old_quantity INTEGER NOT NULL,
        new_quantity INTEGER NOT NULL,
        change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_info TEXT DEFAULT 'System',
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `;

    this.db.run(createProductsTable, (err) => {
      if (err) {
        console.error('Error creating products table:', err);
      } else {
        console.log('✅ Products table ready');
        this.insertMockData();
      }
    });

    this.db.run(createHistoryTable, (err) => {
      if (err) {
        console.error('Error creating inventory_history table:', err);
      } else {
        console.log('✅ Inventory history table ready');
      }
    });
  }

  insertMockData() {
    this.db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error checking products count:', err);
        return;
      }

      if (row.count === 0) {
        const mockProducts = [
          ['Laptop', 'pcs', 'Electronics', 'Dell', 25, 'In Stock'],
          ['Mouse', 'pcs', 'Accessories', 'Logitech', 50, 'In Stock'],
          ['Keyboard', 'pcs', 'Accessories', 'HP', 40, 'In Stock'],
          ['Office Chair', 'pcs', 'Furniture', 'FeatherLite', 0, 'Out of Stock'],
          ['Projector', 'pcs', 'Electronics', 'Epson', 10, 'In Stock'],
          ['Water Bottle', 'pcs', 'Stationery', 'Milton', 60, 'In Stock'],
          ['White Board Marker', 'box', 'Stationery', 'Camlin', 20, 'In Stock'],
          ['Printer', 'pcs', 'Electronics', 'Canon', 5, 'In Stock'],
          ['Paper A4 Pack', 'pack', 'Stationery', 'JK', 100, 'In Stock'],
          ['Headphones', 'pcs', 'Electronics', 'Boat', 0, 'Out of Stock']
        ];

        const insertStmt = this.db.prepare(`
          INSERT INTO products (name, unit, category, brand, stock, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        mockProducts.forEach((product) => {
          insertStmt.run(product, (err) => {
            if (err) {
              console.error('Error inserting mock product:', err);
            }
          });
        });

        insertStmt.finalize((err) => {
          if (err) {
            console.error('Error finalizing insert statement:', err);
          } else {
            console.log('✅ Mock data inserted successfully');
          }
        });
      }
    });
  }

  getDb() {
    return this.db;
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        }
        resolve();
      });
    });
  }
}

export default new Database();