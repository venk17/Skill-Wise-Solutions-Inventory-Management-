import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductHistory,
  importProducts,
  exportProducts,
  getCategories
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/export', exportProducts);
router.get('/:id', getProductById);
router.get('/:id/history', getProductHistory);
router.post('/', createProduct);
router.post('/import', upload.single('csvFile'), importProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;