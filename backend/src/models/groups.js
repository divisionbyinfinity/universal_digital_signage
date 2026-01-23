const mongoose=require("mongoose")
const GroupSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
    hosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Devices',
      required: true,
    }],
    department:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Departments'},
    channels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channels',
      required: true,
    }],
    schedules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedulers'
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    playlistId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Playlists"
    },
    playlistUrl:String,
    stackedPlaylistId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Playlists"
    },
    stackedPlaylistUrl:String,
    description:{
      type:String
    }
  }, { timestamps: true });
  
  mongoose.model('Groups', GroupSchema);