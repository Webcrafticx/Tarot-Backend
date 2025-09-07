const express = require('express');
const { validateAppointment } = require('../validators/validation');
const { createAppointment, getAppointments } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Appointment management APIs
 */

/**
 * @swagger
 * /appointment/create-appointment:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointment]
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
 *                 enum: [Mon-Wed, Thu-Fri, Sat-Sun]
 *                 example: Mon-Wed
 *               duration:
 *                 type: number
 *                 example: 20
 *               price:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Appointment created successfully
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
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Selected slot not available
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /appointment/all-appointment:
 *   get:
 *     summary: Get all appointments (admin)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of appointments per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed]
 *         description: Filter by appointment status
 *       - in: query
 *         name: selectedWindow
 *         schema:
 *           type: string
 *           enum: [Mon-Wed, Thu-Fri, Sat-Sun]
 *         description: Filter by selected window
 *     responses:
 *       200:
 *         description: List of appointments with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalAppointments:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     prevPage:
 *                       type: integer
 *                     nextPage:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         serviceType:
 *           type: string
 *         selectedWindow:
 *           type: string
 *           enum: [Mon-Wed, Thu-Fri, Sat-Sun]
 *         duration:
 *           type: number
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, confirmed]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */


router.post('/create-appointment', validateAppointment, createAppointment)

router.get("/all-appointment", auth, getAppointments)

module.exports = router;