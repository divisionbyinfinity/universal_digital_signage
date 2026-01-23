const mongoose =require('mongoose')
const Channels=mongoose.model('Channels')
const responseHandler=require('@helpers/responseHandler')

/**
 * @swagger
 * /api/common/channels:
 *   get:
 *     summary: Get paginated list of channels
 *     description: Returns a paginated list of channels filtered by department and user role.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default 10)
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter channels by department ID
 *     responses:
 *       200:
 *         description: Paginated list of channels
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
 *                       name:
 *                         type: string
 *                       department:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdBy:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                 additionalData:
 *                   type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */

exports.getChannels = async (req, res) => {
  try {
    const user = req?.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const { departmentId } = req.query;

    const queryObj = {};

    // Department filter
    if (departmentId) {
      queryObj["department"] = departmentId;
    }

    // Restrict non-admins to their own department
    if (!["admin", "globalAssetManager"].includes(user?.role)) {
      queryObj["department"] = user?.departmentId;
    }

    // Fetch paginated channels
    const channels = await Channels.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate([
        { path: "department", select: "_id name" },
        { path: "createdBy", select: "_id firstName lastName email" },
      ]);

    // Always count documents for pagination
    const totalDocuments = await Channels.countDocuments(queryObj);
    const totalPages = Math.ceil(totalDocuments / limit);

    const additionalData = {
      totalPages,
      currentPage: page,
      totalItems: totalDocuments,
    };

    // ✅ Return empty array instead of 404
    return responseHandler.handleSuccessObject(res, channels, additionalData);
  } catch (err) {
    console.error("Error fetching channels:", err);
    return responseHandler.handleErrorResponse(res, 500, "Internal server error");
  }
};
