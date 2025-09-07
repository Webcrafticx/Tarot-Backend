const express = require('express');
const { createDummyOrder, verifyDummyPayment, getDummyPaymentOptions } = require('../controllers/paymentController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Dummy payment and appointment confirmation
 */

/**
 * @swagger
 * /payment/create-dummy-order:
 *   post:
 *     summary: Create a dummy payment order for an appointment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - amount
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 example: 64f4c8c2a1234567890abcd1
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Dummy order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     entity:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     amount_paid:
 *                       type: number
 *                     amount_due:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     receipt:
 *                       type: string
 *                     status:
 *                       type: string
 *                     attempts:
 *                       type: number
 *                     created_at:
 *                       type: number
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payment/verify-dummy-payment:
 *   post:
 *     summary: Verify a dummy payment and confirm the appointment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - orderId
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 example: 64f4c8c2a1234567890abcd1
 *               orderId:
 *                 type: string
 *                 example: order_dummy_1694123456789
 *     responses:
 *       200:
 *         description: Payment verified and appointment confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       type: object
 *                     paymentId:
 *                       type: string
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payment/dummy-options/{appointmentId}:
 *   get:
 *     summary: Get dummy payment options for a specific appointment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Dummy payment options fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointmentId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     description:
 *                       type: string
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */


// Create dummy order
router.post('/create-dummy-order', createDummyOrder);

// Verify dummy payment
router.post('/verify-dummy-payment', verifyDummyPayment);

// Get dummy payment options
router.get('/dummy-options/:appointmentId', getDummyPaymentOptions);

module.exports = router;
