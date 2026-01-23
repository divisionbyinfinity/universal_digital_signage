const express=require('express')
const router = express.Router()
const responseHandler = require('@helpers/responseHandler')
router.post('/create',require('./create'))
router.put('/edit/:id',require('./edit'))

// router.put('/edit',require('./register').hostEdit)

router.delete('/:id',require('./delete'))
// router.put('/:hostId/assign',require('./assign'))

//get routes
router.get('/',require('./get').getGroups)
router.get('/:id',require('./get').getGroupById)
router.put('/assign/:id',require('./assign'))



// Catch-all route for undefined routes
router.use((req, res) => {
    // Respond with a 404 status code and a message
    return responseHandler.handleErrorResponse(res,404,'Route not found')
  });
module.exports=router