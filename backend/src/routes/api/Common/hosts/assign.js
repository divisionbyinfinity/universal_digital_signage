const mongoose=require('mongoose')
const Devices=mongoose.model('Devices')
const Schedulers=mongoose.model('Schedulers')

const responseHandler=require('@helpers/responseHandler');
/**
 * @swagger
 * /api/common/devices/{hostId}/assign:
 *   post:
 *     summary: Assign a schedule to a device
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hostId
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *       - in: query
 *         name: scheduleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule assigned to device successfully
 *       400:
 *         description: Schedule already assigned
 *       404:
 *         description: Device or schedule not found
 *       500:
 *         description: Internal Server Error
 */


module.exports = async (req, res) => {
  try {
    const deviceId = req.params.hostId;
    const { scheduleId } = req.query;
    const device = await Devices.findById(deviceId);
    if (!device) {
      return responseHandler.handleErrorResponse(res,404,'Device not found');
    }

    const schedule = await Schedulers.findById(scheduleId);
    if (!schedule) {
        return  responseHandler.handleErrorResponse(res,404,'Schedule not found');
    }
    // Check if the schedule is already assigned to the device
    if (device.schedules.includes(scheduleId)) {
      return responseHandler.handleErrorResponse(res, 400, 'Schedule already assigned to the device');
    }
    // Assign the schedule to the device and add the playlist
    device.schedules.push(schedule);
    schedule.devices.push(deviceId);
    await schedule.save()
    await device.save();

    return responseHandler.handleSuccessResponse(res,'Schedule assigned to device successfully')
  } catch (error) {
    return responseHandler.handleErrorResponse(res,500,error.message)
  }
};
