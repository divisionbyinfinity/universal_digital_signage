const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Playlists = mongoose.model('Playlists');
const responseHandler = require('@helpers/responseHandler');

/**
 * @swagger
 * /api/admin/playlists/{playlistId}:
 *   patch:
 *     summary: Update lock status of a playlist
 *     description: Lock or unlock a playlist by ID. Admins can update any playlist; other users must belong to the same department.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the playlist to update
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
 *                 description: Lock status of the playlist
 *     responses:
 *       200:
 *         description: Playlist status updated successfully
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
 *       403:
 *         description: User not authorized
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:playlistId', async (req, res) => {
  try {
    const user = req.user;
    const playlistId = req.params.playlistId;
    const { lock } = req.body;
   const playlist = await Playlists.findById(playlistId);
    if (!playlist) {
      return responseHandler.handleErrorResponse(res,404,'playlist not found' );
    }
    if(user.role==="assetManager" && user.departmentId._id!=playlist.department){
    return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
    } 
    
    if (lock !== undefined && typeof lock === 'boolean') {
      const updatedPlaylist = await Playlists.findByIdAndUpdate(
        playlistId,
        { $set: { lock: lock } },
        { new: true }
      );
      if (updatedPlaylist) {
        return responseHandler.handleSuccessResponse(res,'playlist status updated successfully');
      } else {
        return responseHandler.handleErrorResponse(res,404,'playlist not found' );
      }
    } else {
        return responseHandler.handleErrorResponse(res,400,'Invalid lockStatus value' );
    }
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res,500,'Internal server error' );
  }
});
module.exports=router
