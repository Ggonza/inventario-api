import express from 'express';
import { createPurchase, getAllPurchases, getPurchaseById, updatePurchase, deletePurchase } from '../controllers/purchaseController.mjs';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.mjs';

const router = express.Router();

/**
 * @api {post} /api/purchases/newPurchase/ Create a new purchase
 * @apiName CreatePurchase
 * @apiGroup Purchase
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiBody {Number} clientId Client ID making the purchase.
 * @apiBody {Array} products List of products with productId and quantity.
 *
 * @apiSuccess {Object} purchase Created purchase.
 * @apiError {String} error Error message.
 */
router.post('/newPurchase', authMiddleware, createPurchase);

/**
 * @api {get} /api/purchases/all/ Get all purchases
 * @apiName GetPurchases
 * @apiGroup Purchase
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiSuccess {Object[]} purchases List of purchases.
 * @apiError {String} error Error message.
 */
router.get('/all', authMiddleware, adminMiddleware, getAllPurchases);

/**
 * @api {get} /api/purchases/get/:id/ Get purchase by ID
 * @apiName GetPurchase
 * @apiGroup Purchase
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Purchase ID.
 *
 * @apiSuccess {Object} purchase Purchase data.
 * @apiError {String} error Error message.
 */
router.get('/get/:id', authMiddleware, getPurchaseById);

/**
 * @api {put} /api/purchases/update/:id/ Update a purchase
 * @apiName UpdatePurchase
 * @apiGroup Purchase
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Purchase ID.
 * @apiBody {Array} [products] List of products with productId and quantity.
 *
 * @apiSuccess {Object} purchase Updated purchase.
 * @apiError {String} error Error message.
 */
router.put('/update/:id', authMiddleware, adminMiddleware, updatePurchase);

/**
 * @api {delete} /api/purchases/delete/:id Delete a purchase
 * @apiName DeletePurchase
 * @apiGroup Purchase
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Purchase ID.
 *
 * @apiSuccess {String} message Success message.
 * @apiError {String} error Error message.
 */
router.delete('/delete/:id', authMiddleware, adminMiddleware, deletePurchase);

export default router;
