import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import { addTimesheet } from '../../actions/timesheetActions';

class TimesheetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      hours: '',
      descriptionPlaceholder: 'Task Description',
      hoursPlaceholder: 'Hours',
      errors: {}
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFocus(e) {
    if (e.target.name === 'description') {
      this.setState({
        descriptionPlaceholder: ''
      });
    } else if (e.target.name === 'hours') {
      this.setState({
        hoursPlaceholder: ''
      });
    }
  }

  onBlur(e) {
    if (e.target.name === 'description') {
      this.setState({
        descriptionPlaceholder: 'Task Description'
      });
    } else if (e.target.name === 'hours') {
      this.setState({
        hoursPlaceholder: 'Hours'
      });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const timesheetData = {
      description: this.state.description,
      hours: this.state.hours
    };

    this.props.addTimesheet(timesheetData);

    this.setState({
      description: '',
      hours: ''
    });
  }

  render() {
    const { errors } = this.props;
    const errorsContent = _.isEmpty(errors) ? null : (
      <ul className="task-form-error-container">
        {_.map(errors, error => (
          <li className="task-form-error-item" key={error}>
            <i className="fas fa-exclamation-circle" /> {error}
          </li>
        ))}
      </ul>
    );

    return (
      <div className="task-form-container">
        <div className="task-form-field-group">
          {!_.isEmpty(errors) && errorsContent}
          <form noValidate className="task-form" onSubmit={this.onSubmit}>
            <input
              type="text"
              placeholder={this.state.descriptionPlaceholder}
              name="description"
              className={classnames('task-inputs task-description-input', {
                'input-is-invalid': errors && errors.description
              })}
              value={this.state.description}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
            <input
              type="number"
              placeholder={this.state.hoursPlaceholder}
              name="hours"
              className={classnames('task-inputs task-hours-input', {
                'input-is-invalid': errors && errors.hours
              })}
              value={this.state.hours}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
            <button type="submit" className="btn-task">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

TimesheetForm.propTypes = {
  addTimesheet: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addTimesheet }
)(TimesheetForm);
