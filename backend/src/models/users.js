const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    bio:{
        type:String
      },
    role: {
        type: String,
        enum: ['standard', 'admin','assetManager','globalAssetManager'],
        required: true,
      },
      departmentName:{
        type:String,
        require:true
      },
      profileImg:{type:String,require:false},
    departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    }

},{timestamps:true});
mongoose.model('Users', userSchema);
