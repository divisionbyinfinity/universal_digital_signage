const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments' },  // Assuming you have a Department schema
  type: { type: Number, required: true,enum:[1,2,3] },  // E.g., playlist type, can be an enum
  lock: { type: Boolean, default: false },
  style: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Styles',  // Referencing the style collection
      required: true 
  },
  slides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slides' }],
  
  playlistUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Assuming you have a User schema
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{
  timestamps: true
});


module.exports = mongoose.model('Playlists', PlaylistSchema);
