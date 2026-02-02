const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Groups = mongoose.model("Groups");
const Devices = mongoose.model("Devices");
const Playlists = mongoose.model("Playlists");
const AssignedPlaylists = mongoose.model("AssignedPlaylists");
const Schedulers = mongoose.model("Schedulers");
const { createFileFromTemplate, isFilePathValid } = require("@helpers/utils");
const cheerio = require("cheerio");
const responseHandler = require("@helpers/responseHandler");
const xlsx = require("xlsx");
 const hostURL = process.env.CDN_URL;
/**
 * @swagger
 * /api/common/hosts/register:
 *   post:
 *     summary: Register a single host/device
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - isTouchScreen
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               isTouchScreen:
 *                 type: boolean
 *               type:
 *                 type: integer
 *                 enum: [1,2]
 *                 description: 1=digitalSign, 2=kioskPresentation
 *               playlistId:
 *                 type: string
 *               stackedPlaylistId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hostname registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/common/hosts/{id}:
 *   delete:
 *     summary: Unregister a host/device
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to unregister
 *     responses:
 *       200:
 *         description: Hostname unregistered successfully
 *       400:
 *         description: Cannot delete or unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/common/hosts/edit:
 *   put:
 *     summary: Edit a host/device
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               isTouchScreen:
 *                 type: boolean
 *               type:
 *                 type: integer
 *                 enum: [1,2]
 *               playlistId:
 *                 type: string
 *               stackedPlaylistId:
 *                 type: string
 *               description:
 *                 type: string
 *               departmentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hostname updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Hostname not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/common/hosts/bulk-register:
 *   post:
 *     summary: Bulk register hosts via Excel file
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with host data
 *     responses:
 *       200:
 *         description: Hosts created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */

exports.hostRegister = async (req, res) => {
  try {
    const {
      name,
      isTouchScreen,
      type,
      playlistId,
      stackedPlaylistId,
      departmentId,
      description,
    } = req.body;

    // Basic validations
    if (!name?.trim()) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "name is required"
      );
    }

    const formattedHostname = name.trim().replace(/\s+/g, "-");

    const existingDevice = await Devices.findOne({ name: formattedHostname });
    if (existingDevice) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Hostname already exists"
      );
    }

    if (typeof isTouchScreen === "undefined") {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "isTouchScreen is required"
      );
    }

    if (!type || ![1, 2].includes(Number(type))) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Device type must be either digitalSign (1) or kioskPresentation (2)"
      );
    }


    const templateFilePath = "./templates/index-template.html";
    let playlistUrl = `${hostURL}playlist/INITILIZE`;
    let stackedUrl = "";

    // Playlist (optional override)
    if (playlistId) {
      const playlist = await Playlists.findById(playlistId);
      if (!playlist) {
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Playlist does not exist."
        );
      }
      playlistUrl = playlist.playlistUrl;
    }

    // Stacked playlist (optional)
    if (stackedPlaylistId) {
      const stackedPlaylist = await Playlists.findById(stackedPlaylistId);
      if (!stackedPlaylist) {
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Stacked playlist does not exist."
        );
      }
      stackedUrl = stackedPlaylist.playlistUrl;
    }

    // Generate device folder and index.html
    const folderPath = `${process.env.CDN_CONTAINER_PATH}hostnames/${formattedHostname}`;
    await createFileFromTemplate(
      formattedHostname,
      folderPath,
      playlistUrl,
      stackedUrl,
      false,
      templateFilePath
    );

    // Device model
    const deviceObj = {
      name: formattedHostname,
      isTouchScreen,
      type,
      department:
      ["admin","globalAssetManager"].includes(req.user.role)? departmentId : req.user.departmentId,
      createdBy: req.user.id,
      hostUrl: `${hostURL}hostnames/${formattedHostname}`,
      description,
      ...(playlistId && { playlistId, playlistUrl }),
      ...(stackedPlaylistId && { stackedPlaylistId, stackedUrl }),
    };

    const device = new Devices(deviceObj);
    const savedDevice = await device.save();

    // Assigned playlist entries
    const playlistAssignments = [];

    if (playlistId) {
      playlistAssignments.push(
        new AssignedPlaylists({
          playlist: playlistId,
          device: device._id,
          assignedBy: req.user.id,
        }).save()
      );
    }

    if (stackedPlaylistId) {
      playlistAssignments.push(
        new AssignedPlaylists({
          playlist: stackedPlaylistId,
          device: device._id,
          assignedBy: req.user.id,
        }).save()
      );
    }

    await Promise.all(playlistAssignments);

    return responseHandler.handleSuccessResponse(
      res,
      "Hostname registered successfully"
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering hostname");
  }
};

