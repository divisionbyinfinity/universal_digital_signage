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
   
   const departmentsWithDevices = await Departments.aggregate([
  { $match: queryObj },
  // Lookup devices
  {
    $lookup: {
      from: 'devices',
      localField: '_id',
      foreignField: 'department',
      as: 'devices',
    },
  },
  // Lookup creator for department
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdByUser',
    },
  },
  // Add email of department creator
  {
    $addFields: {
      createdBy: { $arrayElemAt: ['$createdByUser.email', 0] },
    },
  },
  // Lookup creators for devices
  {
    $lookup: {
      from: 'users',
      localField: 'devices.createdBy',
      foreignField: '_id',
      as: 'deviceCreators',
    },
  },
  // Map devices to include creator email
  {
    $addFields: {
      devices: {
        $map: {
          input: '$devices',
          as: 'device',
          in: {
            _id: '$$device._id',
            name: '$$device.name',
            type: '$$device.type',
            lock: '$$device.lock',
            schedules: '$$device.schedules',
            isTouchScreen: '$$device.isTouchScreen',
            department: '$$device.department',
            description: '$$device.description',
            hostUrl: '$$device.hostUrl',
            createdBy: {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $filter: {
                        input: '$deviceCreators',
                        cond: { $eq: ['$$this._id', '$$device.createdBy'] },
                      },
                    },
                    as: 'creator',
                    in: '$$creator.email',
                  },
                },
                0,
              ],
            },
            createdAt: '$$device.createdAt',
            updatedAt: '$$device.updatedAt',
          },
        },
      },
    },
  },
  { $sort: { createdAt: -1 } },
]);
    
      
    if(!departmentsWithDevices) return responseHandler.handleErrorResponse(res, 404, 'No records Found');
    return responseHandler.handleSuccessObject(res,departmentsWithDevices)

}