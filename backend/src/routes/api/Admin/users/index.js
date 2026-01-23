const express=require('express');
const router =express.Router();
const mongoose=require('mongoose');
const Users=mongoose.model('Users');
const processFile=require('@middleware/processFile')
const { check } = require('express-validator');
const { validate } = require('@middleware/validator')
const responseHandler =require('@helpers/responseHandler')
const validRoles=['standard','admin','assetManager','globalAssetManager']
router.get('/',async (req,res)=>{
  const user=req.user;
    const page = parseInt(req.query.page) ;
    const limit = parseInt(req.query.limit) // default limit to 10 items per page
    const startIndex = (page - 1) * limit;
    const query={}
    if(user.role!=="admin" && user.role!=="globalAssetManager") {
    query['departmentId']=user.departmentId
    }
    const apiquery= Users.find(query,{password:0}).
    sort({createdAt:-1})
    .populate({path:'departmentId',select:'_id name description'});
    if (page && limit) {
      query.skip(startIndex).limit(limit);
  }
  const usersList = await apiquery;
    if(!usersList) return responseHandler.handleErrorResponse(res, 404, 'No reocrds Found');
    return responseHandler.handleSuccessObject(res,usersList)
});
router.post('/edit',
  (req,res,next)=>{
    const user=req.user;
    if(user.role==="globalAssetManager" || (user.role==="assetManager" && user.departmentId._id.toString()===req.body.departmentId)) {
      return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
    }
    return next()
  }
  ,processFile.processSingleFileOptionalMiddleware,require('./edit'))
router.delete('/:id',
  (req,res,next)=>{
    const user=req.user;
    if(user.role==="globalAssetManager" || (user.role==="assetManager" && user.departmentId._id.toString()===req.body.departmentId)) {
      return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
    }
    return next()
  }
  ,require('./delete'))
router.post('/register',
  (req,res,next)=>{
    const user=req.user;
    if(user.role==="globalAssetManager" || (user.role==="assetManager" && user.departmentId._id.toString()===req.body.departmentId)) {
      return responseHandler.handleErrorResponse(res,403,'You are not authorized to perform this action' );
    }
    return next()
  }
  ,processFile.processSingleFileOptionalMiddleware,
validate([
    check('firstName').notEmpty(),
    check('lastName').notEmpty(),
    check('email').notEmpty().isEmail(),
    check('password').notEmpty(),
    check('departmentId').notEmpty(),
    check('role').notEmpty()
    .isIn(validRoles).withMessage('Role must be one of: standard, assetManager, admin, globalAssetManager')
  ])
,require('./register'))
module.exports=router