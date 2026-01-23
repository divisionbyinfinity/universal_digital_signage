const mongoose = require('mongoose');
const Medias = mongoose.model('Medias');
const responseHandler = require('@helpers/responseHandler');
/**
 * @swagger
 * /api/common/gallery/tags:
 *   get:
 *     summary: Get all unique media tags
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique media tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: No tags found
 *       500:
 *         description: Failed to get tags
 */

module.exports = async (req,res)=>{
    try{
    const data=await Medias.find({}).select('tags');
    console.log(data)
    const tags=[];
    data.forEach(item=>{
        tags.push(item.tags)
    })
    const uniqueTags=[...new Set(tags)];
    if(uniqueTags.length===0){
        return responseHandler.handleErrorResponse(res,400,'No tags found')
    }
    return responseHandler.handleSuccessObject(res,uniqueTags)
    }
    catch(error){
        console.error("Error:", error);
        return responseHandler.handleErrorResponse(res, 500, 'Failed to get tags.');
    }
}
