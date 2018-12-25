import axios from 'axios';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import {
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_SUCCESS_MSG,
  SET_CURRENT_USER
} from './types';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/auth/register', userData)
    .then(res => {
      history.push('/');
      dispatch({
        type: GET_SUCCESS_MSG,
        payload: 'Register successfully'
      });
      dispatch({
        type: CLEAR_ERRORS
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const loginUser = userData => dispatch => {
  axios
    .post('/auth/login', userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);

      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      dispatch({
        type: CLEAR_ERRORS
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const sendResetPasswordEmail = userData => dispatch => {
  axios
    .post('/auth/forgot-password', userData)
    .then(res => {
      if (res.data.hasOwnProperty('emailsent')) {
        dispatch({
          type: GET_SUCCESS_MSG,
          payload: res.data.emailsent
        });
      }
      dispatch({
        type: CLEAR_ERRORS
      });
    })
    .catch(err => {
      if (err.response) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    });
};

export const checkResetPasswordToken = token => dispatch => {
  axios
    .get(`/auth/reset-password/${token}`)
    .then(res => {
      if (res.data.hasOwnProperty('success')) {
        dispatch({
          type: GET_SUCCESS_MSG,
          payload: res.data.success
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

export const resetPassword = (userData, token) => dispatch => {
  axios
    .put(`/auth/reset-password/${token}`, userData)
    .then(res => {
      if (res.data.hasOwnProperty('success')) {
        dispatch({
          type: GET_SUCCESS_MSG,
          payload: res.data.success
        });
        dispatch({
          type: CLEAR_ERRORS
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

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = history => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));

  if (history) {
    history.push('/');
  }
};

export const clearSuccess = () => dispatch => {
  dispatch({
    type: GET_SUCCESS_MSG,
    payload: ''
  });
};
