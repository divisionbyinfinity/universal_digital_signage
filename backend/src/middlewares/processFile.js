const util = require("util");
const Multer = require("multer");
const responseHandler = require('@helpers/responseHandler')
const upload = Multer();

const processSingleFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof Multer.MulterError) {
      return responseHandler.handleErrorResponse(res,400,"Too many files uploaded.")
    } else if (err) {
      return responseHandler.handleErrorResponse(res,400,"File upload failed.")
    } else if (!req.file) {
      return responseHandler.handleErrorResponse(res,400,"No file uploaded.")
    }
    next();
  });
};
const processSingleFileOptional = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof Multer.MulterError) {
      return responseHandler.handleErrorResponse(res,400,"Too many files uploaded.")
    } else if (err) {
      return responseHandler.handleErrorResponse(res,400,"File upload failed.")
    }
    next();
  });
};
const processMultipleFiles = (req, res, next) => {
  upload.array('files')(req, res, (err) => {
    if (err) {
      console.error(err);
      return responseHandler.handleErrorResponse(res, 400, "File upload failed.");
    } else if (!req.files || req.files.length === 0) {
      return responseHandler.handleErrorResponse(res, 400, "No files uploaded. Please select one or more files to upload.");
    }
    next();
  });
};


exports.processSingleFileMiddleware = util.promisify(processSingleFile);
exports.processMultipleFileMiddleware = util.promisify(processMultipleFiles);
exports.processSingleFileOptionalMiddleware = util.promisify(processSingleFileOptional);




