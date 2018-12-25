import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { logoutUser } from '../../actions/authActions';
import { updateDatabaseLookup } from '../../actions/timesheetNavActions';

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();

    this.props.updateDatabaseLookup(true);
    this.props.logoutUser(this.props.history);
  }
  render() {
    return (
      <div className="nav-container">
        <div className="nav-content">
          <Link to="/dashboard">
            <h2 className="nav-title">Pacetub</h2>
          </Link>
          {this.props.auth.isAuthenticated && (
            // eslint-disable-next-line
            <a
              href="#"
              className="logout-link"
              onClick={this.onLogoutClick.bind(this)}
            >
              Logout
            </a>
          )}
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  updateDatabaseLookup: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateDatabaseLookup }
)(withRouter(Navbar));
