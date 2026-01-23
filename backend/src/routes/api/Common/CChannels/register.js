const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Groups = mongoose.model("Groups");
const Channels = mongoose.model("Channels");
const Playlists = mongoose.model("Playlists");
const AssignedPlaylists = mongoose.model("AssignedPlaylists");
const Schedulers = mongoose.model("Schedulers");
const { createFileFromTemplate, isFilePathValid } = require("@helpers/utils");
const responseHandler = require("@helpers/responseHandler");
const cheerio = require("cheerio");
const hostURL = process.env.CDN_URL;
/**
 * @swagger
 * /api/common/channels/register:
 *   post:
 *     summary: Create a new channel
 *     description: Creates a new channel with optional playlist and stacked playlist assignments.
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
 *               playlistId:
 *                 type: string
 *               stackedPlaylistId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Channel created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/common/channels/{id}:
 *   delete:
 *     summary: Delete a channel
 *     description: Deletes a channel if not assigned to a group and user has permission.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Channel ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel removed successfully
 *       400:
 *         description: Cannot delete due to permissions or group assignment
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/common/channels/assign:
 *   post:
 *     summary: Assign a playlist to multiple channels
 *     description: Assigns a playlist to channels and updates the HTML template for each channel.
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
 *               playlistId:
 *                 type: string
 *               channels:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Channels successfully assigned to the playlist
 *       400:
 *         description: Validation error
 *       404:
 *         description: Playlist or channels not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/common/channels/edit:
 *   post:
 *     summary: Edit a channel
 *     description: Update channel details including name, playlist, stacked playlist, department, and description.
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
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               playlistId:
 *                 type: string
 *               stackedPlaylistId:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Channel or playlist not found
 *       500:
 *         description: Internal server error
 */

exports.channelsRegister = async (req, res) => {
  try {
    const { name, playlistId, description,departmentId, stackedPlaylistId } =
      req.body;

    if (!name) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "name is required"
      );
    }

    const formattedChannelName = name.trim().replace(/\s+/g, "-");
    const templateFilePath = "./templates/index-template.html";
    

    // Check if channel already exists
    const channelExists = await Channels.findOne({
      name: formattedChannelName,
    });
    if (channelExists) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Channel already exists."
      );
    }

    // Playlist logic
    let playlistUrl = `${hostURL}playlist/INITILIZE`;
    let stackedUrl = "";

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

    const folderPath = `${process.env.CDN_PATH}channels/${formattedChannelName}`;
    await createFileFromTemplate(
      formattedChannelName,
      folderPath,
      playlistUrl,
      stackedUrl,
      false,
      templateFilePath
    );

    const channelObj = {
      name: formattedChannelName,
      department:["admin","globalAssetManager"].includes(req.user.role)? departmentId : req.user.departmentId,
      createdBy: req.user.id,
      channelUrl: `${hostURL}channels/${formattedChannelName}`,
      description,
      ...(playlistId && { playlistId, playlistUrl }),
      ...(stackedPlaylistId && { stackedPlaylistId, stackedUrl }),
    };

    const newChannel = new Channels(channelObj);
    const savedChannel = await newChannel.save();

    // Register assigned playlists
    const assignments = [];

    if (playlistId) {
      assignments.push(
        new AssignedPlaylists({
          playlist: playlistId,
          channel: savedChannel._id,
          assignedBy: req.user.id,
        }).save()
      );
    }

    if (stackedPlaylistId) {
      assignments.push(
        new AssignedPlaylists({
          playlist: stackedPlaylistId,
          channel: savedChannel._id,
          assignedBy: req.user.id,
        }).save()
      );
    }

    await Promise.all(assignments);

    return responseHandler.handleSuccessResponse(
      res,
      "Channel created successfully"
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating channel");
  }
};

