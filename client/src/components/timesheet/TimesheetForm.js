import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Form, Row, Col, Input, Slider, InputNumber, Icon, Button } from 'antd';

import { addTimesheet } from '../../actions/timesheetActions';

const FormItem = Form.Item;
const { TextArea } = Input;

function formatter(value) {
  return `${value} hours`;
}

class TimesheetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      hours: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onHoursChange = this.onHoursChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        errors: { ...this.props.errors }
      });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onHoursChange = value => {
    if (Number.isNaN(value)) {
      return;
    }

    this.setState({
      hours: value > 0 ? value : ''
    });
  };

  onSubmit(e) {
    e.preventDefault();

    const timesheetData = {
      description: this.state.description,
      hours: this.state.hours.toString()
    };

    this.props.addTimesheet(timesheetData);

    this.setState({
      description: '',
      hours: ''
    });
  }

  render() {
    const { errors } = this.state;
    const iconColor = errors && errors.hours ? '#f5222d' : '#ababab';

    return (
      <div className="task-form-container">
        <div className="task-form-field-group">
          <Form noValidate className="task-form" onSubmit={this.onSubmit}>
            <Row gutter={16}>
              <Col sm={24} md={12} lg={12} xl={12}>
                <FormItem
                  hasFeedback
                  validateStatus={errors && errors.description ? 'error' : null}
                  help={errors.description && errors.description}
                >
                  <TextArea
                    placeholder="Task Description"
                    name="description"
                    className={classnames('', {
                      'input-is-invalid': errors && errors.description
                    })}
                    value={this.state.description}
                    onChange={this.onChange}
                    rows={4}
                    autosize={{ minRows: 4, maxRows: 4 }}
                  />
                </FormItem>
              </Col>
              <Col sm={24} md={12} lg={12} xl={12}>
                <Row>
                  <Col xs={19} sm={20} md={19} lg={20} xl={20}>
                    <FormItem
                      validateStatus={errors && errors.hours ? 'error' : null}
                      help={errors.hours && errors.hours}
                    >
                      <div className="icon-wrapper">
                        <Icon
                          type="clock-circle"
                          style={{ color: iconColor }}
                        />
                        <Slider
                          min={0}
                          max={24}
                          name="hours"
                          onChange={this.onHoursChange}
                          value={
                            typeof this.state.hours === 'number'
                              ? this.state.hours
                              : 0
                          }
                          step={0.5}
                          tipFormatter={formatter}
                        />
                      </div>
                    </FormItem>
                  </Col>
                  <Col xs={5} sm={4} md={5} lg={4} xl={4}>
                    <FormItem
                      hasFeedback
                      validateStatus={errors && errors.hours ? 'error' : null}
                    >
                      <InputNumber
                        placeholder="Hours"
                        min={0}
                        max={24}
                        step={0.5}
                        value={this.state.hours}
                        onChange={this.onHoursChange}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Button
                      htmlType="submit"
                      type="primary"
                      block
                      style={{ marginTop: -2 }}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
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
