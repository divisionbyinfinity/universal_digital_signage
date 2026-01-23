const express = require('express')
const {auth,adminAuth,verifyToken}=require('@middleware/jwtauth')
const responseHandler=require('@helpers/responseHandler')
const router = express.Router()
const axios = require('axios');
const cors = require('cors');
const ping = require('ping');
router.use(cors());
router.get('/ping', async (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).json({ success: false, error: 'IP address is required' });
  }

  try {
    const result = await ping.promise.probe(ip);
    res.json({ success: true, alive: result.alive });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.use('/auth', require('./Auth'))

router.get('/heartbeat', (req, res) => {
  try{
  const decode=verifyToken(req,res)
  if(decode){
      return responseHandler.handleSuccessResponse(res,  'API is working',200);
  }
  return responseHandler.handleErrorResponse(res, 401, 'Invalid Token');
  }
  catch(err){
      console.log(err)
      return responseHandler.handleErrorResponse(res, 401, 'Invalid Token');
  }
});

router.use((req, res, next) => {
    // Check if there is a bearer token in the request headers
    const token = req.header('Authorization');
  
    if (!token) {
      // Respond with a 401 status code and an error message
      return responseHandler.handleErrorResponse(res,401,'Bearer-Token is missing')
    }
  
    // If the token exists, proceed with authentication using your auth middleware
    auth()(req, res, next);
  });
router.use('/common',require('./Common'))
router.use(adminAuth)
router.use('/admin',require('./Admin'))
// Catch-all route for undefined routes
router.use((req, res) => {
    // Respond with a 404 status code and a message
    return responseHandler.handleErrorResponse(res,404,'Route not found')
  });
module.exports = router