const mongoose = require('mongoose');
const Groups = mongoose.model('Groups');
const Devices = mongoose.model('Devices');
const Channels = mongoose.model('Channels');
const Playlists = mongoose.model('Playlists');
const AssignedPlaylists=mongoose.model('AssignedPlaylists')

const responseHandler=require('@helpers/responseHandler');
const fs = require('fs').promises;
const cheerio = require('cheerio');

/**
 * @swagger
 * /api/common/groups/create:
 *   post:
 *     summary: Create a new group
 *     description: Creates a new group with optional hosts, channels, playlist, and stacked playlist. Updates HTML files of hosts and channels with the playlist URLs.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the group
 *               description:
 *                 type: string
 *                 description: Description of the group
 *               departmentId:
 *                 type: string
 *                 description: Department ID the group belongs to
 *               hosts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of host IDs to include in the group
 *               channels:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of channel IDs to include in the group
 *               playlistId:
 *                 type: string
 *                 description: Playlist ID to assign to the group
 *               stackedPlaylistId:
 *                 type: string
 *                 description: Stacked playlist ID to assign to the group
 *     responses:
 *       200:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request or missing required fields
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Internal server error
 */

// Create a new group
module.exports = async (req, res) => {
  try {
    // Check if the group name already exists
    const {hosts,channels,departmentId,name,playlistId,stackedPlaylistId,description}=req.body
    const existingGroup = await Groups.findOne({ name: req.body.name });
    const user =req.user
    if (existingGroup) {
      return responseHandler.handleErrorResponse(res, 400, 'Group name already exists');
    }
    // Check if both hosts and channels are empty
    if ((!hosts || hosts.length === 0) && (!channels || channels.length === 0)) {
      return responseHandler.handleErrorResponse(res, 400, 'At least one of hosts or channels is required');
    }
    // Check if the provided device IDs are valid
    const invalidDeviceIds = hosts !== undefined ? await Promise.all(hosts.map(async (deviceId) => {
      const device = await Devices.findById(deviceId);
      return !device || device === null; // Check if device is falsy (null or undefined)
    })) : [];

    if (invalidDeviceIds.includes(true)) {
      return responseHandler.handleErrorResponse(res, 400, 'Invalid device IDs in the group');
    }
    // Check if the provided device IDs are valid
    const invalidChannelIds = channels !== undefined ? await Promise.all(channels.map(async (channelId) => {
      const channel = await Channels.findById(channelId);
      return !channel || channel === null; // Check if device is falsy (null or undefined)
    })) : [];

    if (invalidChannelIds.includes(true)) {
      return responseHandler.handleErrorResponse(res, 400, 'Invalid channel IDs in the group');
    }
    const tempGroup={}
    tempGroup.name=req.body.name
    if(hosts) {tempGroup.hosts=hosts}
    if(channels) {tempGroup.channels=channels}
    if(description) {tempGroup.description=description}
    if(departmentId) {tempGroup.department=departmentId}
    let playlist=null
    let sPlaylist=null
    if(playlistId || stackedPlaylistId){
      
      if(playlistId){
        playlist = await Playlists.findById(playlistId);
        if(!playlist) return responseHandler.handleErrorResponse(res, 404, "Playlist not found");
      }
      if(stackedPlaylistId){
        sPlaylist = await Playlists.findById(stackedPlaylistId);
        if(!sPlaylist) return responseHandler.handleErrorResponse(res, 404, "Playlist not found");
      }
      const {filterchannels,filterhosts}=await assignPlaylistToGroup(tempGroup,playlist,sPlaylist)
      if (playlistId) {
      tempGroup.playlistId=playlistId
      tempGroup.playlistUrl=playlist.playlistUrl
      }
      if (stackedPlaylistId) {
      tempGroup.stackedPlaylistId=stackedPlaylistId
      tempGroup.stackedPlaylistUrl=sPlaylist.playlistUrl
      }
      tempGroup.hosts=filterhosts;
      tempGroup.channels=filterchannels;
    }
    
    const group = new Groups(tempGroup);
    group.createdBy=user.id
    group.department=departmentId || user.departmentId._id
    await group.save();
    if(playlistId){
    // Update PlaylistUrl and groupId on hosts
    await Devices.updateMany({ _id: { $in: tempGroup.hosts } }, { playlistUrl: playlist.playlistUrl, groupId: group._id ,stackedPlaylistUrl: sPlaylist ? sPlaylist.playlistUrl : null, stackedPlaylistId: sPlaylist ? sPlaylist._id : null });
    // Update Playlist on channels
    await Channels.updateMany({ _id: { $in: tempGroup.channels } }, { playlistUrl: playlist.playlistUrl,groupId:group._id,stackedPlaylistUrl: sPlaylist ? sPlaylist.playlistUrl : null, stackedPlaylistId: sPlaylist ? sPlaylist._id : null });
    }
    const assignedPlaylist = new AssignedPlaylists({
      group: group._id,
      playlist: playlistId,
      assignedBy: user.id,
    });
    await assignedPlaylist.save();

 
    return responseHandler.handleSuccessResponse(res, 'Groups Created successfully');
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res, 500, 'Internal Server Error');
  }
};


