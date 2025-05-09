import express from "express";
import * as loanController from "../controllers/loan.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter your JWT token in the format: Bearer <token>
 *   schemas:
 *     Loan:
 *       type: object
 *       required:
 *         - loanAmount
 *         - durationMonths
 *         - purpose
 *         - monthlyIncome
 *         - existingLoans
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated UUID of the loan
 *         loanAmount:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Amount of the loan
 *         durationMonths:
 *           type: integer
 *           minimum: 1
 *           description: Duration of the loan in months
 *         purpose:
 *           type: string
 *           description: Purpose of the loan
 *         monthlyIncome:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Monthly income of the applicant
 *         existingLoans:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Total amount of existing loans
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: Status of the loan application
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the customer who applied for the loan
 */

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Create a new loan application (Customer only)
 *     tags: [Loans]
 *     security:
 *       - userAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanAmount
 *               - durationMonths
 *               - purpose
 *               - monthlyIncome
 *               - existingLoans
 *             properties:
 *               loanAmount:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               durationMonths:
 *                 type: integer
 *                 minimum: 1
 *               purpose:
 *                 type: string
 *               monthlyIncome:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               existingLoans:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Loan application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (Customer role required)
 */
router.post(
    '/',
    authenticate,
    authorize('customer'),
    loanController.createLoan
);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: List of all loans
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get(
    '/',
    authenticate,
    authorize('admin'),
    loanController.getAllLoans
);

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get loan by ID
 *     tags: [Loans]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Loan details
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Loan not found
 */
router.get(
    '/:id',
    authenticate,
    loanController.getLoan
);

/**
 * @swagger
 * /api/loans/{id}:
 *   put:
 *     summary: Update loan (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Loan updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Loan not found
 */
router.put(
    '/:id',
    authenticate,
    authorize('customer'),
    loanController.updateLoan
);

/**
 * @swagger
 * /api/loans/{id}:
 *   delete:
 *     summary: Delete loan (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Loan deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (Admin role required)
 *       404:
 *         description: Loan not found
 */
router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    loanController.deleteLoan
);

/**
 * @swagger
 * /api/loans/my-loans:
 *   get:
 *     summary: Get current user's loans
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: List of user's loans
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get(
    '/my-loans',
    authenticate,
    authorize('customer'),
    loanController.getLoansByUserId
);

export default router;
