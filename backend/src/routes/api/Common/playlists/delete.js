const mongoose =require('mongoose')
const Playlists=mongoose.model('Playlists')
const responseHandler =require('@helpers/responseHandler')
const AssignedPlaylists=mongoose.model('AssignedPlaylists')
const Schedulers=mongoose.model('Schedulers')
const Slides = mongoose.model('Slides');
const Styles = mongoose.model('Styles');
const { deleteDirectory,zipDirectory } = require('@helpers/utils');
/**
 * @swagger
 * /api/common/playlists/{id}:
 *   delete:
 *     tags: [Playlists]
 *     summary: Delete a playlist
 *     description: >
 *       Deletes a playlist if:
 *       - It is not assigned to any device.
 *       - It is not locked.
 *       - It is not assigned to any schedule.
 *       - The user has proper authorization based on role and department.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the playlist to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
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
 *                   example: Successfully deleted Playlist
 *       400:
 *         description: Bad Request (e.g., playlist is locked or assigned to a device)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cannot delete a locked playlist
 *       401:
 *         description: Unauthorized (user doesn't have permission)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cannot delete playlist due to unauthorized request
 *       404:
 *         description: Playlist not found or assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Assigned Playlist cannot be deleted
 */


module.exports = async (req, res) => {

  try {

    const playlistId = req.params.id;
    if (!playlistId) return responseHandler.handleErrorResponse(res, 400, "Playlist ID is required");

    const user = req.user;
    const playlist = await Playlists.findById(playlistId).populate('slides').populate('style');
    if (!playlist) return responseHandler.handleErrorResponse(res, 404, "Playlist not found");

    // 🔒 Authorization & validation checks
    const assignedPlaylist = await AssignedPlaylists.findOne({ playlist: playlistId });
    if (assignedPlaylist) return responseHandler.handleErrorResponse(res, 404, "Assigned Playlist cannot be deleted.");

    if ((user.role === "assetManager" && user.departmentId?.toString() !== playlist.department?.toString())
      || (user.role === "standard" && user.id?.toString() !== playlist.createdBy?.toString())) {
      return responseHandler.handleErrorResponse(res, 401, "Unauthorized request");
    }

    if (playlist.lock) return responseHandler.handleErrorResponse(res, 400, "Cannot delete a locked playlist");

    if (playlist.devices?.length) return responseHandler.handleErrorResponse(res, 400, "Cannot delete a playlist assigned to a device");

    const assignedSchedule = await Schedulers.findOne({ playlistId });
    if (assignedSchedule) {
      return responseHandler.handleErrorResponse(res, 404, "Assigned Playlist cannot be deleted.");
    
    }
    // 🚀 Cascade deletions inside transaction
    if (playlist.slides?.length) {
      const slideIds = playlist.slides.map(slide => slide._id);
      await Slides.deleteMany({ _id: { $in: slideIds } });
      const styleIds = playlist.slides
                      .map(slide => slide.style._id);
      if (styleIds.length) {
        await Styles.deleteMany({ _id: { $in: styleIds } });
      }
    }

    if (playlist.style?._id) {
      await Styles.findByIdAndDelete(playlist.style._id);
    }

    await Playlists.findByIdAndDelete(playlistId);
    await AssignedPlaylists.deleteMany({ playlist: playlistId });


    
    await zipDirectory(`${process.env.CDN_CONTAINER_PATH}playlist/${playlist.name}`,
                        `${process.env.CDN_CONTAINER_PATH}recyclebin/playlist/${playlist.name}`,
                        playlist.name
    )
    
    // Delete CDN directory outside transaction
    await deleteDirectory(`${process.env.CDN_CONTAINER_PATH}playlist/${playlist.name}`);

    return responseHandler.handleSuccessResponse(res, "Successfully deleted playlist");

  } catch (error) {
    console.error("Error deleting playlist:", error);
    return responseHandler.handleErrorResponse(res, 500, "Internal Server Error");
  }
};
