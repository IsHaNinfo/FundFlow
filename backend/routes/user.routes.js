import express from "express";
import * as userController from "../controllers/user.controller.js";
import { userValidation } from "../validations/user.validation.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - nic
 *         - phoneNumber
 *         - role
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         nic:
 *           type: string
 *           description: User's National ID Card number
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         role:
 *           type: string
 *           enum: [admin, customer]
 *           description: User's role in the system
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 */

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin user management endpoints
 *   - name: Customer
 *     description: Customer user management endpoints
 */

/**
 * @swagger
 * /api/users/register/admin:
 *   post:
 *     summary: Register a new admin user (No authentication required)
 *     tags: [Admin]
 *     security: []  # No security required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - nic
 *               - phoneNumber
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Admin"
 *               lastName:
 *                 type: string
 *                 example: "User"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               nic:
 *                 type: string
 *                 example: "123456789V"
 *               phoneNumber:
 *                 type: string
 *                 example: "+94771234567"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Admin@123"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nic:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [admin]
 *                     token:
 *                       type: string
 *                       description: Admin JWT token
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already exists
 */
router.post("/register/admin", userController.registerAdmin);

/**
 * @swagger
 * /api/users/register/customer:
 *   post:
 *     summary: Register a new customer user (Requires admin token)
 *     tags: [Customer]
 *     security:
 *       - adminAuth: []  # Requires admin token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - nic
 *               - phoneNumber
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "customer@example.com"
 *               nic:
 *                 type: string
 *                 example: "987654321V"
 *               phoneNumber:
 *                 type: string
 *                 example: "+94771234568"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Customer@123"
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nic:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [customer]
 *                     token:
 *                       type: string
 *                       description: Customer JWT token
 *                 message:
 *                   type: string
 *                   example: Customer registered successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Email already exists
 */
router.post(
    "/register/customer",
    authenticate,
    authorize('admin'),
    userController.registerCustomer
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user (Admin or Customer)
 *     tags: [Admin, Customer]
 *     security: []  # No security required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password@123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nic:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [admin, customer]
 *                     token:
 *                       type: string
 *                       description: JWT token (admin or customer based on role)
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Admin, Customer]
 *     security:
 *       - adminAuth: []  # Admin token
 *       - userAuth: []   # Customer token
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nic:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [admin, customer]
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/profile", authenticate, userController.getUserById);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []  # Requires admin token
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 */
router.get("/", authorize('admin'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin, Customer]
 *     security:
 *       - adminAuth: []  # Admin token
 *       - userAuth: []   # Customer token
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Admin, Customer]
 *     security:
 *       - adminAuth: []  # Admin token
 *       - userAuth: []   # Customer token
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               nic:
 *                 type: string
 *                 example: "123456789V"
 *               phoneNumber:
 *                 type: string
 *                 example: "+94771234567"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 */
router.put("/:id", userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []  # Requires admin token
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 */
router.delete("/:id", authorize('admin'), userController.deleteUser);

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     summary: Get users by role (Admin only)
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []  # Requires admin token
 *     parameters:
 *       - in: path
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, customer]
 *         required: true
 *         description: User role
 *     responses:
 *       200:
 *         description: List of users with specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 */
router.get("/role/:role", authorize('admin'), userController.getUsersByRole);

export default router; 