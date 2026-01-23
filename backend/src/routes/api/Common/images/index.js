const express=require('express')
const router=express.Router()
const processFile = require('@middleware/processFile');

router.get('/',
            require('./getmedia').handleMediaGet)
router.post('/uploadimages',
            processFile.processMultipleFileMiddleware,
            require('./getmedia').handleImageUpload)
router.post('/uploadvideos',
            processFile.processMultipleFileMiddleware,
            require('./getmedia').handleVideoUpload)
router.get('/tags',require('./gettags'))

router.get('/:id',require('./getmedia').handleMediaGetById)
router.put('/:id',require('./edit'))
router.delete('/:imageId',require('./delete'))
module.exports=router