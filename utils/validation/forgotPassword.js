const Validator = require('validator');
const _ = require('lodash');

module.exports = function ValidateForgotPasswordInput(data) {
  let errors = {};

  if (_.isEmpty(data.email)) {
    errors.email = 'Email field is required.';
  } else {
    if (!Validator.isEmail(data.email)) {
      errors.email = 'Email must be in the correct format.';
    }
  }

  return { errors, isValid: _.isEmpty(errors) };
};
