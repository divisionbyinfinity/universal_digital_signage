const mongoose =require('mongoose')
const Departments=mongoose.model('Departments')
const responseHandler=require('@helpers/responseHandler')
/**
 * @swagger
 * /api/common/departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieves departments along with associated devices and creator information. Can filter by departmentId.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         required: false
 *         description: Filter by specific department ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination (currently not used)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page (currently not used)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   profileImg:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   createdBy:
 *                     type: string
 *                   devices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         createdBy:
 *                           type: string
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */


exports.getDepartments=async(req,res)=>{
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10; // default limit to 10 items per page
    // const startIndex = (page - 1) * limit;
    const {departmentId}=req.query
    const queryObj={}
    if (departmentId){
        queryObj['_id']=departmentId
    }
   
    const departmentsWithHosts = await Departments.aggregate([
      {
        $match: queryObj,
      },
      {
        $lookup: {
          from: 'devices',
          localField: '_id',
          foreignField: 'department',
          as: 'devices', // Change 'hosts' to 'devices'
        },
      },
      {
        $unwind: { path: '$devices', preserveNullAndEmptyArrays: true }, // Preserve departments with no devices
      },
      {$lookup:{
        from:'users',
        localField:'createdBy',
        foreignField:'_id',
        as:'createdBy'
      },
    },
      {
        $lookup: {
          from: 'users',
          localField: 'devices.createdBy',
          foreignField: '_id',
          as: 'createdByUser',
        },
      },
      {
        $addFields: {
          'devices.createdBy': {
            $arrayElemAt: ['$createdByUser.email', 0],
          },
        },
      },
      {
        $addFields: {
          'createdBy': {
            $arrayElemAt: ['$createdBy.email', 0],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          profileImg:{$first:'$profileImg'},
          devices: { $push: '$devices' },
          description:{$first:'$description'},
          createdAt:{$first:'$createdAt'},
          createdBy:{$first:"$createdBy"}

        },
      },
      {
        $sort: { createdAt: -1 },
      }
    ]);
    
      
    if(!departmentsWithHosts) return responseHandler.handleErrorResponse(res, 404, 'No records Found');
    return responseHandler.handleSuccessObject(res,departmentsWithHosts)

}