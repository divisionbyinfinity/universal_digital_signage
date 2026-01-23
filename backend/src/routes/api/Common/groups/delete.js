const mongoose = require('mongoose');
const Groups = mongoose.model('Groups');
const AssignedPlaylists=mongoose.model('AssignedPlaylists');
const responseHandler = require('@helpers/responseHandler');
/**
 * @swagger
 * /api/common/groups/{id}:
 *   delete:
 *     summary: Delete an existing group
 *     description: Deletes a group by ID. Only admins, asset managers of the same department, or the user who created the group (standard role) can delete it. Also removes associated assigned playlists.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID to delete
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: User not authorized to delete this group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

// Delete an existing group
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const record=await Groups.findById(id)
    // if the user is standard check created and not creadted by him 
    if (req.user.role==="standard") {
      if(record.createdBy!=req.user._id){
        return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
      } 
    }
    // check if user is assetManager and deosnt belong to same department thow error 
    else if (req.user.role==="assetManager") {
      if(req.user.departmentId._id!=record.department){
        return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
      } 
    } 
    else if (req.user.role!=="admin") {
      return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
    }
    await AssignedPlaylists.deleteMany({group:id,device:{$exists:false},channel:{$exists:false}})
    await AssignedPlaylists.updateMany({group:id},{group:null})
    const deletedGroup = await Groups.findByIdAndDelete(id);
    if (!deletedGroup) {
      return responseHandler.handleErrorResponse(res, 404, 'Group not found');
    }

    return responseHandler.handleSuccessResponse(res, 'Group deleted successfully');
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res, 500, 'Internal Server Error');
  }
};
