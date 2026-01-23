const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  backgroundColor: String,
  imagePadding: Number,
  slideDuration: Number,
  fontFamily:String,
  captionPosition:String,
});

mongoose.model('Templates', templateSchema);

