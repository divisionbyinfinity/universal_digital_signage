const responseHandler = require('@helpers/responseHandler');
const mongoose = require('mongoose');
const Medias = mongoose.model('Medias');
// Endpoint to edit name and tags for an image
/**
 * @swagger
 * /api/common/gallery/{id}:
 *   patch:
 *     summary: Edit name and tags of an image/media
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image/media to edit
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: New name for the image
 *       - in: query
 *         name: tags
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of tags for the image
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       401:
 *         description: Unauthorized to edit this media
 *       404:
 *         description: Image not found
 *       500:
 *         description: Failed to update image
 */
module.exports= async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tags } = req.query;
    const user=req.user
   
    if (!name || name.length==0 || !tags || tags.length==0){
      return responseHandler.handleErrorResponse(res, 'name or tags cannot be empty');

    }
    // Find the image by ID
    const image = await Medias.findById(id);
    if (!image) {
      return responseHandler.handleErrorResponse(res, 'Image not found.');
    }
    if (user.role === 'assetManager' && user.departmentId?._id !==image.department || (user.role === 'standard' && user.id !== image.uploadedBy)) {
      return responseHandler.handleErrorResponse(res, 401, "Unauthorized to edit media.");
    }
    // Update name and tags
    if (name) {
      image.name = name;
    }

    if (tags) {
      image.tags = tags;
    }

    // Save the updated image
    const updatedImage = await image.save();

    return responseHandler.handleSuccessResponse(res, 'Image updated successfully.');
  } catch (error) {
    console.error("Error:", error);
    return responseHandler.handleErrorResponse(res, 500, 'Failed to update image.');
  }
};