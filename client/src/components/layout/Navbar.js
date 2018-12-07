import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { logoutUser } from '../../actions/authActions';

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();

    this.props.logoutUser(this.props.history);
  }
  render() {
    return (
      <div className="nav-container">
        <div className="nav-content">
          <h3 className="nav-title">Timesheet</h3>
          {this.props.auth.isAuthenticated && (
            <Button
              type="button"
              bsStyle="link"
              className="logout-link"
              onClick={this.onLogoutClick.bind(this)}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
