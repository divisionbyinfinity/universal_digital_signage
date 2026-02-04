const mongoose = require('mongoose');
const Schedulers = mongoose.model('Schedulers');
const Devices = mongoose.model('Devices');
const Channels = mongoose.model('Channels');
const AssignedPlaylists = mongoose.model('AssignedPlaylists');
const responseHandler = require('@helpers/responseHandler');
const fs = require('fs');
const cheerio = require('cheerio');
const {createFileFromTemplate,isFilePathValid}=require('@helpers/utils')
const Groups = mongoose.model('Groups');
/**
 * @swagger
 * /api/common/schedulers/{id}:
 *   delete:
 *     summary: Delete a scheduler
 *     description: >
 *       Deletes a scheduler by ID.  
 *       After deletion, regenerates the assigned device, channel, or group’s HTML file 
 *       with remaining schedules or a default playlist if no schedules remain.
 *     tags: [Schedulers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduler ID to delete
 *     responses:
 *       200:
 *         description: Scheduler deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scheduler deleted successfully
 *       404:
 *         description: Scheduler not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Schedule not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const scheduler = await Schedulers.findById(id);

    if (!scheduler) {
      return responseHandler.handleErrorResponse(res, 404, 'Schedule not found');
    }
    if (scheduler.device) {
      const device = await Devices.findById(scheduler.device);
      if (device){
        const remainingSchedlues=await Schedulers.find({device:device._id, _id:{$ne:id}}).populate([{
          path:'playlistId',
          select :'playlistUrl'}]);
     
          const default_playlist=device.playlistUrl?device.playlistUrl:`${process.env.CDN_URL}playlist/INITILIZE/`
          const stackedPlaylist=device.stackedUrl || false
          const filePath = path.join(process.env.CDN_CONTAINER_PATH,'hostnames',device.name);
          if (!remainingSchedlues || remainingSchedlues.length===0){
            await createFileFromTemplate(device.name,filePath  ,default_playlist,stackedPlaylist,null,process.env.TEMPLATE_PATH);
          }
          else{
            const data={
              name:device.name,
              filePath:filePath,
              stackedPlaylist:stackedPlaylist,
              existingSchedules:remainingSchedlues,
              assignedPlaylist:device.playlistUrl,
              scheduleObj:null
            }
            const status=await updateFile(data)
            if (status===false){
              return responseHandler.handleErrorResponse(res,500,'internal server error')
            }
          }
      }
    }
    if (scheduler.channel) {
      const channel = await Channels.findById(scheduler.channel);
      if (channel){
        const remainingSchedlues=await Schedulers.find({channel:channel._id, _id:{$ne:id}}).populate([{path:'playlistId',select :'playlistUrl'}]);
        const filePath = path.join(process.env.CDN_CONTAINER_PATH,'channels',channel.name);
        const default_playlist=channel.playlistUrl?channel.playlistUrl:`${hostURL}playlist/INITILIZE/`
        const stackedPlaylist=channel.stackedUrl || false;
        if (!remainingSchedlues || remainingSchedlues.length===0){
            await createFileFromTemplate(channel.name,filePath, default_playlist,stackedPlaylist,null,process.env.TEMPLATE_PATH);

          }
          else{
            const data={
              name:channel.name,
              filePath:filePath,
              stackedPlaylist:stackedPlaylist,
              existingSchedules:remainingSchedlues,
              assignedPlaylist:channel.playlistUrl,
              scheduleObj:null
            }
            const status=await updateFile(data)
            if (status===false){
              return responseHandler.handleErrorResponse(res,500,'internal server error')
            }
          }
      }   
    }

    if (scheduler.group) {
      const group = await Groups.findById(scheduler.group);
      if (group) {
        // Handle hosts
        await Promise.all(
          (Array.isArray(group.hosts) ? group.hosts : []).map(async (hostId) => {
            const host = await Devices.findById(hostId);
            const remainingSchedlues = await Schedulers.find({ device: host._id }).populate([{ path: 'playlistId', select: 'playlistUrl' }]);
            const filePath = path.join(process.env.CDN_CONTAINER_PATH,'hostnames',host.name);
            const default_playlist = host.playlistUrl ? host.playlistUrl : `${process.env.CDN_URL}playlist/INITILIZE/`;
            const stackedPlaylist = host.stackedUrl || false;
            if (!remainingSchedlues || remainingSchedlues.length === 0) {
              await createFileFromTemplate(host.name,filePath, default_playlist, stackedPlaylist, null, process.env.TEMPLATE_PATH);
            } else {
              const data={
                name:host.name,
                filePath:filePath,
                stackedPlaylist:stackedPlaylist,
                existingSchedules:remainingSchedlues,
                assignedPlaylist:host.playlistUrl,
                scheduleObj:null
              }
              const status = await updateFile(data);
              if (status === false) {
                return responseHandler.handleErrorResponse(res, 500, 'internal server error');
              }
            }
          })
        );

        // Handle channels
        await Promise.all(
          (Array.isArray(group.channels) ? group.channels : []).map(async (channelId) => {
            const channel = await Channels.findById(channelId);
            const remainingSchedlues = await Schedulers.find({ channel: channel._id }).populate([{ path: 'playlistId', select: 'playlistUrl' }]);
            const filePath = path.join(process.env.CDN_CONTAINER_PATH,'channels',channel.name);
            const stackedPlaylist = channel.stackedUrl || false;
            const default_playlist = channel.playlistUrl ? channel.playlistUrl : `${process.env.CDN_URL}playlist/INITILIZE/`;
            if (!remainingSchedlues || remainingSchedlues.length === 0) {
              await createFileFromTemplate(channel.name,filePath, default_playlist, stackedPlaylist, null, process.env.TEMPLATE_PATH);
            } else {
              const data={
                name:channel.name,
                filePath:filePath,
                stackedPlaylist:stackedPlaylist,
                existingSchedules:remainingSchedlues,
                assignedPlaylist:channel.playlistUrl,
                scheduleObj:null
              }
              const status = await updateFile(data);
              if (status === false) {
                return responseHandler.handleErrorResponse(res, 500, 'internal server error');
              }
            }
          })
        );
      }
    }

    const deletedScheduler = await Schedulers.findByIdAndDelete(id);
    if (!deletedScheduler) {
      return responseHandler.handleErrorResponse(res, 404, 'Scheduler not found');
    }

    return responseHandler.handleSuccessResponse(res, 'Scheduler deleted successfully');
  } catch (error) {
    console.error('Error deleting scheduler:', error);
    return responseHandler.handleErrorResponse(res, 500, 'Internal Server Error');
  }
};


const updateFile=async (data)=>{
  const hostURL=process.env.CDN_URL
  const default_playlist=data.assignedPlaylist?data.assignedPlaylist:`${hostURL}playlist/INITILIZE/`
  try{
    const tempfile = await fs.promises.readFile(`${data.filePath}/index.html`, 'utf8');

    // Load the HTML content into Cheerio
    const $ = cheerio.load(tempfile);

    let schedulearray=data.existingSchedules.map(schedule=>{
      return {
        "startTime":schedule.startTime,
        "endTime":schedule.endTime,
        "startDate":schedule.startDate,
        "endDate":schedule.endDate,
        "frequency":schedule.frequency,
        "playlistUrl":schedule.playlistId.playlistUrl
    }
    })
    if (data.scheduleObj){
    schedulearray=[data.scheduleObj].concat(schedulearray)
    }
    if (schedulearray.length===0){
      await createFileFromTemplate(data.name,filePath, data.stackedPlaylist,null,default_playlist,process.env.TEMPLATE_PATH);
      return 
    }
    else{
      await createFileFromTemplate(data.name,data.filePath, default_playlist,data.stackedPlaylist,schedulearray,process.env.TEMPLATE_PATH);
    }
    return true
  }
  catch (err) {
    console.error(err);
  return false
  }
}
