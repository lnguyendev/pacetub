import React from 'react';
import PropTypes from 'prop-types';

import { Form, Icon, Input } from 'antd';
const FormItem = Form.Item;

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
  icon
}) => {
  return (
    <div>
      <FormItem
        label={label}
        hasFeedback
        validateStatus={error ? 'error' : null}
        help={error && error}
      >
        <Input
          prefix={
            icon && <Icon type={icon} style={{ color: 'rgba(0,0,0,.25)' }} />
          }
          placeholder={placeholder}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </FormItem>
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
  icon: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
