const express=require('express')
const router=express.Router()
router.post('/assign',require('./groups').assignPlaylistToAssetGroup);
router.post('/create',require('./groups').createAssetGroup);
router.get('/',require('./groups').getAssestGroups);

module.exports=router