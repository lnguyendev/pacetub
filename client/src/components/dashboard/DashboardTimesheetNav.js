import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { updateDatabaseLookup } from '../../actions/timesheetNavActions';

import { Row, Col, Icon, Divider } from 'antd';

const dateFormat = 'MM/DD/YYYY';

class DashboardTimesheetNav extends Component {
  updateDatabaseLookup(val) {
    this.props.updateDatabaseLookup(val);
  }

  render() {
    const { date, timesheets, nav } = this.props;
    const startDate = moment(date.currentStartDate).format(dateFormat);
    const endDate = moment(date.currentStartDate)
      .endOf('week')
      .format(dateFormat);

    const navLabel = date.isThisWeek
      ? 'Current Week'
      : `${startDate} - ${endDate}`;

    return (
      <div className="dashboard-timesheet-nav-container">
        <div className="dashboard-timesheet-nav">
          <Row>
            <Col md={1} xs={2} className="nav-previous">
              {timesheets &&
              timesheets.length === 0 &&
              nav.lookIntoThePast ? null : (
                <Link
                  to={`/dashboard?start=${date.prevStartDate}`}
                  onClick={this.updateDatabaseLookup.bind(this, true)}
                >
                  <Icon type="left-circle" />
                </Link>
              )}
            </Col>
            <Col md={22} xs={20} className="nav-date-display">
              <Divider>{navLabel}</Divider>
            </Col>
            <Col md={1} xs={2} className="nav-next">
              {date.isThisWeek ||
              (timesheets &&
                timesheets.length === 0 &&
                !nav.lookIntoThePast) ? null : (
                <Link
                  to={`/dashboard?start=${date.nextStartDate}`}
                  onClick={this.updateDatabaseLookup.bind(this, false)}
                >
                  <Icon type="right-circle" />
                </Link>
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

DashboardTimesheetNav.propTypes = {
  updateDatabaseLookup: PropTypes.func.isRequired,
  timesheets: PropTypes.array.isRequired,
  date: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  date: state.date,
  nav: state.nav
});

export default connect(
  mapStateToProps,
  { updateDatabaseLookup }
)(DashboardTimesheetNav);
