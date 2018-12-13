import axios from 'axios';

import {
  CLEAR_ERRORS,
  GET_ERRORS,
  TIMESHEET_LOADING,
  TASK_LOADING,
  GET_TIMESHEETS,
  ADD_TIMESHEET,
  MODIFY_TASK_LIST,
  REMOVE_TIMESHEET
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
  dispatch(setTaskLoading());
  axios
    .post('/api/timesheet', timesheetData)
    .then(res => {
      if (res.data.tasks.length > 1) {
        dispatch({
          type: MODIFY_TASK_LIST,
          payload: res.data
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

export const removeTask = (timesheetId, taskId) => dispatch => {
  dispatch(clearErrors());
  axios
    .delete(`api/timesheet/${timesheetId}/task/${taskId}`)
    .then(res => {
      if (res.data.hasOwnProperty('timesheetdelete')) {
        dispatch({
          type: REMOVE_TIMESHEET,
          payload: timesheetId
        });
      } else {
        dispatch({
          type: MODIFY_TASK_LIST,
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

export const setTaskLoading = () => {
  return {
    type: TASK_LOADING
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
