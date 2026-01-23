const express=require('express')
const router=express.Router()
router.use('/devices',require('./hosts'))
router.use('/channels',require('./CChannels'))
router.use('/playlists',require('./playlists'))
router.use('/users',require('./users'))


module.exports=router