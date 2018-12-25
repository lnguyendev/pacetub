import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { updateDatabaseLookup } from '../../actions/timesheetNavActions';

import { Row, Col, Tooltip } from 'antd';

const validDateFormat = 'MM-DD-YYYY';
const dateFormat = 'MMM DD, YYYY';

class DashboardTimesheetNav extends Component {
  updateDatabaseLookup(val) {
    this.props.updateDatabaseLookup(val);
  }

  render() {
    const { date, timesheets, nav } = this.props;
    const startDate = moment(date.currentStartDate, validDateFormat).format(
      dateFormat
    );
    const endDate = moment(date.currentStartDate, validDateFormat)
      .endOf('week')
      .format(dateFormat);

    const navLabel = date.isThisWeek
      ? 'Current Week'
      : `${startDate} - ${endDate}`;

    return (
      <div className="dashboard-timesheet-nav-container">
        <div className="dashboard-timesheet-nav">
          <Row>
            <Col span={20} className="nav-date-display">
              {navLabel}
            </Col>
            <Col span={4}>
              <div className="nav-btn-container">
                <div className="nav-previous">
                  {timesheets &&
                  timesheets.length === 0 &&
                  nav.lookIntoThePast ? (
                    <i className="fas fa-angle-left disabled-icon" />
                  ) : (
                    <Tooltip title="Previous Week">
                      <Link
                        to={`/dashboard?start=${date.prevStartDate}`}
                        onClick={this.updateDatabaseLookup.bind(this, true)}
                      >
                        <i className="fas fa-angle-left" />
                      </Link>
                    </Tooltip>
                  )}
                </div>
                <div className="nav-next">
                  {date.isThisWeek ||
                  (timesheets &&
                    timesheets.length === 0 &&
                    !nav.lookIntoThePast) ? (
                    <i className="fas fa-angle-right disabled-icon" />
                  ) : (
                    <Tooltip title="Next Week">
                      <Link
                        to={`/dashboard?start=${date.nextStartDate}`}
                        onClick={this.updateDatabaseLookup.bind(this, false)}
                      >
                        <i className="fas fa-angle-right" />
                      </Link>
                    </Tooltip>
                  )}
                </div>
              </div>
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
  date: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  date: state.date,
  nav: state.nav
});

export default connect(
  mapStateToProps,
  { updateDatabaseLookup }
)(DashboardTimesheetNav);
