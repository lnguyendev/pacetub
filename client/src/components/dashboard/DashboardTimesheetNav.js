import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Row, Col, Icon, Divider } from 'antd';

const dateFormat = 'MM/DD/YYYY';

class DashboardTimesheetNav extends Component {
  render() {
    const { date, timesheets } = this.props;
    const startDate = moment(date.currentStartDate).format(dateFormat);
    const endDate = moment(date.currentStartDate)
      .endOf('week')
      .format(dateFormat);

    return (
      <div className="dashboard-timesheet-nav-container">
        <div className="dashboard-timesheet-nav">
          <Row>
            <Col span={2} className="nav-previous">
              {timesheets && timesheets.length > 0 ? (
                <Link to={`/dashboard?start=${date.prevStartDate}`}>
                  <Icon type="left-circle" />
                </Link>
              ) : null}
            </Col>
            <Col span={20} className="nav-date-display">
              <Divider>
                {startDate} - {endDate}
              </Divider>
            </Col>
            <Col span={2} className="nav-next">
              {!date.isThisWeek ? (
                <Link to={`/dashboard?start=${date.nextStartDate}`}>
                  <Icon type="right-circle" />
                </Link>
              ) : null}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

DashboardTimesheetNav.propTypes = {
  timesheets: PropTypes.array.isRequired,
  date: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  date: state.date
});

export default connect(mapStateToProps)(DashboardTimesheetNav);
