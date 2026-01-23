const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const responseHandler = require('@helpers/responseHandler');
dotenv.config()
const sessionSecret = process.env.JWT_SECRET


const getTokenFromHeaders = (req) => {
  const { headers: { authorization }} = req
  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }

  return null
}
const verifyToken = (req,res) => {
  const token = getTokenFromHeaders(req)
  if (!token) {
    return responseHandler.handleErrorResponse(res, 401, 'Bearer-Token is missing');
  }
  const decode=jwt.verify(token, process.env.JWT_SECRET,{ algorithm: 'HS256'})
    return decode;
  }

function auth() {
  return async (req, res, next) => {
      try {
        const decoded=verifyToken(req,res)
        req.user=decoded.user
        return next()
      } catch (err) {
        return responseHandler.handleErrorResponse(res, 401, 'Access denied');       
      }
  }
}

function adminAuth(req,res,next){
    try {
      const decoded=verifyToken(req,res)
      req.user = decoded.user;
      if (['admin','assetManager','globalAssetManager'].includes(req.user.role)) {
        return next();
      }
      return responseHandler.handleErrorResponse(res, 401, 'Access denied');
    } catch (err) {
      return responseHandler.handleErrorResponse(res, 401, 'Access denied');
    }
}

module.exports = {
  auth,
  adminAuth,
  verifyToken
};