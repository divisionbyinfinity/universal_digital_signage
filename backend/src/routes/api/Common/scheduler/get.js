const mongoose =require('mongoose')
const Schedulers=mongoose.model('Schedulers')
const responseHandler=require('@helpers/responseHandler');

/**
 * @swagger
 * /api/common/schedulers/min:
 *   get:
 *     summary: Get minimal schedulers
 *     description: Returns schedulers filtered by host, group, or channel with limited fields.
 *     tags:
 *       - Schedulers
 *     parameters:
 *       - in: query
 *         name: hostId
 *         schema:
 *           type: string
 *         description: Filter by host/device ID
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *         description: Filter by group ID
 *       - in: query
 *         name: channelId
 *         schema:
 *           type: string
 *         description: Filter by channel ID
 *     responses:
 *       200:
 *         description: List of schedulers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   playlistId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       playlistUrl:
 *                         type: string
 *       404:
 *         description: No records found
 *
 * /api/common/schedulers:
 *   get:
 *     summary: Get all schedulers with pagination
 *     description: Returns all schedulers with populated references. Non-admin users are limited to their department.
 *     tags:
 *       - Schedulers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
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
 *         description: Filter by department ID
 *     responses:
 *       200:
 *         description: Paginated list of schedulers
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
 *                   playlistId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       playlistUrl:
 *                         type: string
 *                   department:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                   device:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       hostUrl:
 *                         type: string
 *                       type:
 *                         type: string
 *                   channel:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       channelUrl:
 *                         type: string
 *                   group:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       404:
 *         description: No records found
 *
 * /api/common/schedulers/{id}:
 *   get:
 *     summary: Get scheduler by ID
 *     description: Returns a single scheduler by its ID.
 *     tags:
 *       - Schedulers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Scheduler ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheduler object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 frequency:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                 endTime:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                 endDate:
 *                   type: string
 *                 playlistId:
 *                   type: string
 *                 device:
 *                   type: string
 *                 channel:
 *                   type: string
 *                 group:
 *                   type: string
 *       400:
 *         description: ID is required
 *       404:
 *         description: Record not found
 */

exports.getMin=async(req,res)=>{
    const {hostId,groupId,channelId}=req.query
    const queryObj={}
    if(hostId){
        queryObj['device']=hostId
    }
    if(groupId){
        queryObj['group']=groupId
    }
    if(channelId){
        queryObj['channel']=channelId
    }
    const schedulers=await Schedulers.find(queryObj,{department:0,createdBy:0,createdAt:0,updatedAt:0,description:0}).sort({createdAt:-1}).populate([{
        path:'playlistId',
        select :'_id name playlistUrl'}
    ])
    if(!schedulers || schedulers.length==0) return responseHandler.handleErrorResponse(res, 404, 'No reocrds Found');
    return responseHandler.handleSuccessObject(res,schedulers)

}
exports.getAll=async(req,res)=>{
    const user=req?.user;    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // default limit to 10 items per page
    const startIndex = (page - 1) * limit;
    const {departmentId}=req.query
    const queryObj={}
    if (departmentId){
        queryObj['department']=departmentId
    }
    if (!["admin", "globalAssetManager"].includes(user.role)) {
        queryObj['department']=user?.departmentId?._id
    }
    const schedulers=await Schedulers.find(queryObj)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate([{
        path:'playlistId',
        select :'_id name playlistUrl'},
        {path:'department',
        select:'_id name'},
        {path:'createdBy',
        select:'_id firstName lastName email'},
        {path:'device',
            select:'_id name hostUrl type'},
        {path:'channel',
            select:'_id name channelUrl'},
        {path:"group",
         select:"_id name description hosts channels"}])
   
            // const existingSchedules=await Schedulers.find({devices:{$in :'6567760731defc124977d00c'}}).populate([{
            //     path:'playlistId',
            //     select :'_id name playlistUrl'}])
            //   console.log("existsfsf",existingSchedules)
    if(!schedulers) return responseHandler.handleErrorResponse(res, 404, 'No reocrds Found');
    return responseHandler.handleSuccessObject(res,schedulers)

}

exports.getById=async (req,res)=>{
    const id=req.params.id
    if(!id) return responseHandler.handleErrorResponse(res, 400, 'Id is required');
    const schedule=await Schedulers.findById(id)
    if (!schedule) return responseHandler.handleErrorResponse(res,404,"record not found")
    return responseHandler.handleSuccessObject(res,schedule)

}