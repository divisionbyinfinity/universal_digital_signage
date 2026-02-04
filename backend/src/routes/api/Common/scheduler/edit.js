const mongoose = require('mongoose');
const Schedulers = mongoose.model('Schedulers');
const Devices = mongoose.model('Devices');
const responseHandler=require('@helpers/responseHandler');
const Playlists=mongoose.model('Playlists')
const Channels=mongoose.model('Channels')
const cheerio = require('cheerio');
const Groups=mongoose.model('Groups')
const fs = require('fs');
const {createFileFromTemplate} = require('@helpers/utils');

/**
 * @swagger
 * /api/schedulers/edit/{id}:
 *   put:
 *     summary: Update an existing scheduler
 *     description: Updates a scheduler and reassigns playlists to devices, channels, or groups.
 *     tags:
 *       - Schedulers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Scheduler ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Morning Schedule
 *               description:
 *                 type: string
 *                 example: Plays morning playlist on lobby screens
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly, custom]
 *                 example: daily
 *               startTime:
 *                 type: string
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 example: "12:00"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-05"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-30"
 *               playlistId:
 *                 type: string
 *                 description: Playlist ID to assign
 *                 example: 64f73428b09a2300a7c99f1e
 *               deviceId:
 *                 type: string
 *                 description: Device (Host) ID to assign
 *                 example: 64f72d44b09a2300a7c99d1f
 *               channelId:
 *                 type: string
 *                 description: Channel ID to assign
 *                 example: 64f72d64b09a2300a7c99d2a
 *               groupId:
 *                 type: string
 *                 description: Group ID to assign
 *                 example: 64f72d84b09a2300a7c99d3b
 *               departmentId:
 *                 type: string
 *                 description: Department ID
 *                 example: 64f72d94b09a2300a7c99d4c
 *     responses:
 *       200:
 *         description: Scheduler updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Scheduler updated successfully
 *       404:
 *         description: Resource not found (Scheduler/Playlist/Host/Channel/Group missing)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Playlist not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unexpected error occurred
 */


const addScheduleToHost=async (deviceId,scheduleObjs,hostObj,schedulerId)=>{
      const filePath = path.join(process.env.CDN_LOCAL_PATH,'hostnames',hostObj.name);
      const existingSchedules=await Schedulers.find({device:deviceId, _id: { $ne: schedulerId }}).populate([{
        path:'playlistId',
        select :'playlistUrl'}])
      const status=await updateFile(hostObj.name,filePath,existingSchedules,hostObj.playlistUrl,hostObj.stackedUrl,scheduleObjs)
      if (status===false){
        return false
      }
      return true
}
const addScheduleToChannel=async (channelId,scheduleObjs,channelObj,schedulerId)=>{
      const filePath = path.join(process.env.CDN_LOCAL_PATH,'channels',channelObj.name);
      const existingSchedules=await Schedulers.find({channel:channelId,_id: { $ne: schedulerId }}).populate([{
        path:'playlistId',
        select :'playlistUrl'}])
      const status=await updateFile(channelObj.name,filePath,existingSchedules,channelObj.playlistUrl,channelObj.stackedUrl,scheduleObjs)
      if (status===false){
        return false
      }
      return true
}
const assignPlaylistToGroup=async (group,scheduleObjs,schedulerId)=>{
    const hosts=await Devices.find({_id:{$in:group.hosts}})
    const channels=await Channels.find({_id:{$in:group.channels}})
    const updateHostPromises = hosts.map(async (host) => {
      await addScheduleToHost(host._id,scheduleObjs,host,schedulerId)
    });
    const updateChannelPromises = channels.map(async (channel) => {
      await addScheduleToChannel(channel._id,scheduleObjs,channel,schedulerId)
    });
    await Promise.all(updateHostPromises)
    await Promise.all(updateChannelPromises)
    return true
}



const handleRemoveHostSchedule=async (existingHost,schedulerId,hostObj)=>{
    const updatedschedules = await Schedulers.find({
        _id: { $ne: schedulerId }, // $ne is "not equal" operator
        device: existingHost // $in for matching against an array
      });
      if(updatedschedules){
        return await addScheduleToHost(existingHost,updatedschedules,hostObj)
      }
      return true
    }
  
