const mongoose = require("mongoose");
const Playlists = mongoose.model("Playlists");
const Medias = mongoose.model("Medias");
const Slides = mongoose.model("Slides");
const Styles = mongoose.model("Styles");
const Departments= mongoose.model("Departments")
const responseHandler = require("@helpers/responseHandler");

const fs = require("fs");
const path = require("path");
const { cssStandardNew, javascriptPartNew } = require("./playlistContents");

const getCss = (type, mycss) => {
  return cssStandardNew(mycss);
};

const getjs = (type, tempSlides, hostURL, style) => {
  return javascriptPartNew(tempSlides, hostURL, style);
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Border:
 *       type: object
 *       properties:
 *         width:
 *           type: integer
 *         color:
 *           type: string
 *         type:
 *           type: string
 *           description: solid, dashed, etc.
 *     MarginPadding:
 *       type: object
 *       properties:
 *         top:
 *           type: integer
 *         bottom:
 *           type: integer
 *         left:
 *           type: integer
 *         right:
 *           type: integer
 *     Alignment:
 *       type: object
 *       properties:
 *         horizontal:
 *           type: string
 *           enum: [left, center, right]
 *     Transition:
 *       type: object
 *       properties:
 *         delay:
 *           type: integer
 *         duration:
 *           type: integer
 *         timing:
 *           type: string
 *         type:
 *           type: string
 *     SlideStyle:
 *       type: object
 *       properties:
 *         bgColor:
 *           type: string
 *         border:
 *           $ref: '#/components/schemas/Border'
 *         color:
 *           type: string
 *         fntFam:
 *           type: string
 *         fntSize:
 *           type: integer
 *         margin:
 *           $ref: '#/components/schemas/MarginPadding'
 *         padding:
 *           $ref: '#/components/schemas/MarginPadding'
 *         widthFull:
 *           type: boolean
 *         align:
 *           $ref: '#/components/schemas/Alignment'
 *     GlobalStyle:
 *       type: object
 *       properties:
 *         bgColor:
 *           type: string
 *         padding:
 *           $ref: '#/components/schemas/MarginPadding'
 *         pageIndicator:
 *           type: object
 *           properties:
 *             bgColor:
 *               type: string
 *             borderColor:
 *               type: string
 *             borderSize:
 *               type: string
 *             isEnable:
 *               type: boolean
 *             location:
 *               type: string
 *             size:
 *               type: string
 *             type:
 *               type: string
 *         pageNumber:
 *           type: object
 *           properties:
 *             color:
 *               type: string
 *             isEnable:
 *               type: boolean
 *             size:
 *               type: string
 *         randomizeSlides:
 *           type: boolean
 *     Schedule:
 *       type: object
 *       properties:
 *         duration:
 *           type: integer
 *         sDate:
 *           type: string
 *         eDate:
 *           type: string
 *     Slide:
 *       type: object
 *       properties:
 *         media:
 *           type: string
 *           description: Media ID
 *         mediaDuration:
 *           type: integer
 *         captionT:
 *           type: string
 *         captionB:
 *           type: string
 *         schedule:
 *           $ref: '#/components/schemas/Schedule'
 *         style:
 *           $ref: '#/components/schemas/SlideStyle'
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *         - department
 *         - playlistType
 *         - slides
 *       properties:
 *         name:
 *           type: string
 *         department:
 *           type: string
 *         playlistType:
 *           type: integer
 *         style:
 *           $ref: '#/components/schemas/GlobalStyle'
 *         slides:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Slide'
 */

/**
 * @swagger
 * /api/common/playlists/create:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Playlist'
 *     responses:
 *       200:
 *         description: Playlist created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create playlist
 *
 * /api/common/playlists/edit/{id}:
 *   post:
 *     summary: Edit an existing playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Playlist'
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Failed to update playlist
 */

exports.createPlaylist = async (req, res) => {
  try {
    const hostURL = process.env.CDN_URL;
    const { name, slides, style, playlistType } = req.body;
    let department = req.user.departmentId._id
    if (['admin','globalAssetManager'].includes(req.user.role)){
      department=req.body.department
    }
    const checkDepartmentExist=await Departments.findById(department);
    if (!checkDepartmentExist) return responseHandler.handleErrorResponse(res,404,"Department does not exists")
    // check replace any space in playlist Name name with '-'
    const checkPlaylistName = name.replace(/\s/g, "-");

    // Basic validation for required fields
    if (!checkPlaylistName) {
      return res.status(400).json({ error: "Playlist name is required" });
    }

    if (!department) {
      return res.status(400).json({ error: "Department ID is required" });
    }

    const playlistExist = await Playlists.findOne({ name: checkPlaylistName });
    if (playlistExist) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "playlist already exists"
      );
    } // If all checks pass, create the playlist
    const newSlides = await Promise.all(
      slides.map(async (slide) => {
        const newslide = { ...slide };
        const media = await Medias.findById(slide.media);
        if (media) {
          newslide.media = {
            _id: media._id,
            mediaType: media.mediaType,
            mediaUrl: media.mediaUrl,
            mediaDuration: media.mediaDuration || 8000,
          };
          return newslide;
        }
        return null;
      })
    );
    const playlistData = {
      name: checkPlaylistName,
      department,
      slides: newSlides,
      type: playlistType,
      style: style,
      createdBy: req.user.id,
    };
    const tempSlides = newSlides.map((item) => {
      return {
        ...item,
        media: item.media.mediaUrl,
        mediaType: item.media.mediaType,
        mediaDuration: item.media.mediaDuration,
        schedule: item.schedule,
      };
    });
    const Mycss = slides[0].style;
    const dynamicCss = getCss(playlistType, Mycss);
    const dynamicjs = getjs(playlistType, tempSlides, hostURL, style);

    const htmlTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
          <title>${playlistData.name} Slideshow</title>
          <style>${dynamicCss}</style>
          </head>
          <body>
            <div class="carousel">
            </div>
            <script>
            ${dynamicjs}
            </script>
          </html>
        `;
    const folderPath = path.join(
      `${process.env.CDN_CONTAINER_PATH}playlist/`,
      playlistData.name
    );
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const indexPath = path.join(folderPath, "index.html");
    fs.writeFileSync(indexPath, htmlTemplate);

    playlistData["playlistUrl"] =
      hostURL + "playlist/" + playlistData.name + "/";
    const globalcss = new Styles({
      globalStyle: style,
    });
    const savedGlobalCss = await globalcss.save();
    playlistData.style = savedGlobalCss._id;
    const slideObjs = await Promise.all(
      newSlides.map(async (slide) => {
        const newSlide = {};
        newSlide.media = slide.media;
        newSlide.captionT = slide.captionT;
        newSlide.captionB = slide.captionB;
        newSlide.schedule = slide.schedule;
        const slidecss = new Styles({
          slideCss: slide.style,
        });
        const savedSlideCss = await slidecss.save();
        newSlide.style = savedSlideCss._id;
        const slideObj = new Slides(newSlide);
        return slideObj.save();
      })
    );
    playlistData.slides = slideObjs.map((slide) => slide._id);
    const playlist = new Playlists(playlistData);

    const savedPlaylist = await playlist.save();

    return responseHandler.handleSuccessResponse(
      res,
      "Playlist Created successfully"
    );
  } catch (error) {
    console.error("Error creating playlist:", error);
    return responseHandler.handleErrorResponse(
      res,
      500,
      "Failed to create playlist"
    );
  }
};

exports.EditPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const hostURL = process.env.CDN_URL
    const { name, department, style, slides, playlistType } = req.body;
    const updatedSlides = await Promise.all(
      slides.map(async (slide) => {
        const newslide = { ...slide };
        const media = await Medias.findById(slide.media);
        if (media) {
          newslide.media = {
            _id: media._id,
            mediaType: media.mediaType,
            mediaUrl: media.mediaUrl,
            mediaDuration: media.mediaDuration || 8000,
          };
          return newslide;
        }
        return null;
      })
    );
const existingPlaylist = await Playlists.findById(id)
  .populate('slides')
  if (!existingPlaylist) {
      return responseHandler.handleErrorResponse(
        res,
        404,
        "Playlist not found"
      );
    }
    if (
      user.role === "assetManager" &&
      user.departmentId._id != existingPlaylist.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot edit playlist due to unauthorised request"
      );
    }
    if (user.role === "standard" && user.id != existingPlaylist.createdBy) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot edit playlist due to unauthorised request"
      );
    }
    if (existingPlaylist.lock) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "cannot edit a locked playlist"
      );
    }
    // Check if the playlist ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Invalid playlist ID"
      );
    }

    // Perform additional validation checks here
    if (!name) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Playlist name is required"
      );
    }
    // Check if the playlist name is being changed
    if (existingPlaylist.name !== name) {
      // Check if a directory with the new name already exists
      const newFolderPath = path.join(`${process.env.CDN_CONTAINER_PATH}playlist/`, name);

      if (fs.existsSync(newFolderPath)) {
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Playlist with the new name already exists"
        );
      }
      // Delete the old folder if it exists
      const oldFolderPath = path.join(
        `${process.env.CDN_CONTAINER_PATH}playlist/`,
        existingPlaylist.name
      );
      if (fs.existsSync(oldFolderPath)) {
        fs.rmSync(oldFolderPath, { recursive: true });
      }
      // Create the new folder
      fs.mkdirSync(newFolderPath, { recursive: true });
      existingPlaylist.name = name;
    }
    const tempSlides = updatedSlides.map((item) => {
      return {
        ...item,
        media: item.media.mediaUrl,
        mediaType: item.media.mediaType,
        mediaDuration: item.media.mediaDuration,
      };
    });
    // update global css
    const globalcss = await Styles.findById(existingPlaylist.style);
    globalcss.globalStyle = style;
    const savedGlobalCss = await globalcss.save();
    existingPlaylist.style = savedGlobalCss._id;
    //update slide first delete all slides and create new slides slide also ahve style also delete that by id
    await Promise.all(existingPlaylist.slides.map(async (slide) => {
      await Styles.findByIdAndDelete(slide.style);
      await Slides.findByIdAndDelete(slide._id);
    }));
    existingPlaylist.slides = [];
    
    const slideObjs = await Promise.all(
      updatedSlides.map(async (slide) => {
        const newSlide = {};
        newSlide.media = slide.media;
        newSlide.captionT = slide.captionT;
        newSlide.captionB = slide.captionB;
        newSlide.schedule = slide.schedule;

        const slidecss = new Styles({
          slideCss: slide.style,
        });
        const savedSlideCss = await slidecss.save();
        newSlide.style = savedSlideCss._id;

        const slideObj = new Slides(newSlide);
        return slideObj.save();
      })
    );
    existingPlaylist.slides = slideObjs.map((slide) => slide._id);
    existingPlaylist.department =
      user.role === "admin" ? department : existingPlaylist.department;

    const Mycss = slides[0].style;
    const dynamicCss = getCss(playlistType, Mycss);
    const dynamicjs = getjs(playlistType, tempSlides, hostURL, style);
    let updatedHtmlTemplate = "";
    // Update HTML template if needed
    if (slides && slides.length > 0) {
      updatedHtmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${existingPlaylist.name} Slideshow</title>
          <style>${dynamicCss}</style>
        </head> 
        <body>
          <div class="carousel">
          </div>
          <script>
            ${dynamicjs}
          </script>
        </body>
        </html>
      `;
      const folderPath = path.join(
        `${process.env.CDN_CONTAINER_PATH}playlist`,
        existingPlaylist.name
      );
      const indexPath = path.join(folderPath, "index.html");

      fs.writeFileSync(indexPath, updatedHtmlTemplate);
    }
    existingPlaylist.playlistUrl =
      hostURL + "playlist/" + existingPlaylist.name + "/";
    // Save the updated playlist
    const savedPlaylist = await existingPlaylist.save();

    return responseHandler.handleSuccessResponse(
      res,
      "Playlist updated successfully"
    );
  } catch (error) {
    console.log("Error updating playlist:", error);
    return responseHandler.handleErrorResponse(
      res,
      500,
      "Failed to update playlist"
    );
  }
};
exports.Playlist = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const hostURL = process.env.CDN_URL;
    const {
      name,
      department,
      devices,
      groups,
      template,
      style,
      schedule,
      slides,
      sociallinks,
    } = req.body;

    const existingPlaylist = await Playlists.findById(id);
    if (
      user.role !== "admin" &&
      user.departmentId._id != existingPlaylist.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot edit playlist due to unauthorised request"
      );
    }
    if (
      user.role === "assetManager" &&
      user.departmentId._id != existingPlaylist.department
    ) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot edit playlist due to unauthorised request"
      );
    }
    if (user.role === "standard" && user.id != existingPlaylist.createdBy) {
      return responseHandler.handleErrorResponse(
        res,
        401,
        "cannot edit playlist due to unauthorised request"
      );
    }
    if (existingPlaylist.lock) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "cannot edit a locked playlist"
      );
    }
    // Check if the playlist ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Invalid playlist ID"
      );
    }

    // Perform additional validation checks here
    if (!name) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        "Playlist name is required"
      );
    }

    if (!existingPlaylist) {
      return responseHandler.handleErrorResponse(
        res,
        404,
        "Playlist not found"
      );
    }

    // Check if the playlist name is being changed
    if (existingPlaylist.name !== name) {
      // Check if a directory with the new name already exists
      const newFolderPath = path.join(`${process.env.CDN_CONTAINER_PATH}playlist/`, name);
      if (fs.existsSync(newFolderPath)) {
        return responseHandler.handleErrorResponse(
          res,
          400,
          "Playlist with the new name already exists"
        );
      }

      // Delete the old folder if it exists
      const oldFolderPath = path.join(
        `${process.env.CDN_CONTAINER_PATH}playlist/`,
        existingPlaylist.name
      );
      if (fs.existsSync(oldFolderPath)) {
        fs.rmSync(folderPath, { recursive: true });
      }
      // Create the new folder
      fs.mkdirSync(newFolderPath, { recursive: true });
    }
    // Update the playlist data
    existingPlaylist.devices = devices || existingPlaylist.devices;
    existingPlaylist.groups = groups || existingPlaylist.groups;
    existingPlaylist.template = template || existingPlaylist.template;
    existingPlaylist.style = style || existingPlaylist?.style;
    existingPlaylist.schedule = schedule || existingPlaylist.schedule;
    existingPlaylist.slides = slides || existingPlaylist.slides;
    existingPlaylist.sociallinks = sociallinks || existingPlaylist.sociallinks;

    const playlistType = existingPlaylist.type;
    // Update or add new slides

    existingPlaylist.slides = updatedSlides;
    const Mycss = slides[0].style;
    const tempSlides = updatedSlides.map((item) => {
      return { ...item, image: item.image.mediaUrl };
    });
    const dynamicCss = getCss(playlistType, Mycss);
    const dynamicjs = getjs(playlistType, tempSlides, hostURL, style);
    let updatedHtmlTemplate = "";
    // Update HTML template if needed
    if (slides && slides.length > 0) {
      updatedHtmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${existingPlaylist.name} Slideshow</title>
          <style>${dynamicCss}</style>
        </head>
        <body>
          <div class="carousel">
          </div>
          <script>
            ${dynamicjs}
          </script>
        </body>
        </html>
      `;

      const folderPath = path.join(
        `${process.env.CDN_CONTAINER_PATH}playlist/`,
        existingPlaylist.name
      );
      const indexPath = path.join(folderPath, "index.html");
      fs.writeFileSync(indexPath, updatedHtmlTemplate);
    }
    existingPlaylist.playlistUrl =
      hostURL + "playlist/" + existingPlaylist.name + "/";
    // Save the updated playlist
    const savedPlaylist = await existingPlaylist.save();

    return responseHandler.handleSuccessResponse(
      res,
      "Playlist updated successfully"
    );
  } catch (error) {
    console.log("Error updating playlist:", error);
    return responseHandler.handleErrorResponse(
      res,
      500,
      "Failed to update playlist"
    );
  }
};
