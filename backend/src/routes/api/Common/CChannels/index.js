const express=require('express')
const router = express.Router()
const responseHandler = require('@helpers/responseHandler')
router.post('/register',require('./register').channelsRegister)
router.delete('/:id',require('./register').channelsUnRegister)
router.post('/edit',require('./register').channelEdit)
//get routes
router.get('/',require('./getchannels').getChannels)

router.post('/assign',require('./register').assignPlaylist)

// Catch-all route for undefined routes
router.use((req, res) => {
    // Respond with a 404 status code and a message
    return responseHandler.handleErrorResponse(res,404,'Route not found')
  });
module.exports=router