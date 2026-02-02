const mongoose = require('mongoose');
const Groups = mongoose.model('Groups');
const Devices = mongoose.model('Devices');
const Channels = mongoose.model('Channels');
const Playlists = mongoose.model('Playlists');
const AssignedPlaylists=mongoose.model('AssignedPlaylists')
const fs = require('fs').promises;
const cheerio = require('cheerio');

const responseHandler = require('@helpers/responseHandler');
const {isFilePathValid,createFileFromTemplate}=require('@helpers/utils')
/**
 * @swagger
 * /api/common/groups/edit/{id}:
 *   put:
 *     summary: Edit an existing group
 *     description: Update the details of a group, including its name, department, hosts, channels, description, and playlists. Playlist URLs on associated hosts and channels will be updated accordingly.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID to update
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
 *               departmentId:
 *                 type: string
 *                 description: Department ID the group belongs to
 *               hosts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of host IDs
 *               channels:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of channel IDs
 *               description:
 *                 type: string
 *                 description: Description of the group
 *               playlistId:
 *                 type: string
 *                 description: Primary playlist ID
 *               stackedPlaylistId:
 *                 type: string
 *                 description: Stacked playlist ID
 *     responses:
 *       200:
 *         description: Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request data (duplicate name or invalid device/channel IDs)
 *       403:
 *         description: User not authorized to update this group
 *       404:
 *         description: Group or playlist not found
 *       500:
 *         description: Internal server error
 */

// Edit an existing group
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentId, hosts, channels, description, playlistId, stackedPlaylistId } = req.body;
    const user = req.user;

    // Check if the group exists
    const existingGroup = await Groups.findById(id);
    if (!existingGroup) {
      return responseHandler.handleErrorResponse(res, 404, 'Group not found');
    }

    // Validate hosts
    if (hosts) {
      const invalidDeviceIds = await Promise.all(hosts.map(async (deviceId) => {
        const device = await Devices.findById(deviceId);
        return !device;
      }));
      if (invalidDeviceIds.includes(true)) {
        return responseHandler.handleErrorResponse(res, 400, 'Invalid device IDs in the group');
      }
    }

    // Validate channels
    if (channels) {
      const invalidChannelIds = await Promise.all(channels.map(async (channelId) => {
        const channel = await Channels.findById(channelId);
        return !channel;
      }));
      if (invalidChannelIds.includes(true)) {
        return responseHandler.handleErrorResponse(res, 400, 'Invalid channel IDs in the group');
      }
    }

    // Check for duplicate group name
    if (name && existingGroup.name !== name) {
      const checkGroupExist = await Groups.findOne({ name });
      if (checkGroupExist) {
        return responseHandler.handleErrorResponse(res, 400, 'Duplicate group name');
      }
    }

    // Update basic group details
    existingGroup.name = name || existingGroup.name;
    existingGroup.hosts = hosts || existingGroup.hosts;
    existingGroup.channels = channels || existingGroup.channels;
    existingGroup.department = departmentId || user.departmentId._id;
    existingGroup.description = description || existingGroup.description;

    // Remove any previous assigned playlists
    await AssignedPlaylists.deleteMany({ group: existingGroup._id });

    let playlist = null;
    let sPlaylist = null;

    if (playlistId) {
      playlist = await Playlists.findById(playlistId);
      if (!playlist) return responseHandler.handleErrorResponse(res, 404, "Playlist not found");
      existingGroup.playlistId = playlist._id;
      existingGroup.playlistUrl = playlist.playlistUrl;
    } else {
      existingGroup.playlistId = null;
      existingGroup.playlistUrl = null;
    }

    if (stackedPlaylistId) {
      sPlaylist = await Playlists.findById(stackedPlaylistId);
      if (!sPlaylist) return responseHandler.handleErrorResponse(res, 404, "Playlist not found");
      existingGroup.stackedPlaylistId = sPlaylist._id;
      existingGroup.stackedPlaylistUrl = sPlaylist.playlistUrl;
    } else {
      existingGroup.stackedPlaylistId = null;
      existingGroup.stackedPlaylistUrl = null;
    }

    // Assign playlist to group and filter hosts/channels
    if (playlist || sPlaylist) {
      const { filterchannels, filterhosts } = await assignPlaylistToGroup(existingGroup, playlist, sPlaylist);
      existingGroup.hosts = filterhosts;
      existingGroup.channels = filterchannels;
    }

    await existingGroup.save();

    // Update hosts
    await Devices.updateMany(
      { _id: { $in: existingGroup.hosts } },
      {
        playlistUrl: playlist ? playlist.playlistUrl : null,
        stackedPlaylistUrl: sPlaylist ? sPlaylist.playlistUrl : null,
        stackedPlaylistId: sPlaylist ? sPlaylist._id : null,
        groupId: existingGroup._id
      }
    );

    // Update channels
    await Channels.updateMany(
      { _id: { $in: existingGroup.channels } },
      {
        playlistUrl: playlist ? playlist.playlistUrl : null,
        stackedPlaylistUrl: sPlaylist ? sPlaylist.playlistUrl : null,
        stackedPlaylistId: sPlaylist ? sPlaylist._id : null,
        groupId: existingGroup._id
      }
    );

    // Create assigned playlist records
    const assignedObjs = [];
    if (playlist) assignedObjs.push({ playlist: playlist._id, group: existingGroup._id, assignedBy: user.id });
    if (sPlaylist) assignedObjs.push({ playlist: sPlaylist._id, group: existingGroup._id, assignedBy: user.id });
    if (assignedObjs.length > 0) await AssignedPlaylists.insertMany(assignedObjs);

    return responseHandler.handleSuccessResponse(res, 'Group updated successfully');
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res, 500, 'Internal Server Error');
  }
};

const assignPlaylistToGroup=async (group,playlist,stackedPlaylist=null)=>{
    const hosts=await Devices.find({_id:{$in:group.hosts}})
    const channels=await Channels.find({_id:{$in:group.channels}})
    const updateHostPromises = hosts.map(async (host) => {
    const folderPath = `${process.env.CDN_CONTAINER_PATH}hostnames/${host.name}`;
    const filePath = `${folderPath}/index.html`;
    const checkFilePath=await isFilePathValid(filePath)
    await createFileFromTemplate(host.name,folderPath, playlist.playlistUrl,stackedPlaylist?.playlistUrl);
    return host._id
    
    });

    // Update files on channels with the playlist URL
    const updateChannelPromises = channels.map(async (channel) => {
    const folderPath = `${process.env.CDN_CONTAINER_PATH}channels/${channel.name}`;
    const filePath = `${folderPath}/index.html`;
    const checkFilePath=await isFilePathValid(filePath)
     await createFileFromTemplate(channel.name,folderPath, playlist.playlistUrl,stackedPlaylist?.playlistUrl);
     return channel._id
  
    });

    const updatedchannels=await Promise.all(updateChannelPromises);
    const updatedhosts=await Promise.all(updateHostPromises);
    const filterchannels=updatedchannels.filter(i=>i)
    const filterhosts=updatedhosts.filter(i=>i)
    return {filterchannels,filterhosts}
}
