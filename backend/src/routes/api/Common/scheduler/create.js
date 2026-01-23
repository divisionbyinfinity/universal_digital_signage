const mongoose = require('mongoose');
const Schedulers = mongoose.model('Schedulers');
const Devices = mongoose.model('Devices');
const responseHandler=require('@helpers/responseHandler');
const Playlists=mongoose.model('Playlists')
const Channels=mongoose.model('Channels')
const cheerio = require('cheerio');
const Groups=mongoose.model('Groups')
const moment = require('moment-timezone');
const {createFileFromTemplate} = require('@helpers/utils');
const hostURL = process.env.CDN_URL;
const fs = require('fs');
// Function to check if the schedule overlaps with existing schedules

/**
 * @swagger
 * tags:
 *   name: Schedulers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateScheduler:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Unique name of the schedule
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-09-04T10:00"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2025-09-04T12:00"
 *         hostId:
 *           type: string
 *           description: Device ID to assign the schedule
 *         channelId:
 *           type: string
 *           description: Channel ID to assign the schedule
 *         groupId:
 *           type: string
 *           description: Group ID to assign the schedule
 *         playlistId:
 *           type: string
 *           description: Playlist ID to be scheduled
 *         frequency:
 *           type: string
 *           enum: [once, daily, weekly, monthly]
 *           example: daily
 *         departmentId:
 *           type: string
 *           description: Department ID responsible for schedule
 *         description:
 *           type: string
 *           description: Description of the schedule
 *       required:
 *         - name
 *         - startTime
 *         - endTime
 *         - playlistId
 */

/**
 * @swagger
 * /api/common/schedulers:
 *   post:
 *     summary: Create a new scheduler
 *     description: Create a schedule for a device, channel, or group. Ensures no overlapping schedules exist for the same entity.
 *     tags: [Schedulers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduler'
 *     responses:
 *       201:
 *         description: Scheduler created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scheduler Created Successfully
 *       400:
 *         description: Validation error (e.g., duplicate name, overlapping schedule)
 *       404:
 *         description: Device, Channel, Group, or Playlist not found
 *       500:
 *         description: Internal server error
 */

async function checkScheduleOverlap(startDate, endDate, idType, id) {
  try {
    const query = {
      [idType]: id,
      $or:[
        {
          $and: [{ startTime: { $lte: startDate } }, { endTime: { $gte: startDate } }]
        },
        {
          $and: [{ startTime: { $lte: endDate } }, { endTime: { $gte: endDate } }]
        },
        {
          $and: [{ startTime: { $gte: startDate } }, { endTime: { $lte: endDate } }]
        }
      ]
    };

    const existingSchedule = await Schedulers.findOne(query);
    return !!existingSchedule; // Returns true if overlapping schedule exists, false otherwise
  } catch (error) {
    console.error("Error checking schedule overlap:", error);
    return false; // Return false in case of any error
  }
}

