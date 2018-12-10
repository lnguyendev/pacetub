import React from 'react';
import PropTypes from 'prop-types';

const DashboardHeader = props => {
  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-wrapper">
        <h1 className="dashboard-header-title">{props.headerTitle}</h1>
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  headerTitle: PropTypes.string.isRequired
};

export default DashboardHeader;
