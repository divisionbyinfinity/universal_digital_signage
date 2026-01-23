const express=require('express');
const router=express.Router();



router.post('/kisok/create',require('./kioskCreate').create)
router.post('/kisok/edit/:id',require('./kioskCreate').edit)
router.post('/kisok/clone/:id',require('./kioskCreate').clone)



router.get('/',require('./get').getAll)
router.get('/:id',require('./get').getById)
router.put('/assign/:id',require('./assign'))
router.delete('/:id',require('./delete'))



// new PLaylist 
router.post('/create',  require('./playlistNew').createPlaylist)
router.post('/edit/:id',require('./playlistNew').EditPlaylist)
module.exports=router