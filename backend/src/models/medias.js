const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Departments',
      },
    mediaUrl: {
        type: String,
        required: true,
    },
    mediaType:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        default:''
    },
    size:Number,
    description: String,
    tags: {
        type:String,
        required:true,
        default:''
    },
    mediaDuration:{
        type:Number,
        default:0
    },
    assigned:{
        type:Array,
        },
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required:true
      }
},{ timestamps: true });

const Image = mongoose.model('Medias', MediaSchema);

module.exports = Image;