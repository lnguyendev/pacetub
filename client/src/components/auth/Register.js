import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { registerUser } from '../../actions/authActions';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmedPassword: '',
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

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirmedPassword: this.state.confirmedPassword
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.props;

    return (
      <div className="box-view">
        <div className="register-container">
          <h1 className="register-title">Register</h1>
          <form noValidate onSubmit={this.onSubmit}>
            <TextFieldGroup
              label="Name"
              placeholder="John Doe"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              error={errors.name}
            />
            <TextFieldGroup
              label="Email"
              placeholder="example@example"
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.onChange}
              error={errors.email}
            />
            <TextFieldGroup
              label="Password"
              placeholder="password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              error={errors.password}
            />
            <TextFieldGroup
              label="Confirm Password"
              placeholder="confirm password"
              name="confirmedPassword"
              type="password"
              value={this.state.confirmedPassword}
              onChange={this.onChange}
              error={errors.confirmedPassword}
            />
            <Button type="submit" bsStyle="primary" block>
              Submit
            </Button>
          </form>
          <p className="regular-text">
            Already have an account?{' '}
            <span>
              <Link to="/">Login</Link> here!
            </span>
          </p>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
