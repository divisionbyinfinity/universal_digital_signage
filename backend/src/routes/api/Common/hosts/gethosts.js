const mongoose = require("mongoose");
const Devices = mongoose.model("Devices");
const responseHandler = require("@helpers/responseHandler");

/**
 * @swagger
 * /api/common/hosts:
 *   get:
 *     summary: Get paginated list of devices
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter devices by department
 *     responses:
 *       200:
 *         description: List of devices with pagination
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal Server Error
 *
 */

exports.getDevices = async (req, res) => {
  const user = req?.user;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit); // default limit to 10 items per page
  const startIndex = (page - 1) * limit;
  const { departmentId } = req.query;
  const queryObj = {};
  if (departmentId) {
    queryObj["department"] = departmentId;
  }
  if (!["admin", "globalAssetManager"].includes(user?.role)) {
    queryObj["department"] = user?.departmentId;
  }
  const query = Devices.find(queryObj)
    .sort({ createdAt: -1 })
    .populate([
      { path: "department", select: "_id name" },
      { path: "createdBy", select: "_id firstName lastName email" },
    ]);

  if (page && limit) {
    query.skip(startIndex).limit(limit);
  }
  const data = await query;
  if (!data)
    return responseHandler.handleErrorResponse(res, 404, "No reocrds Found");
  // Calculate the total number of documents without pagination
  const totalDocuments = await Devices.countDocuments(queryObj);
  // Calculate total pages
  const totalPages = Math.ceil(totalDocuments / limit);
  const additionaldata = {
    totalPages,
    currentPage: page,
    totalItems: totalDocuments,
  };
  return responseHandler.handleSuccessObject(res, data, additionaldata);
};
