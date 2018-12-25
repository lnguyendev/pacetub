import React, { Component } from 'react';
import { Form, Button, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser, clearSuccess } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      success: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearSuccess();
    this.props.clearErrors();
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        errors: { ...this.props.errors },
        success: this.props.success
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
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
      password: this.state.password
    };

    this.props.loginUser(user);
  }

  render() {
    const { errors, success } = this.state;

    return (
      <div className="box-view">
        <div className="auth-container">
          <h1 className="auth-title">Timesheet</h1>
          <div className="login-container">
            <h3 className="login-title">Login</h3>
            <Form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Email Address"
                icon="user"
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.onChange}
                error={errors.email}
              />
              <TextFieldGroup
                placeholder="Password"
                icon="lock"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />
              <div className="forgot-password-link">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              {errors.credentials && (
                <Alert message={errors.credentials} type="error" showIcon />
              )}
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form>
            <p className="regular-text">
              Don't have an account?{' '}
              <span>
                <Link to="/register">Register</Link> here!
              </span>
            </p>
            {!_.isEmpty(success) && (
              <Alert
                message="Congrats! You have successfully registered. Now proceed to enter the magic kingdom."
                type="success"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
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
  { loginUser, clearSuccess, clearErrors }
)(Login);
