import express from 'express';
import { createPurchase, getAllPurchases, getPurchaseById, updatePurchase, deletePurchase, getPurchaseTotalByClient, getPurchasesByClient } from '../controllers/purchaseController.mjs';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.mjs';

const router = express.Router();

/**
 * @api {post} /api/purchases/newPurchase Crear una nueva compra
 * @apiName CreatePurchase
 * @apiGroup Purchase
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {Number} clientId ID del cliente que realiza la compra.
 * @apiBody {Array} products Lista de productos con productId y quantity.
 *
 * @apiSuccess {Object} purchase Compra creada.
 * @apiError {String} error Mensaje de error.
 */
router.post('/newPurchase', authMiddleware, createPurchase);

/**
 * @api {get} /api/purchases/all Obtener todas las compras
 * @apiName GetPurchases
 * @apiGroup Purchase
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object[]} purchases Lista de compras.
 * @apiError {String} error Mensaje de error.
 */
router.get('/all', authMiddleware, adminMiddleware, getAllPurchases);

/**
 * @api {get} /api/purchases/get/:id Obtener compra por ID
 * @apiName GetPurchase
 * @apiGroup Purchase
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id ID de la compra.
 *
 * @apiSuccess {Object} purchase Datos de la compra.
 * @apiError {String} error Mensaje de error.
 */
router.get('/get/:id', authMiddleware, getPurchaseById);

/**
 * @api {put} /api/purchases/update/:id Actualizar una compra
 * @apiName UpdatePurchase
 * @apiGroup Purchase
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id ID de la compra.
 * @apiBody {Array} [products] Lista de productos con productId y quantity.
 *
 * @apiSuccess {Object} purchase Compra actualizada.
 * @apiError {String} error Mensaje de error.
 */
router.put('/update/:id', authMiddleware, adminMiddleware, updatePurchase);

/**
 * @api {delete} /api/purchases/delete/:id Eliminar una compra
 * @apiName DeletePurchase
 * @apiGroup Purchase
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id ID de la compra.
 *
 * @apiSuccess {String} message Mensaje de éxito.
 * @apiError {String} error Mensaje de error.
 */
router.delete('/delete/:id', authMiddleware, adminMiddleware, deletePurchase);

/**
 * @api {get} /api/purchases/client/:clientId Obtener compras por cliente
 * @apiName GetPurchasesByClient
 * @apiGroup Purchase
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} clientId ID del cliente.
 *
 * @apiSuccess {Object[]} purchases Lista de compras.
 * @apiError {String} error Mensaje de error.
 */
router.get('/client/:clientId', authMiddleware, getPurchasesByClient);

/**
 * @api {get} /api/purchases/client/:clientId/total Obtener el total de compras por cliente
 * @apiName GetPurchaseTotalByClient
 * @apiGroup Purchase
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} clientId ID del cliente.
 *
 * @apiSuccess {Object} total Total de compras del cliente.
 * @apiError {String} error Mensaje de error.
 */
router.get('/client/:clientId/total', authMiddleware, getPurchaseTotalByClient);

export default router;