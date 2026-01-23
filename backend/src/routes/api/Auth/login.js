const mongoose = require('mongoose')
const responseHandler = require('@helpers/responseHandler')
const Users =mongoose.model('Users')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user using email and password, returns JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 department:
 *                   type: object
 *                 profileImage:
 *                   type: string
 *                 role:
 *                   type: string
 *                 bio:
 *                   type: string
 *       400:
 *         description: Email or password missing
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

const login=async (req, res) => {
  try{
    const hostURL=process.env.CDN_URL
    const { email, password } = req.body;
    if(!email) {

      return responseHandler.handleErrorResponse(res, 400, 'Email id is required')
    }
    if(!password) {
      return responseHandler.handleErrorResponse(res, 400, 'Password is required')
    }    // Check if the username and password are valid
    const filterObj={}
    if (email){
      filterObj['email']=email
    }
    const users=await Users.find()
    Users.findOne(filterObj)
    .populate({path:'departmentId',select:'_id name description'}).then(async user=>{
        if (!user) {
          return responseHandler.handleErrorResponse(res,401,'email does not exists')
          }  
          if(user.password==null){
            return responseHandler.handleErrorResponse(res,401,'Password is not set')
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
          }
          // Create a JWT token and send it in the response
          const newuser={
            firstName:user.firstName,
            lastName:user.lastName,
            department:user.department,
            email:user.email,
            id:user._id,
            departmentId:user.departmentId,
            departmentName:user.departmentName,
            profileImg:user.profileImg?(hostURL+user.profileImg):"",
            password:password,
            role:user.role,
            bio:user.bio
          }
          const token = jwt.sign(
            { user: newuser },  // Payload
            process.env.JWT_SECRET,  // Secret key
            { 
              expiresIn: '24h',  // Expiration time
              algorithm: 'HS256'  // Algorithm
            }
          );
          let data={}
          data._id=user._id
          data.email=user.email
          data['token']=token
          data['firstName']=user.firstName
          data['lastName']=user.lastName
          data['department']=user.departmentId
          data['profileImage']=user.profileImg?`${process.env.CDN_URL}${user.profileImg}`:""
          data['password']=password
          data['role']=user.role
          data['bio']=user.bio     
          return responseHandler.handleSuccessObject(res,data)
    })
  }
  catch(err){
    return responseHandler.handleException(res,err)
  }    
  }
  module.exports=login