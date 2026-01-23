const express=require('express')
const router = express.Router()
const responseHandler = require('@helpers/responseHandler')
const processFile=require('@middleware/processFile')

//get routes
router.get('/',require('./departments').getDepartments)
router.post('/create',processFile.processSingleFileOptionalMiddleware,require('./create').create)
router.post('/:id',processFile.processSingleFileOptionalMiddleware,require('./create').update)

router.delete('/:id',require('./create').delete)

// Catch-all route for undefined routes
router.use((req, res) => {
    // Respond with a 404 status code and a message
    return responseHandler.handleErrorResponse(res,404,'Route not found')
  });
module.exports=router