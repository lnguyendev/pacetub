import {
  TIMESHEET_LOADING,
  GET_TIMESHEETS,
  ADD_TIMESHEET,
  ADD_TASK
} from '../actions/types';
import _ from 'lodash';

const initialState = {
  timesheets: [],
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TIMESHEET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TIMESHEETS:
      return {
        ...state,
        timesheets: action.payload,
        loading: false
      };
    case ADD_TIMESHEET:
      return {
        ...state,
        timesheets: [action.payload, ...state.timesheets]
      };
    case ADD_TASK:
      return {
        ...state,
        timesheets: _.forEach(state.timesheets, timesheet => {
          if (timesheet._id === action.payload.timesheetId) {
            timesheet.tasks.push(action.payload.task);
          }
        })
      };
    default:
      return state;
  }
};
