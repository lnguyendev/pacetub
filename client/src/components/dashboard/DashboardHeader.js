import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import _ from 'lodash';
import { Icon } from 'antd';
import CircularProgressbar from 'react-circular-progressbar';
import CountUp from 'react-countup';

class DashboardHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goalHours: 40,
      startHour: 0,
      loggedHours: 0,
      hourSuffix: 'hr',
      percentageAchieved: 0
    };
  }

  calculateDailyHours(tasks) {
    return _.reduce(
      tasks,
      (dailySum, task) => {
        return dailySum + task.hours;
      },
      0
    );
  }

  calculateTimesheetsHours(timesheets, isThisWeek) {
    return _.reduce(
      timesheets,
      (timesheetSum, timesheet) => {
        if (timesheet.isNew && !isThisWeek) {
          return timesheetSum + 0;
        }

        const dailyHours = this.calculateDailyHours(timesheet.tasks);

        return timesheetSum + dailyHours;
      },
      0
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      const { timesheets } = this.props.timesheet;
      const { isThisWeek } = this.props.date;
      const { start } = queryString.parse(this.props.location.search);

      const loggedHours = this.calculateTimesheetsHours(timesheets, isThisWeek);
      const percentageAchieved = (loggedHours / this.state.goalHours) * 100;

      this.setState({
        loggedHours,
        percentageAchieved,
        hourSuffix: loggedHours > 1 ? ' hrs' : ' hr'
      });

      const checkQueryStringDateIsThisWeek =
        moment(start).startOf('week') === moment().startOf('week');

      if (this.state !== prevState && !checkQueryStringDateIsThisWeek) {
        this.setState({
          startHour: prevState.loggedHours
        });
      }
    }
  }

  render() {
    const { startHour, loggedHours, hourSuffix } = this.state;
    const hourText = (
      <CountUp
        start={startHour}
        end={loggedHours}
        duration={2}
        decimals={1}
        redraw={true}
      />
    );

    return (
      <div className="dashboard-header-container">
        <div className="dashboard-header-wrapper">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-header-title-icon">
                <Icon type="dashboard" />
              </h1>
              <h1 className="dashboard-header-title">Dashboard</h1>
            </div>
            <div className="dashboard-progress-bar-container">
              <div className="dashboard-progress-hour-text">
                <strong>{hourText}</strong>{' '}
                <span className="hour-suffix">{hourSuffix}</span>
              </div>
              <CircularProgressbar
                initialAnimation={true}
                percentage={this.state.percentageAchieved}
                className="progress-bar-cir"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardHeader.propTypes = {
  timesheet: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  timesheet: state.timesheet,
  date: state.date
});

export default withRouter(connect(mapStateToProps)(DashboardHeader));
