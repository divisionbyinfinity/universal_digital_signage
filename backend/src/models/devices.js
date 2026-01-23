const mongoose = require('mongoose');

const Devices = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    enum: [1,2],
    default: 1,
    required: true,
  },
  lock:{
    type:Boolean,
    default:false,
  },
  assignedGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assetgroups',
  },
  schedules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedulers'
  }],
  isTouchScreen: {  
    type: Boolean,
    default: false,
  },
  department:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    required:true
  },
  description:{
    type:String
  },
  hostUrl:{
    type:String,
    required:true
  },
  playlistUrl:{
    type:String
  },
  stackedUrl:{
    type:String
  },
  playlistId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Playlists"
  },
  stackedPlaylistId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Playlists"
  },
  groupId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Groups"
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required:true
  }
},{timestamps:true});

mongoose.model('Devices', Devices);

