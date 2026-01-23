const mongoose =require('mongoose')
const LogRequest=mongoose.model('LogRequest')
const logRequest = async (req, res, next) => {
  const { method, url, params, query, body, headers } = req;

  // Create an object to store the request details
  const logEntry = {
    method,
    url,
    timestamp: new Date(),
  };

  // Conditionally add attributes to the log entry if they exist
  if (params) {
    logEntry.params = params;
  }

  if (query) {
    logEntry.query = query;
  }

  if (body) {
    logEntry.body = body;
  }

  if (headers) {
    logEntry.headers = headers;
  }
  // console.log("logEntry:",logEntry)
  try {
    // Save the log entry to the MongoDB collection
    const logrequest = new LogRequest(logEntry);
    const savedlogrequest=await logrequest.save()
    console.log("savedlogrequest=",savedlogrequest)
    next(); // Continue processing the request
  } catch (error) {
    console.error('Error saving log entry to MongoDB:', error);
    next(error); // Pass the error to the error-handling middleware
  }
};

module.exports = logRequest;
