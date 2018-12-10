const Validator = require('validator');
const _ = require('lodash');

module.exports = function ValidateLoginInput(data) {
  let errors = {};

  const dataFields = ['email', 'password'];

  dataFields.forEach(field => {
    if (_.isEmpty(data[field])) {
      errors[field] = `${field} field is required.`;
    }
  });

  if (!_.isEmpty(data.email) && !Validator.isEmail(data.email)) {
    errors.email = 'Email must be in the correct format.';
  }

  return { errors, isValid: _.isEmpty(errors) };
};
