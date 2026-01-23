const mongoose = require('mongoose');

const logRequestSchema = new mongoose.Schema({
  method: String,
  url: String,
  params: mongoose.Schema.Types.Mixed,
  query: mongoose.Schema.Types.Mixed,
  body: mongoose.Schema.Types.Mixed,
  headers: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('LogRequest', logRequestSchema);

