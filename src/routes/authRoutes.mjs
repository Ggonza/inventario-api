import { Router } from 'express';
import { register, login } from '../controllers/authController.mjs';

const router = Router();

/**
 * @api {post} /api/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Username of the user.
 * @apiBody {String} password Password of the user.
 * @apiBody {String} role Role of the user (ADMIN or CLIENT).
 *
 * @apiSuccess {String} message User registered successfully.
 * @apiError {String} error Error message.
 */
router.post('/register', register);

/**
 * @api {post} /api/auth/login Login a user
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Username of the user.
 * @apiBody {String} password Password of the user.
 *
 * @apiSuccess {String} token JWT token for authentication.
 * @apiError {String} error Error message.
 */
router.post('/login', login);

export default router;
