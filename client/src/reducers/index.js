import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import timesheetReducer from './timesheetReducer';
import dateReducer from './dateReducer';
import navReducer from './navReducer';

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  timesheet: timesheetReducer,
  date: dateReducer,
  nav: navReducer
});
