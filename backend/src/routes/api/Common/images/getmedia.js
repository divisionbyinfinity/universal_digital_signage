const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Medias = mongoose.model("Medias");
const Playlists = mongoose.model("Playlists");
const path = require('path')

const { storeMultipleImages, storeMultipleVideos } = require("@helpers/utils");
const responseHandler = require("@helpers/responseHandler");
/**
 * @swagger
 * /api/common/gallery/uploadimages:
 *   post:
 *     summary: Upload multiple images
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the images
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Tags missing or no files uploaded
 *       500:
 *         description: Image upload failed
 */

/**
 * @swagger
 * /api/common/gallery/uploadvideos:
 *   post:
 *     summary: Upload multiple videos
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the videos
 *               durations:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Duration of each video
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Video files to upload
 *     responses:
 *       200:
 *         description: Videos uploaded successfully
 *       400:
 *         description: Tags missing or no files uploaded
 *       500:
 *         description: Video upload failed
 */

/**
 * @swagger
 * /api/common/gallery:
 *   get:
 *     summary: Get media (images & videos) with pagination
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter media by tag
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter media by department ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Media type (1 = image, 2 = video)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of media with pagination
 *       404:
 *         description: No media found
 *       500:
 *         description: Error fetching media
 */

/**
 * @swagger
 * /api/common/gallery/{id}:
 *   get:
 *     summary: Get media by ID
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the media
 *     responses:
 *       200:
 *         description: Media found
 *       404:
 *         description: Media does not exist
 */
// **Handle Image Upload**
exports.handleImageUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const tags = req.body.tags;
    if (tags.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "Tags are required.");
    }
    if (!req.files || req.files.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "No files uploaded.");
    }
    // Store images in "imagelibrary"
    const imageURLs = await storeMultipleImages(
      path.join(process.env.CDN_LOCAL_PATH, 'imagelibrary'),
      "imagelibrary",
      req.files
    );

    if (imageURLs.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "No images uploaded.");
    }

    const mediaRecords = imageURLs.map((media) => ({
      department: req.user.departmentId,
      mediaUrl: media.url,
      size: media.size,
      name: media.name,
      mediaType: 1,
      uploadedBy: userId,
      tags: tags,
    }));

    // Save to database
    const data = await Medias.insertMany(mediaRecords);
    if (data) {
      return responseHandler.handleSuccessResponse(
        res,
        "Images uploaded successfully."
      );
    } else {
      return responseHandler.handleErrorResponse(res, 500, "Failed to create media records.");
    }
  } catch (error) {
    console.error("Error:", error);
    return responseHandler.handleErrorResponse(res, 500, "Image upload failed.");
  }
};

// **Handle Video Upload** 
exports.handleVideoUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const tags = req.body.tags;
    if (tags.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "Tags are required.");
    }
    if (!req.files || req.files.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "No videos uploaded.");
    }

    // Store videos in "videolibrary"
    const videoURLs = await storeMultipleVideos(
        path.join(process.env.CDN_LOCAL_PATH, 'videolibrary'),
      "videolibrary",
      req.files,
      req.body.durations
    );

    if (videoURLs.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "No videos uploaded.");
    }
    const mediaRecords = videoURLs.map((media) => ({

      department: req.user.departmentId,
      mediaUrl: media.url,
      size: media.size,
      name: media.name,
      mediaType: 2,
      mediaDuration:media.mediaDuration,
      uploadedBy: userId,
      tags: tags,
    }));

    // Save to database
    const data = await Medias.insertMany(mediaRecords);
    if (data) {
      return responseHandler.handleSuccessResponse(
        res,
        "Videos uploaded successfully."
      );
    } else {
      return responseHandler.handleErrorResponse(res, 500, "Failed to create media records.");
    }
  } catch (error) {
    console.error("Error:", error);
    return responseHandler.handleErrorResponse(res, 500, "Video upload failed.");
  }
};

// **Get All Media (Images + Videos)**
exports.handleMediaGet = async (req, res) => {
  try {
    const { tag, department, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const query = {};

    if (tag && tag.length > 0) {
      query.tags = { $regex: new RegExp(tag, "i") };
    }
    if (department) {
      query.department = department;
    }
    if (type) {
      query.mediaType = type; // "Image" or "Video"
    }

    // Query media from the database
    const media = await Medias.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    if (media) {
      const totalDocuments = await Medias.countDocuments(query);
      const totalPages = Math.ceil(totalDocuments / limit);
      const additionaldata = {
        totalPages,
        currentPage: page,
        totalItems: totalDocuments,
      };
      return responseHandler.handleSuccessObject(res, media, additionaldata);
    } else {
      return responseHandler.handleErrorResponse(res, 404, "No media found.");
    }
  } catch (error) {
    return responseHandler.handleErrorResponse(res, 500, "Error fetching media.");
  }
};

// **Get Media by ID**
exports.handleMediaGetById = async (req, res) => {
  const { id } = req.params;
  const media = await Medias.findById(id);
  if (!media) {
    return responseHandler.handleErrorResponse(res, 404, "Media does not exist.");
  }
  return responseHandler.handleSuccessObject(res, media);
};
