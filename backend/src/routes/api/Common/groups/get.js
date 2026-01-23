const mongoose = require('mongoose');
const Groups = mongoose.model('Groups');
const responseHandler=require('@helpers/responseHandler');
/**
 * @swagger
 * /api/common/groups:
 *   get:
 *     summary: Get a paginated list of groups
 *     description: Retrieve a list of groups with pagination, optionally filtered by department. Populates hosts, channels, department, and creator information.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of groups per page (default 10)
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Optional department ID to filter groups
 *     responses:
 *       200:
 *         description: List of groups with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdBy:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           email:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       hosts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             type:
 *                               type: string
 *                             hostUrl:
 *                               type: string
 *                       channels:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             channelUrl:
 *                               type: string
 *                       department:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/common/groups/{id}:
 *   get:
 *     summary: Get a group by ID
 *     description: Retrieve detailed information for a single group, including hosts, channels, and creator information.
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
 *         description: Group ID to fetch
 *     responses:
 *       200:
 *         description: Group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                     hosts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           type:
 *                             type: string
 *                           hostUrl:
 *                             type: string
 *                     channels:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           channelUrl:
 *                             type: string
 *                     department:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

// Create a new group
exports.getGroups=async (req, res) => {
    try {
      const user=req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // default limit to 10 items per page
        const startIndex = (page - 1) * limit;
        const {departmentId}=req.query
        const queryObj={}
        if (departmentId){
          queryObj['department']=departmentId
        }
        if(user.role!=="admin") {
          queryObj['department']=user.departmentId
        }
        const groups = await Groups.find(queryObj)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .populate([
          {path:"createdBy",select:"_id email firstName lastName"},
          {path:"hosts",select:"_id name type hostUrl"},
          {path:"channels",select:"_id name channelUrl"},
          {path:"department",select:"_id name"},
        ]);
            // Calculate the total number of documents without pagination
        const totalDocuments = await Groups.countDocuments({queryObj});
        // Calculate total pages
        const totalPages = Math.ceil(totalDocuments / limit);
        const additionaldata = {
        totalPages,
        currentPage: page,
        totalItems: totalDocuments,
        };
        return responseHandler.handleSuccessObject(res,groups,additionaldata)
      } catch (error) {
        console.error(error);
        return responseHandler.handleErrorResponse(res,500,'Internal Server Error' );
      }
};

exports.getGroupById= async (req, res) => {
    try {
      const group = await Group.findById(req.params.id).populate('hosts channels createdBy');
      if (!group) {
        return responseHandler.handleErrorResponse(res,404,'Group not found' );
      } else {
        return responseHandler.handleSuccessObject(res,group)
      }
    } catch (error) {
      console.error(error);
      return responseHandler.handleErrorResponse(res,500,'Internal Server Error' );
    }
}