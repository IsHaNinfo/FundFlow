import express from "express";
import * as customerProfileController from "../controllers/customerProfile.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerProfile:
 *       type: object
 *       required:
 *         - userId
 *         - monthlyIncome
 *         - occupation
 *         - address
 *         - creditScore
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the customer profile
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Reference to the user
 *         monthlyIncome:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Customer's monthly income
 *         occupation:
 *           type: string
 *           description: Customer's occupation
 *         address:
 *           type: string
 *           description: Customer's address
 *         creditScore:
 *           type: integer
 *           minimum: 300
 *           maximum: 850
 *           description: Customer's credit score
 *         User:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             nic:
 *               type: string
 */

/**
 * @swagger
 * /api/customer-profiles:
 *   post:
 *     summary: Create a new customer profile
 *     tags: [CustomerProfiles]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monthlyIncome
 *               - occupation
 *               - address
 *             properties:
 *               monthlyIncome:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 50000
 *               occupation:
 *                 type: string
 *                 example: "Software Engineer"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Colombo"
 *     responses:
 *       201:
 *         description: Customer profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/CustomerProfile'
 *                 message:
 *                   type: string
 *                   example: Customer profile created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Customer profile already exists
 */
router.post(
    "/",
    authenticate,
    authorize('customer'),
    customerProfileController.createCustomerProfile
);

/**
 * @swagger
 * /api/customer-profiles:
 *   get:
 *     summary: Get all customer profiles (Admin only)
 *     tags: [CustomerProfiles]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of all customer profiles
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
 *                     $ref: '#/components/schemas/CustomerProfile'
 *                 message:
 *                   type: string
 *                   example: Customer profiles retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
    "/",
    authenticate,
    authorize('admin'),
    customerProfileController.getAllCustomerProfiles
);

/**
 * @swagger
 * /api/customer-profiles/{id}:
 *   get:
 *     summary: Get customer profile by ID
 *     tags: [CustomerProfiles]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Customer profile ID
 *     responses:
 *       200:
 *         description: Customer profile found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/CustomerProfile'
 *                 message:
 *                   type: string
 *                   example: Customer profile retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Customer profile not found
 */
router.get(
    "/:id",
    authenticate,
    customerProfileController.getCustomerProfileById
);

/**
 * @swagger
 * /api/customer-profiles/user/{userId}:
 *   get:
 *     summary: Get customer profile by user ID
 *     tags: [CustomerProfiles]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Customer profile found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/CustomerProfile'
 *                 message:
 *                   type: string
 *                   example: Customer profile retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Customer profile not found
 */
router.get(
    "/user/:userId",
    authenticate,
    customerProfileController.getCustomerProfileByUserId
);

/**
 * @swagger
 * /api/customer-profiles/{id}:
 *   put:
 *     summary: Update customer profile
 *     tags: [CustomerProfiles]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Customer profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthlyIncome:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 55000
 *               occupation:
 *                 type: string
 *                 example: "Senior Software Engineer"
 *               address:
 *                 type: string
 *                 example: "456 New St, Colombo"
 *     responses:
 *       200:
 *         description: Customer profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/CustomerProfile'
 *                 message:
 *                   type: string
 *                   example: Customer profile updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Customer profile not found
 */
router.put(
    "/:id",
    authenticate,
    customerProfileController.updateCustomerProfile
);

/**
 * @swagger
 * /api/customer-profiles/{id}:
 *   delete:
 *     summary: Delete customer profile (Admin only)
 *     tags: [CustomerProfiles]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Customer profile ID
 *     responses:
 *       200:
 *         description: Customer profile deleted successfully
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
 *                   example: Customer profile deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Customer profile not found
 */
router.delete(
    "/:id",
    authenticate,
    authorize('admin'),
    customerProfileController.deleteCustomerProfile
);

export default router; 