exports.hostUnRegister = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    const hostId = req.params.id;
    // Validate the input
    if (!hostId) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "hostId is required"
      );
    }

    // Find the device associated with the hostname
    const device = await Devices.findById(hostId);
    if (!device) {
      return responseHandler.handleErrorResponse(res, 404, "Device not found");
    }
    if (device.lock) {
      return responseHandler.handleErrorResponse(
        res,
        403,
        "Host is locked"
      );
    }
    // Query the database for a group containing this channelId
    const assignedGroup = await Groups.findOne({ hosts: { $in: hostId } });
    if (assignedGroup) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Cannot delete host as it is assigned to a group"
      );
    }
    if (
      user.role === "assetManager" &&
      user.departmentId._id != device.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "You are not authorized to delete this device"
      );
    } else if (user.role === "standard" && user.id != device.createdBy) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "You are not authorized to delete this device"
      );
    }
    // Delete the HTML template and folder associated with the hostname
    const folderPath = `${process.env.CDN_CONTAINER_PATH}hostnames/${device.name}`;
    const filePath = `${process.env.CDN_CONTAINER_PATH}hostnames/${device.name}/index.html`;
    const checkFilePath = await isFilePathValid(filePath);
    if (checkFilePath) {
      await createFileFromTemplate(device.name, folderPath);
    }
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true });
    }
    // Delete the device entry from the database
    await Devices.findByIdAndDelete(hostId);
    await AssignedPlaylists.deleteMany({
      device: hostId,
      group: { $exists: false },
      channel: { $exists: false },
    });
    await AssignedPlaylists.updateMany({ device: hostId }, { device: null });
    // delete the schedule associated with the device
    await Schedulers.deleteMany({ device: hostId });
    // Respond with success message
    return responseHandler.handleSuccessResponse(
      res,
      "Host unregistered successfully"
    );
  } catch (err) {
    console.error(err);
    return responseHandler.handleErrorResponse(
      res,
      500,
      "Internal server error"
    );
  }
};
exports.hostEdit = async (req, res) => {
  try {
    const {
      id,
      isTouchScreen,
      type,
      playlistId,
      stackedPlaylistId,
      description,
      departmentId,
    } = req.body;
    if (req.body.name && req.body.name.trim()) {
      req.body.name = req.body.name.trim().replace(/\s+/g, "-");
    }
    const existingDevice = await Devices.findById(id);
    if (!existingDevice) {
      return responseHandler.handleErrorResponse(res, 404, "Host not found");
    }
    //check if host is locked
    if (existingDevice.lock) {
      return responseHandler.handleErrorResponse(
        res,
        403,
        "Host is locked"
      );
    }
    if (req.body.name !== existingDevice.name) {
      const checkDevice = await Devices.findOne({ name: req.body.name });
      if (checkDevice) {
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Hostname already exists"
        );
      }
      existingDevice.name = req.body.name;
    }
    // Apply basic updates
    existingDevice.isTouchScreen =
      isTouchScreen ?? existingDevice.isTouchScreen;
    existingDevice.hostUrl = `${hostURL}hostnames/${existingDevice.name}`;

    existingDevice.type = type ?? existingDevice.type;
    existingDevice.description = description ?? existingDevice.description;
    existingDevice.department =
      ["admin","globalAssetManager"].includes(req.user.role)? departmentId : req.user.departmentId;

    const folderPath = `${process.env.CDN_CONTAINER_PATH}hostnames/${existingDevice.name}`;
    const filePath = `${folderPath}/index.html`;

    const fallbackPlaylistUrl = `${process.env.CDN_URL}playlist/INITILIZE`;

    // Handle playlist
    if (!playlistId) {
      existingDevice.playlistId = null;
      existingDevice.playlistUrl = fallbackPlaylistUrl;
      await createFileFromTemplate(
        existingDevice.name,
        folderPath,
        fallbackPlaylistUrl
      );
      existingDevice.playlistId = null;
      await AssignedPlaylists.deleteMany({
        device: existingDevice._id,
        channel: { $exists: false },
        group: { $exists: false },
      });
    } else {
      const playlist = await Playlists.findById(playlistId);
      if (!playlist)
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Playlist does not exist."
        );

      existingDevice.playlistId = playlistId;
      existingDevice.playlistUrl = playlist.playlistUrl;

      await createFileFromTemplate(
        existingDevice.name,
        folderPath,
        playlist.playlistUrl
      );

      const data = await fs.promises.readFile(filePath, "utf8");
      const $ = cheerio.load(data);

      $("#playlistFrame").attr("src", playlist.playlistUrl);

      $("script").each((_, el) => {
        const content = $(el).html();
        if (content.includes("var default_playlist=")) {
          $(el).html(
            content.replace(
              /var default_playlist='[^']+'/g,
              `var default_playlist='${playlist.playlistUrl}'`
            )
          );
        }
      });

      await fs.promises.writeFile(filePath, $.html());
      await AssignedPlaylists.deleteMany({
        device: existingDevice._id,
        channel: { $exists: false },
        group: { $exists: false },
      });

      // 🔥 Add new assignment
      await new AssignedPlaylists({
        playlist: playlistId,
        device: existingDevice._id,
        assignedBy: req.user.id,
      }).save();
    }

    // Handle stacked playlist
    if (!stackedPlaylistId) {
      existingDevice.stackedPlaylistId = null;
      existingDevice.stackedUrl = null;

      const schedules = await Schedulers.find({
        device: existingDevice._id,
      }).populate("playlistId", "playlistUrl");
      const scheduleArray = schedules.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        startDate: s.startDate,
        endDate: s.endDate,
        frequency: s.frequency,
        playlistUrl: s.playlistId?.playlistUrl,
      }));

      await createFileFromTemplate(
        existingDevice.name,
        folderPath,
        existingDevice.playlistUrl || fallbackPlaylistUrl,
        "",
        scheduleArray
      );
    } else {
      const stackedPlaylist = await Playlists.findById(stackedPlaylistId);
      if (!stackedPlaylist)
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Stacked playlist does not exist."
        );

      existingDevice.stackedPlaylistId = stackedPlaylistId;
      existingDevice.stackedUrl = stackedPlaylist.playlistUrl;

      const schedules = await Schedulers.find({
        device: existingDevice._id,
      }).populate("playlistId", "playlistUrl");
      const scheduleArray = schedules.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        startDate: s.startDate,
        endDate: s.endDate,
        frequency: s.frequency,
        playlistUrl: s.playlistId?.playlistUrl,
      }));

      await createFileFromTemplate(
        existingDevice.name,
        folderPath,
        existingDevice.playlistUrl || fallbackPlaylistUrl,
        stackedPlaylist.playlistUrl,
        scheduleArray
      );
    }

    await existingDevice.save();
    return responseHandler.handleSuccessResponse(
      res,
      "Host updated successfully"
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating host");
  }
};

