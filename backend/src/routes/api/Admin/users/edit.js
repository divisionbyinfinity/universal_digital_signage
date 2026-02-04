const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Departments = mongoose.model('Departments');
const { storeImage } = require('@helpers/utils');
const bcrypt = require('bcryptjs');
const responseHandler = require('@helpers/responseHandler');
const path = require('path')

/**
 * @swagger
 * /api/admin/users/edit:
 *   patch:
 *     summary: Edit a user's details
 *     description: Update user fields such as name, email, password, role, department, bio, and profile image.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID of the user to edit
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               bio:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *     responses:
 *       200:
 *         description: User edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: User does not exist
 *       404:
 *         description: No fields given to update
 *       500:
 *         description: Internal server error
 */
const editUser = async (req, res) => {
  const editUser = {};
  try {
    const { _id, firstName, lastName, email, password, role, departmentId, bio } = req.body;
    const checkUser = await Users.findOne({ _id });
    if (!checkUser) return responseHandler.handleErrorResponse(res, 401, 'User does not exist');
    // check if email already exists
    const emailExists = await Users.findOne({
      _id: { $ne: _id },  // exclude the current user
      email: email,       // check for the same email
    });
    if(emailExists) return responseHandler.handleErrorResponse(res, 401, 'User already exists');

    if (firstName) editUser['firstName'] = firstName;
    if (lastName) editUser['lastName'] = lastName;
    if (email) editUser['email'] = email;
    if (bio) editUser['bio'] = bio;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      editUser['password'] = hashedPassword;
    }
    if (role) editUser['role'] = role;
    if (departmentId) {
      const department = await Departments.findOne({ _id: departmentId });
      editUser['departmentId'] = department._id;
      editUser['departmentName'] = department.name;
    }
    if (req.file) {
      const imageURL = await storeImage(
       path.join(process.env.CDN_LOCAL_PATH, 'uploads', 'usersProfile'),
        'uploads/usersProfile/',
        req.file
      );
      editUser['profileImg'] = imageURL;
    }

    if (Object.keys(editUser).length === 0) {
      return responseHandler.handleErrorResponse(res, 404, 'Cannot update, no fields given');
    }

    const updatedUser = await Users.findOneAndUpdate({ _id }, editUser);
    if (updatedUser) return responseHandler.handleSuccessResponse(res, 'User edited successfully');

  } catch (error) {
    console.log('error', error);
    return responseHandler.handleException(res, { message: 'Unable to edit user' });
  }
};

module.exports = editUser;
