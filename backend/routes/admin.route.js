import express from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', adminController.loginAdmin);

/**
 * @swagger
 * /api/admin/{email}:
 *   get:
 *     summary: Get admin by email
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin email
 *     responses:
 *       200:
 *         description: Admin found
 *       404:
 *         description: Admin not found
 */
router.get('/:email', adminController.getAdmin);

/**
 * @swagger
 * /api/admin/verify:
 *   post:
 *     summary: Verify admin credentials
 *     tags: [Admin]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin verified successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/verify', adminController.verifyAdmin);

/**
 * @swagger
 * /api/admin/initialize:
 *   post:
 *     summary: Initialize admin account
 *     tags: [Admin]
 *     description: Creates the initial admin account using environment variables
 *     responses:
 *       201:
 *         description: Admin initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Admin initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.post('/initialize', adminController.initializeAdmin);

export default router;
