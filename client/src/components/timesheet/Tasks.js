import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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

  handleTaskRemove(timesheetId, taskId) {
    this.props.removeTask(timesheetId, taskId);
  }

  render() {
    const { timesheet } = this.props;
    const tasks = timesheet.tasks;

    const taskItemContent = _.map(tasks, task => {
      return (
        <TimelineItem
          key={task._id}
          dot={
            <i
              className="far fa-check-circle"
              onMouseEnter={this.onMouseEnter.bind(this)}
              onMouseLeave={this.onMouseLeave.bind(this)}
              onClick={this.handleTaskRemove.bind(
                this,
                timesheet._id,
                task._id
              )}
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

    return <Timeline>{taskItemContent}</Timeline>;
  }
}

Tasks.propTypes = {
  removeTask: PropTypes.func.isRequired,
  timesheet: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { removeTask }
)(Tasks);
