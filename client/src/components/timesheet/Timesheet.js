import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import classnames from 'classnames';
import { Collapse, Tag } from 'antd';
import CircularProgressbar from 'react-circular-progressbar';

import Tasks from './Tasks';

const Panel = Collapse.Panel;

class Timesheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goalHours: 8
    };
  }

  calculatePercentageAchieved(tasks) {
    const loggedHours = _.reduce(
      tasks,
      (sum, task) => {
        return sum + task.hours;
      },
      0
    );

    return (loggedHours / this.state.goalHours) * 100;
  }

  render() {
    const { timesheets, taskLoading } = this.props;

    const timesheetContent = _.map(timesheets, timesheet => {
      const dayOfWeek = moment(timesheet.dateFormatted).format('dddd');
      const dateFormat = moment(timesheet.dateFormatted).format('MM/DD/YYYY');
      const percentageAchieved = this.calculatePercentageAchieved(
        timesheet.tasks
      );

      const headerContent = (
        <div className="timesheet-header-container">
          <p className="timesheet-header-container-date">
            {dayOfWeek} - {dateFormat}
          </p>

          <div className="timesheet-progress-bar-container">
            {timesheet.isNew && <Tag color="#66B9BF">New</Tag>}
            <div className="timesheet-progress-bar">
              <CircularProgressbar
                initialAnimation={true}
                percentage={percentageAchieved}
                className="progress-bar-cir"
              />
            </div>
          </div>
        </div>
      );

      return (
        <Panel
          header={headerContent}
          key={timesheet._id}
          showArrow={false}
          className={classnames('', {
            'timesheet-panel-isnew': timesheet.isNew
          })}
        >
          <Tasks taskLoading={taskLoading} timesheet={timesheet} />
        </Panel>
      );
    });

    return (
      <div className="timesheet-container">
        <div className="timesheet-content">
          <Collapse
            defaultActiveKey={[timesheets.length > 0 ? timesheets[0]._id : '']}
          >
            {timesheetContent}
          </Collapse>
        </div>
      </div>
    );
  }
}

Timesheet.propTypes = {
  timesheets: PropTypes.array.isRequired,
  taskLoading: PropTypes.bool.isRequired
};

export default Timesheet;
