import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
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
    const { errors } = this.props;

    return (
      <div className="box-view">
        <div className="auth-container">
          <h1 className="auth-title">Timesheet</h1>
          <div className="login-container">
            <h3 className="login-title">Login</h3>
            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Email Address"
                addon="fas fa-user"
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.onChange}
                error={errors.email}
              />
              <TextFieldGroup
                placeholder="Password"
                addon="fas fa-lock"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />
              {errors.credentials && (
                <Alert bsStyle="danger">{errors.credentials}</Alert>
              )}
              <Button type="submit" bsStyle="primary" block>
                Login
              </Button>
            </form>
            <p className="regular-text">
              Don't have an account?{' '}
              <span>
                <Link to="/register">Register</Link> here!
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
