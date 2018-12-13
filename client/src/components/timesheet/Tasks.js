import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { Timeline } from 'antd';
import { removeTask } from '../../actions/timesheetActions';

const TimelineItem = Timeline.Item;
const checkIcon = 'far fa-check-circle';
const removeIcon = 'far fa-times-circle';

class Tasks extends Component {
  onMouseEnter(e) {
    e.target.setAttribute('class', removeIcon);
  }

  onMouseLeave(e) {
    e.target.setAttribute('class', checkIcon);
  }

  handleTaskRemove(timesheet, taskId) {
    if (timesheet.tasks.length === 1) {
      if (
        window.confirm(
          'Removing this task will remove the entire timesheet. Are you sure you want to continue?'
        )
      ) {
        this.props.removeTask(timesheet._id, taskId);
      }
    } else {
      this.props.removeTask(timesheet._id, taskId);
    }
  }

  render() {
    const { timesheet, taskLoading } = this.props;
    const tasks = timesheet.tasks;
    const timelinePending =
      moment().format('MM/DD/YYYY') ===
      moment(timesheet.date).format('MM/DD/YYYY');

    const taskItemContent = _.map(tasks, task => {
      return (
        <TimelineItem
          key={task._id}
          dot={
            <i
              className="far fa-check-circle"
              onMouseEnter={this.onMouseEnter.bind(this)}
              onMouseLeave={this.onMouseLeave.bind(this)}
              onClick={this.handleTaskRemove.bind(this, timesheet, task._id)}
              style={{ fontSize: '20px' }}
            />
          }
        >
          <div className="task-item-text-container">
            <p className="task-item-description">
              <strong>{task.description}</strong>
            </p>
            <p className="task-item-hours">
              <strong>{task.hours}</strong> hours
            </p>
          </div>
        </TimelineItem>
      );
    });

    return taskLoading && timelinePending ? (
      <Timeline pending="Adding task...">{taskItemContent}</Timeline>
    ) : (
      <Timeline>{taskItemContent}</Timeline>
    );
  }
}

Tasks.propTypes = {
  removeTask: PropTypes.func.isRequired,
  timesheet: PropTypes.object.isRequired,
  taskLoading: PropTypes.bool.isRequired
};

export default connect(
  null,
  { removeTask }
)(Tasks);
