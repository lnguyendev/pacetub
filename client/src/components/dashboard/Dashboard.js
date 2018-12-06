import React, { Component } from 'react';
import DashboardHeader from './DashboardHeader';

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard-container">
        <DashboardHeader />
      </div>
    );
  }
}

export default Dashboard;
