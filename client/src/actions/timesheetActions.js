import axios from 'axios';
import moment from 'moment';

import {
  CLEAR_ERRORS,
  GET_ERRORS,
  TIMESHEET_LOADING,
  TASK_LOADING,
  TASK_NOT_LOADING,
  GET_TIMESHEETS,
  ADD_TIMESHEET,
  MODIFY_TASK_LIST,
  REMOVE_TIMESHEET,
  UPDATE_DATE,
  UPDATE_DATABASE_LOOKUP
} from './types';

const dateFormat = 'MM-DD-YYYY';

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
        payload: []
      })
    );
};

export const getWeekRangeTimesheets = (startDate, history) => (
  dispatch,
  getState
) => {
  if (!moment(startDate, dateFormat).isValid()) {
    history.replace('/not-found');
  }

  dispatch(clearErrors());
  dispatch(setTimesheetLoading());
  dispatch(updateDate(startDate));

  const { lookIntoThePast } = getState().nav;
  const { isThisWeek } = getState().date;

  axios
    .get(`api/timesheet/${startDate}?lookIntoThePast=${lookIntoThePast}`)
    .then(res => {
      if (res.data.hasOwnProperty('startDate') && !isThisWeek) {
        history.replace(`/dashboard?start=${res.data.startDate}`);
      } else if (res.data.hasOwnProperty('startDate') && isThisWeek) {
        dispatch({
          type: UPDATE_DATABASE_LOOKUP,
          payload: false
        });
        dispatch({
          type: GET_TIMESHEETS,
          payload: []
        });
      } else {
        if (
          Array.isArray(res.data) &&
          res.data.length === 0 &&
          !isThisWeek &&
          !lookIntoThePast
        ) {
          history.replace('/dashboard');
        } else {
          dispatch({
            type: GET_TIMESHEETS,
            payload: res.data
          });
        }
      }
    })
    .catch(err => {
      dispatch({
        type: GET_TIMESHEETS,
        payload: []
      });
    });
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
          payload: {
            ...res.data,
            isNew: true
          }
        });
      }
    })
    .catch(err => {
      dispatch(unsetTaskLoading());
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
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

export const unsetTaskLoading = () => {
  return {
    type: TASK_NOT_LOADING
  };
};

export const updateDate = startDate => {
  return {
    type: UPDATE_DATE,
    payload: getDates(startDate)
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const getDates = startDate => {
  const thisWeek = moment()
    .startOf('week')
    .format(dateFormat);

  const currentStartDate = startDate ? startDate : thisWeek;

  const prevStartDate = moment(currentStartDate, dateFormat)
    .subtract(1, 'w')
    .format(dateFormat);

  const nextStartDate = moment(currentStartDate, dateFormat)
    .add(1, 'w')
    .format(dateFormat);

  const isThisWeek = currentStartDate === thisWeek;

  return {
    currentStartDate,
    prevStartDate,
    nextStartDate,
    isThisWeek
  };
};
