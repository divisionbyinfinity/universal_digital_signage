const mongoose =require('mongoose')
const Users=mongoose.model('Users')
const Departments=mongoose.model('Departments')
const {storeImage} =require('@helpers/utils')
const bcrypt = require('bcryptjs');



/**
 * @swagger
 * components:
 *   schemas:
 *     EditUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID (required for update)
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           description: Plain text password (will be hashed before saving)
 *         role:
 *           type: string
 *           enum: [admin, assetManager, standard]
 *         departmentId:
 *           type: string
 *           description: Department ID to assign user
 *         bio:
 *           type: string
 *       required:
 *         - _id
 */

/**
 * @swagger
 * /api/common/profile/edit:
 *   post:
 *     summary: Edit user details
 *     description: Update user profile information, password, department, or upload profile image.
 *     tags: [profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/EditUser'
 *               - type: object
 *                 properties:
 *                   profileImg:
 *                     type: string
 *                     format: binary
 *                     description: Profile image file
 *     responses:
 *       200:
 *         description: User edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Edited successfully
 *       401:
 *         description: User does not exist
 *       404:
 *         description: No fields provided for update
 *       500:
 *         description: Unable to edit user
 */

const responseHandler=require('@helpers/responseHandler')
const editUser=async (req,res)=>{
    const editUser={}
    try{
    const {_id,firstName,lastName,email,password,role,departmentId,bio}=req.body
    const checkUser=await Users.findOne({_id:_id})
    if(!checkUser) return  responseHandler.handleErrorResponse(res, 401, 'User does not exist')
    
    if(firstName){
        editUser['firstName']=firstName
    }
    if(lastName){
        editUser['lastName']=lastName
    }

    if(bio){
        editUser['bio']=bio
    }
    if(password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        editUser['password']=hashedPassword
    }
    if(role){
        editUser['role']=role
    }
    if(departmentId){
        const department=await Departments.findOne({_id:departmentId})
      editUser['departmentId']=department._id
      editUser['departmentName']=department.name
    }
    if(req.file){
        const imageURL=await storeImage(`${process.env.CDN_CONTAINER_PATH}uploads/usersProfile`,'uploads/usersProfile/',req.file)
        editUser['profileImg']=imageURL
      }
      if(Object.keys(editUser).length===0){
        return responseHandler.handleErrorResponse(res,404,"cannot updated, No feilds given")
      }
    const updatedUser=await Users.findOneAndUpdate({_id:_id},editUser)
    if(updatedUser) return responseHandler.handleSuccessResponse(res,'User Edited successfully')
    }
    catch (error) {
        console.error("error in edit user",error)
        return responseHandler.handleException(res,{message:'Unable to edit user'})
    }
}
module.exports=editUser