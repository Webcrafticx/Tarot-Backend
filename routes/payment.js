const express = require('express');
const {
  createPaymentOrder,
  verifyPaymentAndCreateAppointment,
  getAppointments
} = require('../controllers/paymentController'); // ✅ import the right controllers
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment and appointment booking
 */

/**
 * @swagger
 * /payment/create-appointment:
 *   post:
 *     summary: Create a payment order for an appointment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - serviceType
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               serviceType:
 *                 type: string
 *                 example: Haircut
 *               selectedWindow:
 *                 type: string
 *                 example: Mon-Wed
 *               duration:
 *                 type: number
 *                 example: 30
 *               price:
 *                 type: number
 *                 example: 500
 *               location:
 *                 type: string
 *                 example: India
 *     responses:
 *       200:
 *         description: Payment order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment order created
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: order_1694123456789
 *                         amount:
 *                           type: number
 *                           example: 50000
 *                         currency:
 *                           type: string
 *                           example: INR
 *                         receipt:
 *                           type: string
 *                           example: temp_1694123456789
 *                         status:
 *                           type: string
 *                           example: created
 *                     appointmentData:
 *                       $ref: '#/components/schemas/AppointmentData'
 *       400:
 *         description: Selected slot is not available
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payment/verify:
 *   post:
 *     summary: Verify payment and create appointment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - orderId
 *               - appointmentData
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: pay_dummy_1694123456789
 *               orderId:
 *                 type: string
 *                 example: order_1694123456789
 *               appointmentData:
 *                 $ref: '#/components/schemas/AppointmentData'
 *     responses:
 *       200:
 *         description: Payment verified and appointment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment verified, appointment created & confirmed
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointmentId:
 *                       type: string
 *                       example: 64f4c8c2a1234567890abcd1
 *                     status:
 *                       type: string
 *                       example: confirmed
 *       400:
 *         description: Selected slot is no longer available
 *       500:
 *         description: Server error
 */



router.post('/create-appointment', createPaymentOrder);                  
router.post('/verify', verifyPaymentAndCreateAppointment);         

module.exports = router;
