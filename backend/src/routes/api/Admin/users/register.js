const responseHandler = require('@helpers/responseHandler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { storeImage } = require('@helpers/utils');

const Users = mongoose.model('Users');
const Departments = mongoose.model('Departments');
/**
 * @swagger
 * /api/admin/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with optional profile image upload.
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
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile image
 *     responses:
 *       200:
 *         description: User created successfully
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
 *         description: Email already exists or department invalid
 *       500:
 *         description: Internal server error
 */

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, role, departmentId, description } = req.body;

    // Run both queries in parallel
    const [emailExists, departmentExists] = await Promise.all([
      Users.findOne({ email }),
      Departments.findById(departmentId)
    ]);

    // Validate results
    if (emailExists) {
      return responseHandler.handleErrorResponse(res, 400, 'Email already exists');
    }
    if (!departmentExists) {
      return responseHandler.handleErrorResponse(res, 400, 'Department does not exist');
    }

    // Hash the password concurrently
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user object
    const userObj = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      departmentId,
      departmentName: departmentExists.name,
      bio: description || '', // Default to empty string if not provided
    };

    // Upload image only if provided
    if (req.file) {
      try {
        userObj.profileImg = await storeImage(
          `${process.env.CDN_PATH}uploads/usersProfile`,
          'uploads/usersProfile/',
          req.file
        );
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
        return responseHandler.handleErrorResponse(res, 500, 'Image upload failed');
      }
    }

    // Save user
    const user = new Users(userObj);
    await user.save();

    return responseHandler.handleSuccessResponse(res, 'User created successfully');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return responseHandler.handleErrorResponse(res, 500, error.message);
  }
}

module.exports = register;