const assignPlaylistToGroup=async (group,playlist,stackedPlaylist=null)=>{
    const hosts=await Devices.find({_id:{$in:group.hosts}})
    const channels=await Channels.find({_id:{$in:group.channels}})
    const updateHostPromises = hosts.map(async (host) => {
    const filePath = `${process.env.CDN_CONTAINER_PATH}hostnames/${host.name}/index.html`;
      try {
        const data = await fs.readFile(filePath, 'utf8');
        const $ = cheerio.load(data);
        $('script').each((_, element) => {
          let content = $(element).html();
          // Replace defaultPlaylist
          if (content.includes('var defaultPlaylist =')) {
            content = content.replace(
              /var\s+defaultPlaylist\s*=\s*'[^']*'/,
              `var defaultPlaylist = '${playlist.playlistUrl}'`
            );
          }
          // Replace stackedPlaylist if defined
          if (stackedPlaylist && content.includes('var stackedPlaylist =')) {
            content = content.replace(
              /var\s+stackedPlaylist\s*=\s*'[^']*'/,
              `var stackedPlaylist = '${stackedPlaylist.playlistUrl}'`
            );
          }
        
          $(element).html(content);
        });
        await fs.writeFile(filePath, $.html());
        return host._id;
    } catch (error) {
        console.error('An error occurred while processing HTML files for host:', host._id, error);
        return ;
    }
    });

    // Update files on channels with the playlist URL
    const updateChannelPromises = channels.map(async (channel) => {
    const filePath = `${process.env.CDN_CONTAINER_PATH}channels/${channel.name}/index.html`;
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const $ = cheerio.load(data);
        $('#playlistFrame').attr('src', playlist.playlistUrl);
        $('script').each((index, element) => {
            const scriptContent = $(element).html();
            if (scriptContent.includes('var default_playlist=')) {
                $(element).html(scriptContent.replace(/var default_playlist='[^']+'/g, `var default_playlist='${playlist.playlistUrl}'`));
            }
            if (stackedPlaylist && scriptContent.includes('stackedPlaylistURL =')){
                $(element).html(scriptContent.replace(/stackedPlaylistURL = '[^']+'/g, `stackedPlaylistURL = '${stackedPlaylist.playlistUrl}'`));
            }
        });
        await fs.writeFile(filePath, $.html());
        return channel._id;
    } catch (error) {
        console.error('An error occurred while processing HTML files for host:', channel._id, error);
        return ;
    }
    });

    const updatedchannels=await Promise.all(updateChannelPromises);
    const updatedhosts=await Promise.all(updateHostPromises);
    const filterchannels=updatedchannels.filter(i=>i)
    const filterhosts=updatedhosts.filter(i=>i)
    return {filterchannels,filterhosts}
}
