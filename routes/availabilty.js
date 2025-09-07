const express = require('express');
const { getAvailability, getAvailabilityRange, setAvailability, deleteAvailability } = require('../controllers/availability');
const auth = require('../middleware/auth');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Manage availability windows
 */

/**
 * @swagger
 * /availability/available-slot:
 *   get:
 *     summary: Get all availability windows
 *     tags: [Availability]
 *     responses:
 *       200:
 *         description: List of all availability windows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       windowName:
 *                         type: string
 *                         enum: [Mon-Wed, Thu-Fri, Sat-Sun]
 *                       isAvailable:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /availability/set-availability:
 *   post:
 *     summary: Set or update availability window (Admin only)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - windowName
 *             properties:
 *               windowName:
 *                 type: string
 *                 enum: [Mon-Wed, Thu-Fri, Sat-Sun]
 *                 example: Mon-Wed
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Availability window updated successfully
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
 *                     _id:
 *                       type: string
 *                     windowName:
 *                       type: string
 *                     isAvailable:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Invalid windowName
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /availability/delete-availability/{id}:
 *   delete:
 *     summary: Delete an availability window (Admin only)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Availability window ID to delete
 *     responses:
 *       200:
 *         description: Availability window deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Availability window not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


router.get('/available-slot', getAvailability)


// router.get('/all-availability', auth, getAllAvailability)
router.post('/set-availability', auth, setAvailability)
router.delete('/delete-availability/:id', auth, deleteAvailability)

module.exports = router;