exports.bulkHostRegister = async (req, res) => {
 

  const fileBuffer = req.file.buffer;

  // Read the file buffer using xlsx (instead of a file path, use buffer)
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });

  // Assuming the data is in the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert worksheet to JSON
  const hostList = xlsx.utils.sheet_to_json(worksheet);
  if (hostList) {
    const status = await Promise.all(
      hostList.map(async (host) => {
        const { hostname, isTouchScreen, type, description } = host;
        const checkHostname = hostname.replace(/\s/g, "-");
        let playlistUrl = `${hostURL}playlist/INITILIZE`;
        if (!hostname)
          return responseHandler.handleErrorResponse(
            res,
            400,
            "hostname is required"
          );
        const existingDevice = await Devices.findOne({ name: checkHostname });
        if (existingDevice) {
          return;
        }
        const newhost = {};
        if (checkHostname) {
          newhost.name = checkHostname;
        }
        if (isTouchScreen !== undefined) {
          newhost.isTouchScreen = isTouchScreen;
        }
        if (type) {
          newhost.type = type == "digitalSign" ? 1 : 2;
        }
        if (description) {
          newhost.description = description;
        }
        const folderPath = `${process.env.CDN_CONTAINER_PATH}hostnames/${checkHostname}`;
        await createFileFromTemplate(
          checkHostname,
          folderPath,
          playlistUrl,
          null,
          false
        );
        newhost.hostUrl = hostURL + "hostnames/" + checkHostname;
        newhost.department = req.user.departmentId;
        newhost.createdBy = req.user.id;
        const device = new Devices(newhost);
        const savedDevice = await device.save();
      })
    );
  }

  return responseHandler.handleSuccessResponse(
    res,
    "Hosts create successfully"
  );
};
