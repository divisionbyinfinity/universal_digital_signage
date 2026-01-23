const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Devices = mongoose.model("Devices");
const responseHandler = require("@helpers/responseHandler");

/**
 * @swagger
 * /api/admin/devices/{deviceId}:
 *   patch:
 *     summary: Update lock status of a device
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the device to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lock:
 *                 type: boolean
 *                 description: Lock status of the device
 *     responses:
 *       200:
 *         description: Device status updated successfully
 *       400:
 *         description: Invalid lock value
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:deviceId", async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const { lock } = req.body;
    const hostExists = await Devices.findById(deviceId);
    if (!hostExists) {
      return responseHandler.handleErrorResponse(res, 404, "Device not found");
    }
    if (
      req.user.role === "assetManager" &&
      req.user.departmentId._id != hostExists.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        403,
        "You are not authorized to perform this action"
      );
    }
    if (lock !== undefined && typeof lock === "boolean") {
      const updatedDevice = await Devices.findByIdAndUpdate(
        deviceId,
        { $set: { lock: lock } },
        { new: true }
      );

      if (updatedDevice) {
        return responseHandler.handleSuccessResponse(
          res,
          "Device status updated successfully"
        );
      } else {
        return responseHandler.handleErrorResponse(
          res,
          404,
          "Device not found"
        );
      }
    } else {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Invalid lockStatus value"
      );
    }
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(
      res,
      500,
      "Internal server error"
    );
  }
});

module.exports = router;
