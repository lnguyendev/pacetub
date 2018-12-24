import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

import { getWeekRangeTimesheets } from '../../actions/timesheetActions';

import TimesheetForm from '../timesheet/TimesheetForm';
import DashboardTimesheetNav from './DashboardTimesheetNav';
import Timesheet from '../timesheet/Timesheet';

const dateFormat = 'MM-DD-YYYY';

class DashboardContent extends Component {
  componentDidMount() {
    const { history } = this.props;
    const { start } = queryString.parse(this.props.location.search);
    const currentStartDate = start
      ? start
      : moment()
          .startOf('week')
          .format(dateFormat);

    this.props.getWeekRangeTimesheets(currentStartDate, history);
  }

  componentDidUpdate(prevProps) {
    const query = queryString.parse(prevProps.location.search);
    const oldStart = query.start;
    const { start } = queryString.parse(this.props.location.search);
    const { history } = this.props;

    if (
      this.props.date !== prevProps.date &&
      this.props.date.isThisWeek &&
      start
    ) {
      this.props.history.replace('/dashboard');
    }

    if (oldStart !== start) {
      const currentStartDate = start
        ? start
        : moment()
            .startOf('week')
            .format(dateFormat);

      this.props.getWeekRangeTimesheets(currentStartDate, history);
    }
  }

  render() {
    const { timesheets, loading, taskLoading } = this.props.timesheet;
    let timesheetsContent;
    let timesheetNav;

    if (timesheets === null || loading) {
      timesheetsContent = (
        <div className="regular-timesheet-container">
          <div className="regular-timesheet-wrapper">
            <Spin size="large" />
          </div>
        </div>
      );
      timesheetNav = null;
    } else {
      if (timesheets.length > 0) {
        timesheetsContent = (
          <Timesheet taskLoading={taskLoading} timesheets={timesheets} />
        );
      } else {
        timesheetsContent = (
          <div className="regular-timesheet-container">
            <div className="regular-timesheet-wrapper">
              <p>You do not have any timesheet past this point.</p>
            </div>
          </div>
        );
      }

      timesheetNav = <DashboardTimesheetNav timesheets={timesheets} />;
    }

    return (
      <div className="dashboard-content-container">
        <TimesheetForm />
        {timesheetNav}
        {timesheetsContent}
      </div>
    );
  }
}

DashboardContent.propTypes = {
  getWeekRangeTimesheets: PropTypes.func.isRequired,
  timesheet: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  timesheet: state.timesheet,
  date: state.date
});

export default withRouter(
  connect(
    mapStateToProps,
    { getWeekRangeTimesheets }
  )(DashboardContent)
);
