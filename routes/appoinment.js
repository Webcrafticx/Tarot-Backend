const express = require('express');
const { validateAppointment } = require('../validators/validation');
const { getAppointments } = require('../controllers/appointmentController');
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


// router.post('/create-appointment', validateAppointment, createAppointment)

router.get("/all-appointment", auth, getAppointments)

module.exports = router;