const handleRemoveChannelSchedule=async (existingChannel,schedulerId,channelObj)=>{
    const updatedschedules = await Schedulers.find({
        _id: { $ne: schedulerId }, // $ne is "not equal" operator
        channel:  existingChannel  // $in for matching against an array
        });
        if(updatedschedules){
        return await addScheduleToChannel(existingChannel,updatedschedules,channelObj,schedulerId)
        }
        return true
}
const handleRemoveGroupSchedule=async (groupId,group,schedulerId)=>{
  // find all the schdulers of existing group and update the schedules remove the current schedule
  //update the group only schedules other than the current schedule

    const updatedschedules = await Schedulers.find({
        _id: { $ne: schedulerId }, // $ne is "not equal" operator
        group:  groupId  // $in for matching against an array
        });
        if(updatedschedules){
        return await assignPlaylistToGroup(group,updatedschedules,schedulerId)
        }
        return true
}
module.exports = async (req, res) => {
  try {
    const schedulerId = req.params.id;
    const userId = req.user.id;
    const ExistingSchedule = await Schedulers.findById(schedulerId);
    const {name,frequency,startTime,endTime,startDate,endDate,description,playlistId,deviceId,groupId,channelId,departmentId}=req.body
    let playlist = null;

    if (!ExistingSchedule) {
      return responseHandler.handleErrorResponse(res, 404, "Schedule object does not exist");
    }

    // Check if startDate and endDate are provided and convert them to Date objects
    const updatedStartDate = startDate || ExistingSchedule.startDate;
    const updatedEndDate = endDate || ExistingSchedule.endDate;
    const startDateObj = updatedStartDate ? new Date(updatedStartDate) : undefined;
    const endDateObj = updatedEndDate ? new Date(updatedEndDate) : undefined;

    // Format dates as strings in the desired format
    const formattedStartDate = startDateObj ? startDateObj.toISOString().split('T')[0] : undefined;
    const formattedEndDate = endDateObj ? endDateObj.toISOString().split('T')[0] : undefined;

    

    ExistingSchedule.startDate = formattedStartDate;
    ExistingSchedule.endDate = formattedEndDate;
    ExistingSchedule.frequency = frequency || ExistingSchedule.frequency;
    ExistingSchedule.startTime = startTime || ExistingSchedule.startTime;
    ExistingSchedule.endTime = endTime || ExistingSchedule.endTime;
    ExistingSchedule.name=name || ExistingSchedule.name
    ExistingSchedule.description=description || ExistingSchedule.description
    ExistingSchedule.department=departmentId || ExistingSchedule.department
    

    if (playlistId) {
      playlist = await Playlists.findById(playlistId);

      if (!playlist) {
        return responseHandler.handleErrorResponse(res, 404, 'Playlist not found');
      }
    }

    const scheduleObj = {
      startTime: startTime || ExistingSchedule.startTime,
      endTime: endTime || ExistingSchedule.endTime,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      frequency: frequency || ExistingSchedule.frequency,
      playlistUrl: playlist ? playlist.playlistUrl : ExistingSchedule,
      name:name || ExistingSchedule.name
    };


    if (deviceId && (ExistingSchedule.device !== deviceId || playlistId !== ExistingSchedule.playlistId)) {
      const host = await Devices.findById(deviceId);

      if (!host) {
        return responseHandler.handleErrorResponse(res, 404, 'Host not found');
      }

      if (deviceId && ExistingSchedule.device !== deviceId) {
        await handleRemoveHostSchedule(ExistingSchedule.device, schedulerId, host);
      }

      await addScheduleToHost(deviceId, [scheduleObj], host,schedulerId);
      ExistingSchedule.device = deviceId;
    }


    if (channelId && (ExistingSchedule.channel !== channelId || playlistId !== ExistingSchedule.playlistId)) {
      const channel = await Channels.findById(channelId);

      if (!channel) {
        return responseHandler.handleErrorResponse(res, 404, 'Channel not found');
      }

      if (channelId && ExistingSchedule.channel !== channelId) {
        await handleRemoveChannelSchedule(ExistingSchedule.channel, schedulerId, channel);
      }

      await addScheduleToChannel(channelId, [scheduleObj], channel,schedulerId);
      ExistingSchedule.channel = channelId;
    }
    if (groupId && (ExistingSchedule.group !== groupId || playlistId !== ExistingSchedule.playlistId)) {
      const group = await Groups.findById(groupId);

      if (!group) {
        return responseHandler.handleErrorResponse(res, 404, 'Group not found');
      }

      if (groupId && ExistingSchedule.group !== groupId) {
        await handleRemoveGroupSchedule(ExistingSchedule.group,group, schedulerId);
      }

      await assignPlaylistToGroup(group, [scheduleObj] , schedulerId);
      ExistingSchedule.group = groupId;
    }
        

    if (playlist) {
      ExistingSchedule.playlistId = req.body.playlistId;
    }

    await ExistingSchedule.save();

    return responseHandler.handleSuccessCreated(res, 'Scheduler updated successfully');
  } catch (error) {
    console.log("err-----", error);
    return responseHandler.handleErrorResponse(res, 500, error.message);
  }
};

const updateFile=async (name,filePath,existingSchedules,assignedPlaylist,stackedUrl,scheduleObjs=[])=>{
  const hostURL=process.env.CDN_URL
  const default_playlist=assignedPlaylist?assignedPlaylist:`${hostURL}playlist/INITILIZE/`
  let schedulearray=existingSchedules.map(schedule=>{
    return {
      "startTime":schedule.startTime,
      "endTime":schedule.endTime,
      "frequency":schedule.frequency,
      "playlistUrl":schedule.playlistId.playlistUrl
  }
  })
  schedulearray=[...scheduleObjs,...schedulearray]
  
  // Create a dynamic script tag with your desired content or attributes
  await createFileFromTemplate(name,filePath, default_playlist,stackedUrl,schedulearray);
  
}
