const mongoose =require('mongoose')
const Playlists=mongoose.model('Playlists')
const responseHandler=require('@helpers/responseHandler')
/**
 * @swagger
 * /api/common/playlists:
 *   get:
 *     summary: Get all playlists with optional filters and pagination
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by playlist name
 *       - in: query
 *         name: playlistId
 *         schema:
 *           type: string
 *         description: Filter by playlist ID
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *     responses:
 *       200:
 *         description: List of playlists with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Playlist'
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
 *         description: Server error
 */

/**
 * @swagger
 * /api/common/playlists/{id}:
 *   get:
 *     summary: Get a playlist by its ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Server error
 */

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const { name, playlistId, department } = req.query;
    const queryObj = {};

    if (name) {
      queryObj['name'] = name;
    }
    if (department) {
      queryObj['department'] = department;
    }
    if (playlistId) {
      queryObj['_id'] = playlistId;
    }

    const query = Playlists.find(queryObj)
      .sort({ createdAt: -1 })
      .populate({
        path: 'department',
        select: '_id name',
      })
      .populate('style')
      .populate({path:'slides',
        populate: 'style'
      });

    if (page && limit) {
      query.skip(startIndex).limit(limit);
    }

    const data = await query;

    if (!data) {
      return responseHandler.handleErrorResponse(res, 404, 'No records Found');
    }

    // Calculate the total number of documents without pagination
    const totalDocuments = await Playlists.countDocuments(queryObj);

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / (limit || 10));
    const additionaldata = {
      totalPages,
      currentPage: page || 1,
      totalItems: totalDocuments,
    };

    return responseHandler.handleSuccessObject(res, data, additionaldata);
  } catch (err) {
    return responseHandler.handleException(res, err);
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Playlists.findById(id)
      .populate({
        path: 'department',
        select: '_id name',
      })
      .populate('style')
      .populate({path:'slides',
        populate: 'style'
      });
    if (!data) {
      return responseHandler.handleErrorResponse(res, 404, 'No records Found');
    }

    return responseHandler.handleSuccessObject(res, data);
  } catch (err) {
    return responseHandler.handleException(res, err);
  }
};
