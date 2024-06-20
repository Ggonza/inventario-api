import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.mjs';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.mjs';
import dateMiddleware from '../middleware/dateMiddlewate.mjs';

const router = express.Router();

/**
 * @api {post} /api/products/ Create a new product
 * @apiName CreateProduct
 * @apiGroup Product
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiBody {String} lotNumber Lot number of the product.
 * @apiBody {String} name Name of the product.
 * @apiBody {Number} price Price of the product.
 * @apiBody {Number} quantity Quantity of the product.
 * @apiBody {Date} entryDate Entry date of the product. (Format: yyyy-mm-dd)
 *
 * @apiParamExample {json} Request-Example:
 * {
 *   "lotNumber": "A123",
 *   "name": "Product Name",
 *   "price": 100.0,
 *   "quantity": 50,
 *   "entryDate": "2024-06-19"
 * }
 *
 * @apiSuccess {Object} product Created product.
 * @apiError {String} error Error message.
 */
router.post('/', authMiddleware, adminMiddleware, dateMiddleware, createProduct);

/**
 * @api {get} /api/products/all Get all products
 * @apiName GetProducts
 * @apiGroup Product
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiSuccess {Object[]} products List of products.
 * @apiError {String} error Error message.
 */
router.get('/all', authMiddleware, getAllProducts);

/**
 * @api {get} /api/products/get/:id Get product by ID
 * @apiName GetProduct
 * @apiGroup Product
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Product ID.
 *
 * @apiSuccess {Object} product Product data.
 * @apiError {String} error Error message.
 */
router.get('/get/:id', authMiddleware, getProductById);

/**
 * @api {put} /api/products/update/:id Update a product
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Product ID.
 * @apiBody {String} [lotNumber] Lot number of the product.
 * @apiBody {String} [name] Name of the product.
 * @apiBody {Number} [price] Price of the product.
 * @apiBody {Number} [quantity] Quantity of the product.
 * @apiBody {Date} [entryDate] Entry date of the product.
 * 
 * @apiParamExample {json} Request-Example:
 * {
 *   "lotNumber": "updLot",
 *   "name": "updProd",
 *   "price": 100.0,
 *   "quantity": 50,
 *   "entryDate": "2024-06-19"
 * }
 *
 * @apiSuccess {Object} product Updated product.
 * @apiError {String} error Error message.
 */
router.put('/update/:id', authMiddleware, adminMiddleware, dateMiddleware, updateProduct);

/**
 * @api {delete} /api/products/delete/:id Delete a product
 * @apiName DeleteProduct
 * @apiGroup Product
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Product ID.
 *
 * @apiSuccess {String} message Success message.
 * @apiError {String} error Error message.
 */
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
