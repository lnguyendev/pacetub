import { GET_SUCCESS_MSG } from '../actions/types';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SUCCESS_MSG:
      return action.payload;
    default:
      return state;
  }
};
