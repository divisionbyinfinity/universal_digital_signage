const mongoose = require('mongoose');
const Playlists = mongoose.model('Playlists');
const Medias = mongoose.model('Medias');
const responseHandler = require('@helpers/responseHandler');
const fs = require('fs');
const path = require('path');
const {getHtml}= require('./kisoksHelper');
const hostURL= process.env.CDN_URL;

exports.create=async (req, res) => {
    try {
        const {name, department, slides,style,description} = req.body;
        if (!name || !department || !slides) {
            return res.status(400).json({message: 'Please fill all fields'});
        }
        const tempName=name.toLowerCase().replace(/\s/g,'');
        const playlistExists = await Playlists.findOne({name: tempName});
        if (playlistExists) {
            return responseHandler.handleErrorResponse(res, 400, 'Playlist with this name already exists');
        }

        
        const newSlides =await Promise.all(slides.map(async slide => {
            const media = await Medias.findById(slide.image);
            if (media) {
                const newSlide = {...slide};  
                newSlide.image = {_id:media._id,mediaUrl:media.mediaUrl};
                return {...newSlide}
            }
            return null;
        }))
        const filteredSlides = newSlides.filter(slide => slide !== null && slide !== undefined);
        const html=getHtml(style,filteredSlides)
        const folderPath = path.join(`${process.env.CDN_PATH}playlist/`, name);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath,{recursive:true});
        }
        const indexPath = path.join(folderPath, 'index.html');
        await fs.writeFileSync(indexPath, html);
        const playlist = new Playlists({
            name:tempName,
            type:3,
            department,
            slides:filteredSlides,
            style,
            description,
            playlistUrl:`${hostURL}playlist/${name}/`,
            createdBy: req.user.id,
        });
        await playlist.save();
        return responseHandler.handleSuccessResponse(res, 'Playlist created successfully');
    } catch (err) {
        console.log(err);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
    }

exports.edit=async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    const {name, department, slides,style,description} = req.body;
    if (!name || !department || !slides) {
        return res.status(400).json({message: 'Please fill all fields'});
    }
    const playlist = await Playlists.findById(id);
    if (!playlist) {
        return responseHandler.handleErrorResponse(res, 404, 'Playlist not found');
    }
    if(playlist.lock){
        return responseHandler(res, 401, 'Playlist is locked');
    }
    if (user.role !=='admin'){
        if(user.role!=="assetManager" && user.department!==playlist.department){
            return responseHandler.handleErrorResponse(res, 401, 'You are not authorized to edit this playlist');
        }
    }
    if (playlist.createdBy.toString() !== req.user.id) {
        return responseHandler(res, 401, 'You are not authorized to edit this playlist');
    }
    const newSlides =await Promise.all(slides.map(async slide => {
        const media = await Medias.findById(slide.image);
        if (media) {
            const newSlide = {...slide};
            newSlide.image = {_id:media._id,mediaUrl:media.mediaUrl};
            return {...newSlide}
        }
        return null;
    }))
    const filteredSlides = newSlides.filter(slide => slide !== null && slide !== undefined);
    const html=getHtml(style,filteredSlides)
    const folderPath = path.join(`${process.env.CDN_PATH}playlist/`, name);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath,{recursive:true});
    }
    const indexPath = path.join(folderPath, 'index.html');
    await fs.writeFileSync(indexPath, html);
    playlist.slides = filteredSlides;
    playlist.style = style;
    playlist.description = description;
    await playlist.save();
    return responseHandler.handleSuccessObject(res, playlist);

}

exports.clone =async (req, res) => {
    try {
        const {name, department, slides,style,description} = req.body;
        if (!name || !department || !slides) {
            return res.status(400).json({message: 'Please fill all fields'});
        }
        const tempName=name.toLowerCase().replace(/\s/g,'');
        const playlistExists = await Playlists.findOne({name: tempName});
        if (playlistExists) {
            return responseHandler.handleErrorResponse(res, 400, 'Playlist with this name already exists');
        }
        const newSlides =await Promise.all(slides.map(async slide => {
            const media = await Medias.findById(slide.image);
            if (media) {
                const newSlide = {...slide};  
                newSlide.image = {_id:media._id,mediaUrl:media.mediaUrl};
                return {...newSlide}
            }
            return null;
        }))
        const filteredSlides = newSlides.filter(slide => slide !== null && slide !== undefined);
        const html=getHtml(style,filteredSlides)
        const folderPath = path.join(`${process.env.CDN_PATH}playlist/`, name);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath,{recursive:true});
        }
        //clone for the kiosk playlis t
        const indexPath = path.join(folderPath, 'index.html');
        await fs.writeFileSync(indexPath, html);
        const playlist = new Playlists({
            name:tempName,
            type:3,
            department,
            slides:filteredSlides,
            style,
            description,
            playlistUrl:`${hostURL}playlist/${name}/`,
            createdBy: req.user.id,
        });
        await playlist.save();
        return responseHandler.handleSuccessResponse(res, 'Playlist created successfully');
    } catch (err) {
        console.log(err);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
    }
