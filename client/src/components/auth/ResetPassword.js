import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Form, Button, Spin } from 'antd';
import PropTypes from 'prop-types';

import {
  checkResetPasswordToken,
  resetPassword,
  clearSuccess
} from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import TextFieldGroup from '../common/TextFieldGroup';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmedPassword: '',
      success: '',
      initialLoading: true,
      isLoading: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
    this.props.clearSuccess();
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

    this.props.checkResetPasswordToken(
      this.props.match.params.resetPasswordToken
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        success: this.props.success,
        initialLoading: false,
        isLoading: false,
        errors: { ...this.props.errors }
      });

      if (this.props.auth.isAuthenticated) {
        this.props.history.push('/dashboard');
      }
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
      confirmedPassword: this.state.confirmedPassword
    };

    this.setState({
      isLoading: true
    });

    this.props.resetPassword(user, this.props.match.params.resetPasswordToken);
  }

  render() {
    const {
      errors,
      success,
      initialLoading,
      isLoading,
      email,
      password,
      confirmedPassword
    } = this.state;
    let resetPasswordContent;

    if (errors && errors.invalidlink) {
      const invalidLinkContent = (
        <p>
          {errors.invalidlink} Click <Link to="/forgot-password">here</Link> to
          request a new password reset link.
        </p>
      );

      resetPasswordContent = (
        <Alert
          message="Bummer! Invalid Link!"
          description={invalidLinkContent}
          type="error"
        />
      );
    } else if (initialLoading) {
      resetPasswordContent = (
        <Spin style={{ width: '100%', marginBottom: '10px' }} />
      );
    } else if (success === 'Successfully reset password') {
      const successfulPasswordResetContent = (
        <p>
          You have successfully updated your password. Click{' '}
          <Link to="/">here</Link> to log in with your newly created password.
        </p>
      );
      resetPasswordContent = (
        <Alert
          message="Alright! Your password is updated."
          description={successfulPasswordResetContent}
          type="success"
        />
      );
    } else {
      resetPasswordContent = (
        <div>
          <p className="reset-password-info">
            Enter your email and a new password to update your account.
          </p>
          <Form noValidate onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={this.onChange}
              error={errors.email}
            />
            <TextFieldGroup
              placeholder="Password"
              name="password"
              type="password"
              value={password}
              onChange={this.onChange}
              error={errors.password}
            />
            <TextFieldGroup
              placeholder="Confirm Password"
              name="confirmedPassword"
              type="password"
              value={confirmedPassword}
              onChange={this.onChange}
              error={errors.confirmedPassword}
            />
            {isLoading && (
              <Spin style={{ width: '100%', marginBottom: '10px' }} />
            )}
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form>
        </div>
      );
    }

    return (
      <div className="box-view">
        <div className="auth-container">
          <h1 className="auth-title">Timesheet</h1>
          <div className="reset-password-container">
            <h3 className="reset-password-title">Let's reset your password!</h3>
            {resetPasswordContent}
          </div>
        </div>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  checkResetPasswordToken: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default connect(
  mapStateToProps,
  { clearErrors, clearSuccess, checkResetPasswordToken, resetPassword }
)(ResetPassword);
