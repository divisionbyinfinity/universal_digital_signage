const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  department:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    required:true
  },
  lock:{
    type:Boolean,
    default:false,
  },
  playlistUrl: {
    type: String
  },
  playlistId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Playlists"
  },
  stackedUrl:{
    type:String
  },
  stackedPlaylistId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Playlists"
    },
  description:{
    type:String
  },
  channelUrl:{
    type:String,
    required:true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required:true
  } ,
  groupId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Groups"
  },
},{ timestamps: true });

mongoose.model('Channels', channelSchema);

