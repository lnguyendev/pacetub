import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getTimesheets } from '../../actions/timesheetActions';
import Spinner from '../common/Spinner';

class Timesheet extends Component {
  componentDidMount() {
    this.props.getTimesheets();
  }

  render() {
    const { timesheets, loading } = this.props.timesheet;
    let timesheetContent;

    if (timesheets === null || loading) {
      timesheetContent = <Spinner />;
    } else {
      timesheetContent = <h1>{timesheets.length}</h1>;
    }

    return <div>{timesheetContent}</div>;
  }
}

Timesheet.propTypes = {
  getTimesheets: PropTypes.func.isRequired,
  timesheet: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  timesheet: state.timesheet
});

export default connect(
  mapStateToProps,
  { getTimesheets }
)(Timesheet);
