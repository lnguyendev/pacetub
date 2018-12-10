import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashboardHeader from './DashboardHeader';
import DashboardContent from './DashboardContent';

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard-container">
        <DashboardHeader headerTitle="Dashboard" />
        <DashboardContent />
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard);
