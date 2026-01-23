const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Channels = mongoose.model('Channels');
const responseHandler = require('@helpers/responseHandler');

/**
 * @swagger
 * /api/admin/channels/{channelId}:
 *   patch:
 *     summary: Update lock status of a channel
 *     description: Change the lock status (true/false) of a specific channel by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: ID of the channel to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Lock status to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lock:
 *                 type: boolean
 *                 description: Lock status of the channel
 *     responses:
 *       200:
 *         description: Channel status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid lockStatus value
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:channelId', async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { lock } = req.body;
    if (lock !== undefined && typeof lock === 'boolean') {
      const updatedChannel = await Channels.findByIdAndUpdate(
        channelId,
        { $set: { lock: lock } },
        { new: true }
      );

      if (updatedChannel) {
        return responseHandler.handleSuccessResponse(res,'Channel status updated successfully');
      } else {
        return responseHandler.handleErrorResponse(res,404,'Channel not found' );
      }
    } else {
        return responseHandler.handleErrorResponse(res,400,'Invalid lockStatus value' );
    }
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res,500,'Internal server error' );
  }
});

module.exports = router;
