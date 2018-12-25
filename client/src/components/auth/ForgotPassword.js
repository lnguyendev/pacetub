import React, { Component } from 'react';
import { Form, Button, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  sendResetPasswordEmail,
  clearSuccess
} from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import TextFieldGroup from '../common/TextFieldGroup';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      success: '',
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
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        success: this.props.success,
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
      email: this.state.email
    };

    this.setState({
      isLoading: true
    });

    this.props.sendResetPasswordEmail(user);
  }

  render() {
    const { errors, success, isLoading, email } = this.state;
    let resetPasswordContent;

    if (success === 'email sent') {
      const successfulEmailSentContent = (
        <p>
          Reset password email has been sent to{' '}
          <span className="forgot-password-success-email">
            {this.state.email}
          </span>
          . Please refer to the email for instructions on how to complete this
          process.
        </p>
      );
      resetPasswordContent = (
        <Alert
          message="Good to go! Email sent!"
          description={successfulEmailSentContent}
          type="success"
        />
      );
    } else {
      resetPasswordContent = (
        <div>
          <p className="forgot-password-info">
            To reset your password, enter your email below and submit. An email
            will be sent to you with instructions about how to complete the
            process.
          </p>
          <Form noValidate onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Email Address"
              icon="user"
              name="email"
              type="email"
              value={email}
              onChange={this.onChange}
              error={errors.email}
            />
            {isLoading && (
              <Spin style={{ width: '100%', marginBottom: '10px' }} />
            )}
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form>
          <p className="regular-text">
            Remember your password now? <Link to="/">Login</Link> here!
          </p>
        </div>
      );
    }

    return (
      <div className="box-view">
        <div className="auth-container">
          <h1 className="auth-title">Pacetub</h1>
          <div className="forgot-password-container">
            <h3 className="forgot-password-title">
              Oops! You forgot your password!
            </h3>
            {resetPasswordContent}
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  sendResetPasswordEmail: PropTypes.func.isRequired,
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
  { clearErrors, clearSuccess, sendResetPasswordEmail }
)(ForgotPassword);
