const mongoose=require('mongoose')
const assignedPlaylists=new mongoose.Schema({
playlist:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlists'
},
group:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Groups'
},
device: { type: mongoose.Schema.Types.ObjectId, ref: 'devices' },

channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Channels'
},
assignedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users',
    required:true
},
},{timestamps:true})

mongoose.model('AssignedPlaylists',assignedPlaylists)