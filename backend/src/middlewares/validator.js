const { validationResult } = require('express-validator');
const responseHandler = require('@helpers/responseHandler')
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    responseHandler.handleErrorObject(res,422,errors.array());
  };
};


module.exports = {
  validate
};