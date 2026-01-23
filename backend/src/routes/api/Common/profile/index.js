const express=require('express');
const router =express.Router();
const processFile=require('@middleware/processFile')

router.post('/edit',processFile.processSingleFileOptionalMiddleware,require('./edit'))
module.exports=router