exports.channelsUnRegister = async (req, res) => {
  try {
    console.log("Delete channel request received for ID:", req.params.id);
    const channelId = req.params.id;
    const userId = req.user.id;
    const user = req.user;
    // Validate the input
    if (!channelId) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "channelId is required"
      );
    }
    const channel = await Channels.findById(channelId);
    if (!channel) {
      return responseHandler.handleErrorResponse(res, 404, "channel not found");
    }
    // check if channel is locked
    if (channel.lock) {
      return responseHandler.handleErrorResponse(res, 403, "Channel is locked");
    }
    // Query the database for a group containing this channelId
    const assignedGroup = await Groups.findOne({
      channels: { $in: channelId },
    });
    if (assignedGroup) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Cannot delete channel as it is assigned to a group"
      );
    }
    if (
      user.role === "assetManager" &&
      user.departmentId._id != channel.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "You are not authorized to delete this channel"
      );
    } else if (user.role === "standard" && user.id != channel.createdBy) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "You are not authorized to delete this channel"
      );
    }
    // Delete the HTML template and folder associated with the name
    const folderPath = `${process.env.CDN_PATH}channels/${channel.name}`;
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true });
    }
    // Delete the channel entry from the database
    await Channels.deleteOne({ _id: channelId });
    await AssignedPlaylists.deleteMany({
      channel: channelId,
      device: { $exists: false },
      group: { $exists: false },
    });
    await AssignedPlaylists.updateMany(
      { channel: channelId },
      { channel: null }
    );
    // Respond with success message
    await Schedulers.deleteMany({ channel: channelId });
    return responseHandler.handleSuccessResponse(
      res,
      "channel removed successfully"
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

exports.assignPlaylist = async (req, res) => {
  const playlistId = req.body.playlistId;
  const channels = req.body.channels;

  if (playlistId == undefined || playlistId.length == 0)
    return responseHandler.handleErrorResponse(
      res,
      400,
      "playlistId is required"
    );
  if (channels == undefined || channels.length == 0)
    return responseHandler.handleErrorResponse(
      res,
      400,
      "channels is required"
    );
  const playlist = await Playlists.findOne({ _id: playlistId });
  if (!playlist)
    return responseHandler.handleErrorResponse(res, 404, "playlist not found");
  if (channels) {
    try {
      const channelexists = await Channels.find({ _id: { $in: channels } });
      if (channelexists.length === 0) {
        return responseHandler.handleErrorResponse(
          res,
          404,
          "channel does not exist."
        );
      }
      const updatedchannels = await Promise.all(
        channelexists.map(async (channel) => {
          const folderPath = `${process.env.CDN_PATH}channels/${channel.name}`;
          const filePath = `${folderPath}/index.html`;
          const checkFilePath = await isFilePathValid(filePath);
          if (checkFilePath) {
            await createFileFromTemplate(
              channel.name,
              folderPath,
              playlist.playlistUrl
            );
          }
          try {
            const data = await fs.promises.readFile(filePath, "utf8");
            const $ = cheerio.load(data);
            const ptag = `If you are not redirected, <a href="${playlist.playlistUrl}">click here</a>`;
            $("p").html(ptag);
            await fs.promises.writeFile(filePath, $.html());
            return channel._id;
          } catch (error) {
            console.error(
              "An error occurred while processing HTML files for channel:",
              channel._id,
              error
            );
            return;
          }
        })
      );
      const filterchannels = updatedchannels.filter((item) => {
        if (item) return item;
      });
      if (!filterchannels)
        return responseHandler.handleErrorResponse(
          res,
          500,
          "Cannot assign channels to the playlist."
        );
      const updatedplaylist = await Playlists.findByIdAndUpdate(
        { _id: playlistId },
        { $addToSet: { groups: { $each: filterchannels } } },
        { new: true }
      );
      // Update the Devices collection for each channel
      const updateDevicePromises = filterchannels.map(async (channelId) => {
        await Channels.findByIdAndUpdate(
          { _id: channelId },
          { playlistId: playlistId }
        );
      });
      await Promise.all(updateDevicePromises);
      return responseHandler.handleSuccessWithMessageObject(
        res,
        updateDevicePromises,
        "successfully assigned channels to the playlist"
      );
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
};

exports.channelEdit = async (req, res) => {
  try {
    const {
      id,
      name,
      playlistId,
      departmentId,
      description,
      stackedPlaylistId,
    } = req.body;
    const playlistFallbackUrl = `${process.env.CDN_URL}playlist/INITILIZE`;
    const folderPath = `${process.env.CDN_PATH}channels`;
    const host = `${hostURL}channels`;

    // ===== 1. Find channel =====
    const existingChannel = await Channels.findById(id);
    if (!existingChannel) {
      return responseHandler.handleErrorResponse(res, 404, "Channel not found");
    }

    // ===== 2. Update name if provided =====
    if (name) {
      const formattedName = name.trim().replace(/\s+/g, "-");
      if (formattedName !== existingChannel.name) {
        const duplicate = await Channels.findOne({ name: formattedName });
        if (duplicate) {
          return responseHandler.handleErrorResponse(res, 400, "Channel name already exists.");
        }
        existingChannel.name = formattedName;
      }
    }

    // ===== 3. Basic channel fields =====
    existingChannel.department = departmentId ?? existingChannel.department;
    existingChannel.description = description ?? existingChannel.description;
    existingChannel.playlistId = playlistId || null;
    existingChannel.channelUrl = `${host}/${existingChannel.name}`;
    existingChannel.playlistUrl = null

    // Helper → updates index.html from template
    const updatePlaylistFile = async (baseUrl, stackedUrl = "", schedules = []) => {
      await createFileFromTemplate(
        existingChannel.name,
        `${folderPath}/${existingChannel.name}`,
        baseUrl,
        stackedUrl,
        schedules
      );
    };

    // ===== 4. Playlist updates =====
    if (playlistId) {
      const playlist = await Playlists.findById(playlistId);
      if (!playlist) {
        return responseHandler.handleErrorResponse(res, 400, "Playlist does not exist.");
      }

      const filePath = `${folderPath}/${existingChannel.name}/index.html`;
      await updatePlaylistFile(existingChannel.playlistUrl || playlistFallbackUrl);

      // Modify HTML file
      const html = await fs.promises.readFile(filePath, "utf8");
      const $ = cheerio.load(html);

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
      existingChannel.playlistUrl = playlist.playlistUrl;
      await AssignedPlaylists.deleteMany({
        channel: existingChannel._id,
        device: { $exists: false },
        group: { $exists: false },
      });

      await new AssignedPlaylists({
        playlist: playlistId,
        channel: existingChannel._id,
        assignedBy: req.user.id,
      }).save();
      
    }
    else{
      // If playlist is removed explicitly, also clean assignments
  existingChannel.playlistId = null;
  existingChannel.playlistUrl = playlistFallbackUrl;
  await AssignedPlaylists.deleteMany({
    channel: existingChannel._id,
    device: { $exists: false },
    group: { $exists: false },
  });
    }

    // ===== 5. Schedule handling =====
    const schedules = await Schedulers.find({ channel: existingChannel._id })
      .populate("playlistId", "playlistUrl");

    const scheduleArray = schedules.map((s) => ({
      startTime: s.startTime,
      endTime: s.endTime,
      startDate: s.startDate,
      endDate: s.endDate,
      frequency: s.frequency,
      playlistUrl: s.playlistId?.playlistUrl,
    }));

    // ===== 6. Stacked playlist handling =====
    if (stackedPlaylistId) {
      const stackedPlaylist = await Playlists.findById(stackedPlaylistId);
      if (!stackedPlaylist) {
        return responseHandler.handleErrorResponse(res, 400, "Stacked playlist does not exist.");
      }

      existingChannel.stackedPlaylistId = stackedPlaylistId;
      existingChannel.stackedUrl = stackedPlaylist.playlistUrl;

      await updatePlaylistFile(
        existingChannel.playlistUrl || playlistFallbackUrl,
        stackedPlaylist.playlistUrl,
        scheduleArray
      );
    } else {
      // Clear stacked values
      existingChannel.stackedPlaylistId = null;
      existingChannel.stackedUrl = null;

      await updatePlaylistFile(
        existingChannel.playlistUrl || playlistFallbackUrl,
        "",
        scheduleArray
      );
    }

    // ===== 7. Save and return =====
    await existingChannel.save();
    return responseHandler.handleSuccessResponse(res, "Channel updated successfully");

  } catch (err) {
    console.error("Error in channelEdit:", err);
    return res.status(500).send("Error updating channel");
  }
};
