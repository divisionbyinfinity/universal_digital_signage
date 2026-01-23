const  express=require('express')
const router = express.Router()
router.post('/create',require('./create'))
router.put('/edit/:id',require('./edit'))

router.get('/',require('./get').getAll)
router.get('/min',require('./get').getMin)
router.get('/:id',require('./get').getById)

router.delete('/:id',require('./delete'))

module.exports=router