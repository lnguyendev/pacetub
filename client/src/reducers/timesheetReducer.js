import {
  TIMESHEET_LOADING,
  GET_TIMESHEETS,
  ADD_TIMESHEET,
  MODIFY_TASK_LIST,
  REMOVE_TIMESHEET
} from '../actions/types';

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
    case MODIFY_TASK_LIST:
      return {
        ...state,
        timesheets: state.timesheets.map(timesheet => {
          if (timesheet._id === action.payload._id) {
            return {
              ...timesheet,
              ...action.payload
            };
          } else {
            return timesheet;
          }
        })
      };
    case REMOVE_TIMESHEET:
      return {
        ...state,
        timesheets: state.timesheets.filter(
          timesheet => timesheet._id !== action.payload
        )
      };
    default:
      return state;
  }
};
