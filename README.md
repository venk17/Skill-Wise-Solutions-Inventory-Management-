# 📦 Inventory Management System

A full-stack inventory management application built with Node.js, Express, SQLite, and React. This system provides comprehensive product management, inventory tracking, and CSV import/export functionality.

## ✨ Features

### Backend Features
- **RESTful API** with Express.js and SQLite database
- **Product Management** - Full CRUD operations for inventory items
- **Inventory History Tracking** - Automatic logging of stock changes
- **CSV Import/Export** - Bulk product management with file uploads
- **Search & Filtering** - Advanced product search by name and category
- **Pagination** - Efficient data handling for large inventories
- **Automatic Status Updates** - Dynamic stock status based on quantity

### Frontend Features
- **Modern React Interface** - Clean, responsive design with React Router
- **Real-time Stock Management** - Inline editing with instant updates
- **Advanced Pagination** - Smart pagination with customizable items per page
- **Advanced Search & Filters** - Quick product discovery
- **Inventory History Sidebar** - Visual tracking of stock changes
- **CSV Import/Export Interface** - User-friendly bulk operations
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Loading States & Error Handling** - Smooth user experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Manual Setup (Alternative)

If you prefer to start each service separately:

1. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📁 Project Structure

```
inventory-management-system/
├── backend/
│   ├── controllers/
│   │   └── productController.js    # Business logic for products
│   ├── middleware/
│   │   └── upload.js              # File upload handling
│   ├── routes/
│   │   └── products.js            # API route definitions
│   ├── uploads/                   # Temporary file storage
│   ├── db.js                      # Database setup and mock data
│   ├── server.js                  # Express server configuration
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductTable.js           # Product listing and management
│   │   │   ├── ProductForm.js            # Add/Edit product form
│   │   │   └── InventoryHistorySidebar.js # History tracking display
│   │   ├── pages/
│   │   │   ├── Dashboard.js              # Main inventory dashboard
│   │   │   └── ImportExportPage.js       # CSV operations interface
│   │   ├── services/
│   │   │   └── api.js                    # API service layer
│   │   ├── App.js                        # Main app component
│   │   ├── index.js                      # React entry point
│   │   └── index.css                     # Global styles
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
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
);
```

### Inventory History Table
```sql
CREATE TABLE inventory_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  old_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_info TEXT DEFAULT 'System',
  FOREIGN KEY (product_id) REFERENCES products (id)
);
```

## 📊 Mock Data

The system comes preloaded with sample inventory data including:

| Product Name       | Category    | Brand       | Stock | Status       |
|-------------------|-------------|-------------|-------|--------------|
| Laptop            | Electronics | Dell        | 25    | In Stock     |
| Mouse             | Accessories | Logitech    | 50    | In Stock     |
| Keyboard          | Accessories | HP          | 40    | In Stock     |
| Office Chair      | Furniture   | FeatherLite | 0     | Out of Stock |
| Projector         | Electronics | Epson       | 10    | In Stock     |
| Water Bottle      | Stationery  | Milton      | 60    | In Stock     |
| White Board Marker| Stationery  | Camlin      | 20    | In Stock     |
| Printer           | Electronics | Canon       | 5     | In Stock     |
| Paper A4 Pack     | Stationery  | JK          | 100   | In Stock     |
| Headphones        | Electronics | Boat        | 0     | Out of Stock |

## 🔗 API Endpoints

### Products
- `GET /api/products` - List all products (with pagination and filters)
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/history` - Get inventory change history
- `GET /api/products/categories` - Get all categories
- `POST /api/products/import` - Import products from CSV
- `GET /api/products/export` - Export products to CSV

### Query Parameters (for GET /api/products)
- `search` - Filter by product name
- `category` - Filter by category
- `page` - Page number for pagination
- `limit` - Items per page (1-100, default: 10)

## 📋 CSV Format

### Import Format
```csv
name,unit,category,brand,stock,status
Product Name,pcs,Category,Brand Name,10,In Stock
```

### Required Fields
- **name** - Product name (string)
- **unit** - Unit of measurement (pcs, kg, box, etc.)
- **category** - Product category
- **brand** - Brand name
- **stock** - Stock quantity (number)
- **status** - Will be auto-calculated based on stock

## 🎨 Design Features

- **Clean, Modern Interface** - Professional dashboard design
- **Smart Pagination** - Intelligent page navigation with ellipsis for large datasets
- **Color-coded Status** - Visual indicators for stock levels
- **Responsive Layout** - Optimized for all screen sizes
- **Smooth Animations** - Enhanced user experience with transitions
- **Intuitive Navigation** - Clear routing between features
- **Form Validation** - Client-side validation with error messages
- **Loading States** - Visual feedback during data operations

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **Multer** - File upload handling
- **CSV Parser** - CSV file processing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Modern JavaScript** - ES6+ features

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub repository
2. Connect repository to deployment service
3. Set environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   ```

### Frontend Deployment (Netlify/Vercel)
1. Build the React app:
   ```bash
   cd frontend && npm run build
   ```
2. Deploy the `build` folder
3. Update environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

## 🛠️ Development

### Backend Development
- Uses nodemon for hot reloading
- SQLite database for easy setup
- Structured with MVC pattern
- Comprehensive error handling

### Frontend Development
- Create React App with hot reloading
- Component-based architecture
- Service layer for API calls
- Responsive design principles

## 📝 Future Enhancements

- [ ] User authentication and role-based access
- [ ] Advanced reporting and analytics
- [ ] Barcode scanning integration
- [ ] Multi-location inventory support
- [ ] Email notifications for low stock
- [ ] Integration with accounting systems
- [ ] Mobile app development
- [ ] Advanced search with filters
- [ ] Bulk operations interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions about this inventory management system:

- Create an issue in the repository
- Check the documentation above
- Review the code comments for implementation details

---

**Built with ❤️ using modern web technologies for efficient inventory management.**