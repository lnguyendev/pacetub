import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  InputGroup
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
  disabled,
  addon
}) => {
  return (
    <div>
      <FormGroup validationState={error ? 'error' : null}>
        <InputGroup>
          {label && <ControlLabel className="form-label">{label}</ControlLabel>}
          {addon && (
            <InputGroup.Addon>
              <i className={addon} />
            </InputGroup.Addon>
          )}
          <FormControl
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
          />
          <FormControl.Feedback />
        </InputGroup>
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
  disabled: PropTypes.string,
  addon: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
