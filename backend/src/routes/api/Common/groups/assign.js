
const responseHandler=require('@helpers/responseHandler')
const mongoose=require('mongoose')
const Devices=mongoose.model('Devices')
const Channels=mongoose.model('Channels')
const Groups=mongoose.model('Groups')
const Playlists=mongoose.model('Playlists')
const fs = require('fs').promises;
const path = require('path')

const cheerio = require('cheerio');
/**
 * @swagger
 * /api/common/groups/assign/{id}:
 *   post:
 *     summary: Assign a playlist to a group
 *     description: Updates all hosts and channels in a group with the provided playlist URL and records the assignment.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Group ID to assign the playlist to
 *         schema:
 *           type: string
 *       - in: query
 *         name: playlistId
 *         required: true
 *         description: Playlist ID to assign
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist assigned to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 playlistId:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required parameters (playlistId or id)
 *       404:
 *         description: Playlist or group not found
 *       500:
 *         description: Internal server error
 */

// POST /api/assignPlaylistToGroup
module.exports= async (req, res) => {
    try {
        const {id}=req.params
        const { playlistId} = req.query;
        if (!playlistId || !id) {
            return responseHandler.handleErrorResponse(res, 400, "playlistId and id are required");
        }
        const playlist = await Playlists.findById(playlistId);
        if (!playlist) {
            return responseHandler.handleErrorResponse(res, 404, "Playlist not found");
        }

        const group = await Groups.findById(id).populate('hosts channels');
        if (!group) {
            return responseHandler.handleErrorResponse(res, 404, "Group not found");
        }
        // Update files on hosts with the playlist URL
        const updateHostPromises = group.hosts.map(async (host) => {
            const filePath = path.join(process.env.CDN_LOCAL_PATH, 'hostnames', host.name,'index.html')
            try {
                const data = await fs.readFile(filePath, 'utf8');
                const $ = cheerio.load(data);
                $('#playlistFrame').attr('src', playlist.playlistUrl);
                $('script').each((index, element) => {
                    const scriptContent = $(element).html();
                    if (scriptContent.includes('var default_playlist=')) {
                        $(element).html(scriptContent.replace(/var default_playlist='[^']+'/g, `var default_playlist='${playlist.playlistUrl}'`));
                    }
                });
                await fs.writeFile(filePath, $.html());
                return host._id;
            } catch (error) {
                console.error('An error occurred while processing HTML files for host:', host._id, error);
                return ;
            }
        });

        // Update files on channels with the playlist URL
        const updateChannelPromises = group.channels.map(async (channel) => {
            const filePath = path.join(process.env.CDN_LOCAL_PATH, 'channels', channel.name,'index.html')
            try {
                const data = await fs.readFile(filePath, 'utf8');
                const $ = cheerio.load(data);
                $('#playlistFrame').attr('src', playlist.playlistUrl);
                $('script').each((index, element) => {
                    const scriptContent = $(element).html();
                    if (scriptContent.includes('var default_playlist=')) {
                        $(element).html(scriptContent.replace(/var default_playlist='[^']+'/g, `var default_playlist='${playlist.playlistUrl}'`));
                    }
                });
                await fs.writeFile(filePath, $.html());
                return channel._id;
            } catch (error) {
                console.error('An error occurred while processing HTML files for host:', host._id, error);
                return ;
            }
        });

        const updatedchannels=await Promise.all(updateChannelPromises);
        const updatedhosts=await Promise.all(updateHostPromises);
        const filterchannels=updatedchannels.filter(i=>i)
        
        const filterhosts=updatedhosts.filter(i=>i)
                // log the updated hosts and channels
        console.log('Updated hosts:', filterhosts);
        console.log('Updated channels:', filterchannels);
        // Update PlaylistUrl and groupId on hosts
        await Devices.updateMany({ _id: { $in: filterhosts } }, { playlistUrl: playlist.playlistUrl, groupId: id });
        // Update Playlist on channels
        await Channels.updateMany({ _id: { $in: filterchannels } }, { playlistUrl: playlist.playlistUrl,groupId:id });
    
        // Assign playlist to the group
        group.playlist = playlistId;
        await group.save();
        //update assigned playlist

        const assignedobj={
            playlist:playlistId,
            group:group._id,
            assignedBy:req.user.id
        }
        const assignedPlaylist=new AssignedPlaylists(assignedobj);
        await assignedPlaylist.save()

        return responseHandler.handleSuccessWithMessageObject(res, { id, playlistId }, "Playlist assigned to group successfully");
    } catch (error) {
        console.error('An error occurred:', error);
        responseHandler.handleErrorResponse(res, 500, "Internal Server Error");
    }
};