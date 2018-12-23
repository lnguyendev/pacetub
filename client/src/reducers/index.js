import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import timesheetReducer from './timesheetReducer';
import dateReducer from './dateReducer';
import navReducer from './navReducer';
import successReducer from './successReducer';

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  timesheet: timesheetReducer,
  date: dateReducer,
  nav: navReducer,
  success: successReducer
});
