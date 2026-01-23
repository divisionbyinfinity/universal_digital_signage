const express =require('express')
const router=express.Router()
const processFile=require('@middleware/processFile')
const { check } = require('express-validator');
const { validate } = require('@middleware/validator');
router.post('/login',require('./login'))


module.exports=router