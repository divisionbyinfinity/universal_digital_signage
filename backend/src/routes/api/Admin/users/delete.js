const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const responseHandler = require('@helpers/responseHandler');

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a specific user. Returns success if deletion was successful.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
module.exports = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return responseHandler.handleErrorResponse(res, 404, 'User not found');
    }

    await Users.findByIdAndDelete(userId);
    return responseHandler.handleSuccessResponse(res, 'User deleted successfully');

  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res, 500, 'Internal Server Error');
  }
};
