  const mongoose = require('mongoose');

  const scheduleSchema = new mongoose.Schema({
    name:{
      type:String,
      require:true
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
    },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Devices' },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channels' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups' },

    playlistId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Playlists',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departments',
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required:true
    },
    description:{
      type:String
    },
    playlistUrl:{
      type:String
    },
    // Other properties specific to the schedule
  },{timestamps:true});

  mongoose.model('Schedulers', scheduleSchema);

