const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    departmentLogo: {
        type: String,
        required: false
    },
    description:{
        type:String,
        required:false
    },
    profileImg:{
        type:String,
        required:false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required:true
      },
      assignassetManager:{
        type:String,
        required:false
      }
},{timestamps:true});

mongoose.model('Departments', departmentSchema);

