const express=require('express')
const router = express.Router()
const responseHandler = require('@helpers/responseHandler')
const processFile=require('@middleware/processFile')
router.post('/register',require('./register').hostRegister)
router.post('/register/bulk',processFile.processSingleFileMiddleware,require('./register').bulkHostRegister)
router.post('/edit',require('./register').hostEdit)

router.delete('/:id',require('./register').hostUnRegister)
router.put('/:hostId/assign',require('./assign'))

//get routes
router.get('/',require('./gethosts').getDevices)


// Catch-all route for undefined routes
router.use((req, res) => {
    // Respond with a 404 status code and a message
    return responseHandler.handleErrorResponse(res,404,'Route not found')
  });
module.exports=router