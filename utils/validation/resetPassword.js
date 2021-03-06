const Validator = require('validator');
const _ = require('lodash');

module.exports = function validateResetPasswordInput(data) {
  let errors = {};

  const dataFields = ['email', 'password', 'confirmedPassword'];

  dataFields.forEach(field => {
    if (_.isEmpty(data[field])) {
      errors[field] = `${field} field is required.`;
    }
  });

  if (!_.isEmpty(data.email) && !Validator.isEmail(data.email)) {
    errors.email = 'Email must be in the correct format.';
  }

  if (
    !_.isEmpty(data.password) &&
    !Validator.isLength(data.password, { min: 6, max: 30 })
  ) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (
    !_.isEmpty(data.confirmedPassword) &&
    !Validator.equals(data.password || '', data.confirmedPassword)
  ) {
    errors.confirmedPassword = 'Passwords must match.';
  }

  return { errors, isValid: _.isEmpty(errors) };
};
