const mongoose =require('mongoose')
const Devices=mongoose.model('Devices')
const Channels=mongoose.model('Channels')
const Groups=mongoose.model('Groups')
const Playlists=mongoose.model('Playlists')
const AssignedPlaylists=mongoose.model('AssignedPlaylists')
const fs = require('fs');
const cheerio = require('cheerio');
const responseHandler=require('@helpers/responseHandler')
/**
 * @swagger
 * /api/common/playlists/assign/{id}:
 *   post:
 *     summary: Assign a playlist to hosts, groups, or channels
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID to assign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hosts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of host IDs to assign the playlist to
 *               group:
 *                 type: string
 *                 description: Group ID to assign the playlist to
 *               channel:
 *                 type: string
 *                 description: Channel ID to assign the playlist to
 *     responses:
 *       200:
 *         description: Playlist assigned successfully
 *       400:
 *         description: Bad request (missing playlistId or targets)
 *       404:
 *         description: Playlist, host, or group not found
 *       500:
 *         description: Internal server error
 */

module.exports=async (req,res)=>{
    const playlistId=req.params.id
    const hosts=req.body.hosts
    const group=req.body.group
    const channel=req.body.channel
    const userId=req.user.id

    if (playlistId==undefined || playlistId.length==0) return responseHandler.handleErrorResponse(res,400,"playlistId is required");
    if ((hosts==undefined || hosts.length==0) && (channel==undefined || channel.length==0) && (group==undefined || group.length===0)) return responseHandler.handleErrorResponse(res,400,"hosts or  group is required");
    const playlist=await Playlists.findOne({_id:playlistId})
    if(!playlist) return responseHandler.handleErrorResponse(res,404,"playlist not found");
    try {
    if (hosts) {
       
            const hostexists = await Devices.find({ _id: { $in: hosts } });    
            if (hostexists.length === 0) {
                return responseHandler.handleErrorResponse(res, 404, "Host does not exist.");
            }
            const updatedhosts = await Promise.all(hostexists.map(async (host) => {
                const filePath = `${process.env.CDN_PATH}hostnames/${host.name}/index.html`;
                try {
                    const data = await fs.promises.readFile(filePath, 'utf8');
                    const $ = cheerio.load(data);
                    $('#playlistFrame').attr('src', playlist.playlistUrl);
                    $('script').each((index, element) => {
                        const scriptContent = $(element).html();
                        if (scriptContent.includes('var default_playlist=')) {
                            $(element).html(scriptContent.replace(/var default_playlist='[^']+'/g, `var default_playlist='${playlist.playlistUrl}'`));
                        }
                    });
                    await fs.promises.writeFile(filePath, $.html());
                    return host._id;
                } catch (error) {
                    console.error('An error occurred while processing HTML files for host:', host._id, error);
                    return ;
                }
            }));
            const filterhosts=updatedhosts.filter(item=>{if(item) return item})
            if(!filterhosts) return responseHandler.handleErrorResponse(res,500,"Cannot assign hosts to the playlist.")
           await Promise.all( filterhosts.map(async host=>{
                await Devices.findOneAndUpdate({_id:host,playlistUrl:playlist.playlistUrl})
            }))
            await Promise.all(filterhosts.map(async host=>{
                const assignedobj={
                    playlist:playlistId,
                    item:host,
                    assignedBy:userId
                }
                const assignedPlaylist=new AssignedPlaylists(assignedobj);
                await assignedPlaylist.save()
            })) 
            
            
            return responseHandler.handleSuccessResponse(res,"successfully assigned hosts to the playlist")
        
    }
    if(group){
        const status=await assignGroup(group,playlist,req.user.id)
        if(status){
         return responseHandler.handleSuccessResponse(res,"successfully assigned group to the playlist")
        }
        else{
         return responseHandler.handleErrorResponse(res,500,"Cannot assign group to the playlist.")
        }

     }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    
}
const assignGroup= async (id,playlist,user) => {
    try {
        const group = await Groups.findById(id).populate('hosts channels');
        if (!group) {
            return responseHandler.handleErrorResponse(res, 404, "Group not found");
        }
        // Update files on hosts with the playlist URL
        const updateHostPromises = group.hosts.map(async (host) => {
            const filePath = `${process.env.CDN_URL}hostnames/${host.name}/index.html`;
            try {
                const data = await fs.promises.readFile(filePath, 'utf8');
                const $ = cheerio.load(data);
                $('#playlistFrame').attr('src', playlist.playlistUrl);
                $('script').each((index, element) => {
                    const scriptContent = $(element).html();
                    if (scriptContent.includes('var default_playlist=')) {
                        $(element).html(scriptContent.replace(/var default_playlist='[^']+'/g, `var default_playlist='${playlist.playlistUrl}'`));
                    }
                });
                await fs.promises.writeFile(filePath, $.html());
                return host._id;
            } catch (error) {
                console.error('An error occurred while processing HTML files for host:', host._id, error);
                return ;
            }
        });

        // Update files on channels with the playlist URL
        const updateChannelPromises = group.channels.map(async (channel) => {
            const filePath = `${process.env.CDN_URL}channels/${channel.name}/index.html`;
            try {
                const data = await fs.promises.readFile(filePath, 'utf8');
                const $ = cheerio.load(data);
                $('#playlistFrame').attr('src', playlist.playlistUrl);
                $('script').each((index, element) => {
                    const scriptContent = $(element).html();
                    if (scriptContent.includes('var default_playlist=')) {
                        $(element).html(scriptContent.replace(/var default_playlist='[^']+'/g, `var default_playlist='${playlist.playlistUrl}'`));
                    }
                });
                await fs.promises.writeFile(filePath, $.html());
                return channel._id;
            } catch (error) {
                console.log(error)
                console.error('An error occurred while processing HTML files for host:', host._id, error);
                return ;
            }
        });
        const updatedchannels=await Promise.all(updateChannelPromises);
        const updatedhosts=await Promise.all(updateHostPromises);
        const filterchannels=updatedchannels.filter(i=>i)
        const filterhosts=updatedhosts.filter(i=>i)
        // Update PlaylistUrl and groupId on hosts
        await Devices.updateMany({ _id: { $in: filterhosts } }, { playlistUrl: playlist.playlistUrl,playlistId:playlist._id, groupId: id });
        // Update Playlist on channels
        await Channels.updateMany({ _id: { $in: filterchannels } }, { playlistUrl: playlist.playlistUrl,playlistId:playlist._id,groupId:id });
    
        // Assign playlist to the group
        group.playlist = playlist._id;
        await group.save();
        //update assigned playlist

        const assignedobj={
            playlist:playlist._id,
            group:group._id,
            assignedBy:user
        }
        const assignedPlaylist=new AssignedPlaylists(assignedobj);
        await assignedPlaylist.save()
        return true
    } catch (error) {
        console.error('An error occurred:', error);
        return false
    }
};