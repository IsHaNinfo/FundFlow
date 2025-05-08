import express from "express";
import * as loanController from "../controllers/loan.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/loan:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
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
 *               - customerId
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
 *               customerId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Loan created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', loanController.createLoan);

/**
 * @swagger
 * /api/loan:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: List of all loans
 */
router.get('/', loanController.getAllLoans);

/**
 * @swagger
 * /api/loan/{id}:
 *   get:
 *     summary: Get loan by ID
 *     tags: [Loans]
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
 *       404:
 *         description: Loan not found
 */
router.get('/:id', loanController.getLoan);

/**
 * @swagger
 * /api/loan/{id}:
 *   put:
 *     summary: Update loan
 *     tags: [Loans]
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
 *       200:
 *         description: Loan updated successfully
 *       404:
 *         description: Loan not found
 */
router.put('/:id', loanController.updateLoan);

/**
 * @swagger
 * /api/loan/{id}:
 *   delete:
 *     summary: Delete loan
 *     tags: [Loans]
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
 *       404:
 *         description: Loan not found
 */
router.delete('/:id', loanController.deleteLoan);

/**
 * @swagger
 * /api/loan/customer/{customerId}:
 *   get:
 *     summary: Get all loans for a customer
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of customer's loans
 *       404:
 *         description: Customer not found
 */
router.get('/customer/:customerId', loanController.getLoansByCustomerId);

export default router;
