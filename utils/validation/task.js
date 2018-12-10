const Validator = require('validator');
const _ = require('lodash');

module.exports = function ValidateTaskInput(data) {
  let errors = {};

  const dataFields = ['description', 'hours'];

  dataFields.forEach(field => {
    if (_.isEmpty(data[field])) {
      errors[field] = `${field} field is required.`;
    }
  });

  if (
    !_.isEmpty(data.description) &&
    !Validator.isLength(data.description, { min: 10 })
  ) {
    errors.description = 'Task description must be min 10 characters.';
  }

  if (!_.isEmpty(data.hours) && !Validator.isNumeric(data.hours)) {
    errors.hours = 'Hours must be a numeric value.';
  }

  if (!_.isEmpty(data.hours) && parseFloat(data.hours) < 0) {
    errors.hours = 'Hours must be a value greater than 0.';
  }

  return { errors, isValid: _.isEmpty(errors) };
};