module.exports = async (req, res) => {
  try {
    const { name, startTime, endTime, hostId,channelId, playlistId, frequency, departmentId,description,groupId } = req.body;
    const userId=req.user.id;
    let device=null
    const startDateObj = moment.tz(req.body.startTime, 'YYYY-MM-DDTHH:mm', 'UTC').toDate();
    const endDateObj = moment.tz(req.body.endTime, 'YYYY-MM-DDTHH:mm', 'UTC').toDate();
        const schedule={
      name,
      startTime:startDateObj,
      endTime:endDateObj,
      frequency,
      playlistId,
      department: departmentId,
      createdBy:userId,
      description,

    }
    // check if schedule name already exists
    const existingSchedule = await Schedulers.findOne({ name });
    if (existingSchedule) {
      return responseHandler.handleErrorResponse(res, 400, 'Schedule name already exists');
    }
    if(playlistId){
      playlist=await Playlists.findById(playlistId)
      if(!playlist){
      return responseHandler.handleErrorResponse(res,404,'Device not found');
      }
    }
  
    
    const scheduleObj={
      startTime,
      endTime,
      frequency,
      playlistUrl:playlist.playlistUrl
    }
    if (hostId){
      
      device = await Devices.findById(hostId);
      if (!device) {
        return responseHandler.handleErrorResponse(res,404,'Device not found');
      }
     const check = await checkScheduleOverlap(startDateObj, endDateObj, 'device', hostId);
     if (check) {
       return responseHandler.handleErrorResponse(res,400,'Schedule overlaps with existing schedule');
      }
      schedule['device']=hostId
      const filePath = `${process.env.CDN_PATH}hostnames/${device.name}`;
      const existingSchedules=await Schedulers.find({device:hostId}).populate([{
        path:'playlistId',
        select :'playlistUrl'}])
        let schedulearray=existingSchedules.map(schedule=>{
          return {
            "startTime":schedule.startTime,
            "endTime":schedule.endTime,
            "frequency":schedule.frequency,
            "playlistUrl":schedule.playlistId.playlistUrl
        }
        })
        if (scheduleObj){
        schedulearray=[scheduleObj].concat(schedulearray)
        }

        // Create a dynamic script tag with your desired content or attributes
        playlistUrl = device.playlistUrl || `${hostURL}playlist/INITILIZE/`;
        await createFileFromTemplate(device.name,filePath, playlistUrl,device.stackedUrl,schedulearray);

    }
    
    if (channelId){
      const channel=await Channels.findById(channelId)
      if(!channel) return responseHandler.handleErrorResponse(res,404,'Channel not found.')
      const check = await checkScheduleOverlap(startDateObj, endDateObj, 'channel', channelId);
      if (check) {
        return responseHandler.handleErrorResponse(res,400,'Schedule overlaps with existing schedule');
       }
      schedule['channel']=channelId
      const filePath =`${process.env.CDN_PATH}channels/${channel.name}`;
      const existingSchedules=await Schedulers.find({channel:channelId}).populate([{
        path:'playlistId',
        select :'playlistUrl'}])
      existingSchedules.push()
      let schedulearray=existingSchedules.map(schedule=>{
        return {
          "startTime":schedule.startTime,
          "endTime":schedule.endTime,
          "frequency":schedule.frequency,
          "playlistUrl":schedule.playlistId.playlistUrl
      }
      })
      if (scheduleObj){
      schedulearray=[scheduleObj].concat(schedulearray)
      }
      // Create a dynamic script tag with your desired content or attributes
      await createFileFromTemplate(channel.name,filePath, channel.playlistUrl,channel.stackedUrl,schedulearray);

    }
    if(groupId){
      const group=await Groups.findById(groupId).populate('hosts channels')
      if(!group) return responseHandler.handleErrorResponse(res,404,'Group not found.')
      const check = await checkScheduleOverlap(startDateObj, endDateObj, 'group', channelId);
      if (check) {
        return responseHandler.handleErrorResponse(res,400,'Schedule overlaps with existing schedule');
       }
      schedule['group']=groupId
      const hosts=group.hosts
      const channels=group.channels
      const updateHostPromises = hosts.map(async (host) => {
        const filePath = `${process.env.CDN_PATH}hostnames/${host.name}`;
        const existingSchedules=await Schedulers.find({device:host}).populate([{
          path:'playlistId',
          select :'playlistUrl'}])
      let schedulearray=existingSchedules.map(schedule=>{
        return {
          "startTime":schedule.startTime,
          "endTime":schedule.endTime,
          "frequency":schedule.frequency,
          "playlistUrl":schedule.playlistId.playlistUrl
      }
      })
      if (scheduleObj){
      schedulearray=[scheduleObj].concat(schedulearray)
      }
      // Create a dynamic script tag with your desired content or attributes
      await createFileFromTemplate(host.name,filePath, host.playlistUrl,host.stackedUrl,schedulearray);
      });
      const updateChannelPromises = channels.map(async (channel) => {
        const filePath = `${process.env.CDN_PATH}channels/${channel.name}`;
        const existingSchedules=await Schedulers.find({channel:channel}).populate([{
          path:'playlistId',
          select :'playlistUrl'}])
          
        let schedulearray=existingSchedules.map(schedule=>{
          return {
            "startTime":schedule.startTime,
            "endTime":schedule.endTime,
            "frequency":schedule.frequency,
            "playlistUrl":schedule.playlistId.playlistUrl
        }
        })
        if (scheduleObj){
        schedulearray=[scheduleObj].concat(schedulearray)
        }
        await createFileFromTemplate(channel.name,filePath, channel.playlistUrl,channel.stackedUrl,schedulearray);

      });
      await Promise.all(updateHostPromises)
      await Promise.all(updateChannelPromises)

    }
    
    const newSchedule = new Schedulers(schedule);
    await newSchedule.save();
    return responseHandler.handleSuccessCreated(res,'Scheduler Created Successfully')
  } catch (error) {
    console.log("err-----",error)
    return responseHandler.handleErrorResponse(res,500,error.message)
  }
};


