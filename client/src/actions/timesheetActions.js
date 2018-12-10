import axios from 'axios';

import {
  CLEAR_ERRORS,
  GET_ERRORS,
  TIMESHEET_LOADING,
  GET_TIMESHEETS,
  ADD_TIMESHEET,
  ADD_TASK
} from './types';

export const getTimesheets = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setTimesheetLoading());

  axios
    .get('api/timesheet')
    .then(res =>
      dispatch({
        type: GET_TIMESHEETS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TIMESHEETS,
        payload: null
      })
    );
};

export const addTimesheet = timesheetData => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/timesheet', timesheetData)
    .then(res => {
      if (res.data.tasks.length > 1) {
        dispatch({
          type: ADD_TASK,
          payload: {
            timesheetId: res.data._id,
            task: res.data.tasks[0]
          }
        });
      } else {
        dispatch({
          type: ADD_TIMESHEET,
          payload: res.data
        });
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setTimesheetLoading = () => {
  return {
    type: TIMESHEET_LOADING
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
