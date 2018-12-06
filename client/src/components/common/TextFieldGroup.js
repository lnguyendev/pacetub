import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div>
      <FormGroup validationState={error ? 'error' : null}>
        {label && <ControlLabel className="form-label">{label}</ControlLabel>}
        <FormControl
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
        />
        <FormControl.Feedback />
        {error && <HelpBlock className="error-message">{error}</HelpBlock>}
      </FormGroup>
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
