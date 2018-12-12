import React from 'react';

import DashboardHeader from './DashboardHeader';
import DashboardContent from './DashboardContent';

export default () => {
  return (
    <div className="dashboard-container">
      <DashboardHeader headerTitle="Dashboard" />
      <DashboardContent />
    </div>
  );
};
