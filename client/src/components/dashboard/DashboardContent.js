import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getTimesheets } from '../../actions/timesheetActions';
import Spinner from '../common/Spinner';

import TimesheetForm from '../timesheet/TimesheetForm';
import Timesheet from '../timesheet/Timesheet';

class DashboardContent extends Component {
  componentDidMount() {
    this.props.getTimesheets();
  }

  render() {
    const { timesheets, loading, taskLoading } = this.props.timesheet;
    let timesheetsContent;

    if (timesheets === null || loading) {
      timesheetsContent = <Spinner />;
    } else {
      if (timesheets.length > 0) {
        timesheetsContent = (
          <Timesheet taskLoading={taskLoading} timesheets={timesheets} />
        );
      } else {
        timesheetsContent = (
          <div className="no-timesheet-container">
            <p>You currently do not have any timesheet.</p>
          </div>
        );
      }
    }

    return (
      <div className="dashboard-content-container">
        <TimesheetForm />
        {timesheetsContent}
      </div>
    );
  }
}

DashboardContent.propTypes = {
  getTimesheets: PropTypes.func.isRequired,
  timesheet: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  timesheet: state.timesheet
});

export default connect(
  mapStateToProps,
  { getTimesheets }
)(DashboardContent);
