const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Slides = mongoose.model("Slides");
const Playlists = mongoose.model("Playlists");
const Medias = mongoose.model("Medias");
const {moveFile} = require("@helpers/utils");

const responseHandler = require("@helpers/responseHandler");
/**
 * @swagger
 * /api/common/gallery/{imageId}:
 *   delete:
 *     summary: Delete an image/media by ID
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []   # must match your securitySchemes key
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image/media to delete
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       400:
 *         description: Cannot delete image (e.g., used in a playlist)
 *       401:
 *         description: Unauthorized (missing token or insufficient permission)
 *       404:
 *         description: Image does not exist
 *       500:
 *         description: Error deleting media
 */
// API endpoint to change the status of a device (lock)
module.exports = async (req, res) => {
  try {
    const { imageId } = req.params;
    const user = req.user;
    const image = await Medias.findById(imageId);
    if (!image) {
      return responseHandler.handleErrorResponse(
        res,
        404,
        "Image does not exist."
      );
    }
    const slide = await Slides.findOne({ "media._id": imageId });
    if (slide) {
      const playlist = await Playlists.findOne({ slides: slide._id }).populate(
        "department"
      );
      if (playlist) {
        return responseHandler.handleErrorResponse(
          res,
          400,
          `Cannot delete image already used in Playlist : ${playlist.name} , Department : ${playlist.department.name}`
        );
      }
    }
    // check if the user has permission to delete the media based on department
    if (
      user.role === "assetManager" &&
      user.departmentId !== media.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot delete media due to unauthorised request"
      );
    }
    if (user.role === "standard" && user.id !== media.createdBy) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot delete media due to unauthorised request"
      );
    }
    const uniqueImageName = image.mediaUrl.split('/')[1];
    if(!uniqueImageName) return responseHandler.handleErrorResponse(res,"Invalid media Url");

    await moveFile(`${process.env.CDN_PATH}imagelibrary/${uniqueImageName}`,
      `${process.env.CDN_PATH}recyclebin/imagelibrary/${uniqueImageName}`,)
    // If not assigned, proceed with deleting the media
    await Medias.deleteOne({ _id: image._id });
    return responseHandler.handleSuccessResponse(
      res,
      "Media deleted successfully."
    );
  } catch (error) {
    console.error("Error deleting media:", error);
    return responseHandler.handleErrorResponse(
      res,
      500,
      "Error deleting media."
    );
  }
};
