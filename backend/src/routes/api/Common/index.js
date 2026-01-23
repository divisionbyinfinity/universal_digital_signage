const express =require('express')
const router=express.Router()
const responseHandler=require('@helpers/responseHandler')

router.use('/hosts',require('./hosts'))
router.use('/channels',require('./CChannels'))
router.use('/profile',require('./profile'))
router.use('/departments',require('./departments'))
router.use('/gallery',require('./images'))
router.use('/schedules',require('./scheduler'))
router.use('/playlists',require('./playlists'))
router.use('/groups',require('./groups'))


// Catch-all route for undefined routes
router.use((req, res) => {
    // Respond with a 404 status code and a message
    return responseHandler.handleErrorResponse(res,404,'Route  not found')
  });
module.exports=router