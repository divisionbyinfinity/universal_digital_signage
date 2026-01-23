const mongoose = require('mongoose');
const AssetGroup = mongoose.model('AssetGroups');
const Playlist = mongoose.model('Playlists');
const responseHandler = require('@helpers/responseHandler');



exports.createAssetGroup = async (req, res) => {
  try {
    
    const { name } = req.body;
    const userId=req.user.id;
    if (!name) {
      return responseHandler.handleErrorResponse(res, 400, 'Asset group name is required');
    }
    const assetGroup = new AssetGroup({ name ,createdBy:userId});
    const savedAssetGroup = await assetGroup.save();
    if (savedAssetGroup) {
      return responseHandler.handleSuccessResponse(res, 'Asset group created successfully', savedAssetGroup);
    }
  } catch (err) {
    console.error(err);
    return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
  }
};


exports.assignPlaylistToAssetGroup = async (req, res) => {
  try {
    const { assetGroupId, playlistId } = req.body;

    const assetGroup = await AssetGroup.findById(assetGroupId);
    const playlist = await Playlist.findById(playlistId);

    if (!assetGroup || !playlist) {
      return responseHandler.handleErrorResponse(res, 404, 'Asset group or playlist not found');
    }

    assetGroup.assignedPlaylist = playlistId;
    const updatedAssetGroup = await assetGroup.save();

    return responseHandler.handleSuccessResponse(res, 'Playlist assigned to asset group successfully', updatedAssetGroup);
  } catch (err) {
    console.error(err);
    return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
  }
};

exports.getAssestGroups=async (req,res)=>{
    try{
        const userId=req.user.id;
        const role=req.user.role
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // default limit to 10 items per page
        const startIndex = (page - 1) * limit;
        if(role=='admin'){
          const assetGroups=await AssetGroup.find()
          .sort({ createdAt: -1 })
          .skip(startIndex)
          .limit(limit);
          return responseHandler.handleSuccessObject(res,assetGroups);

        }
        return responseHandler.handleErrorResponse(res, 404, 'NO records Found');


        
    }catch (err) {
      console.error(err);
      return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}



