import { UPDATE_DATABASE_LOOKUP } from '../actions/types';

const initialState = {
  lookIntoThePast: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATABASE_LOOKUP:
      return {
        ...state,
        lookIntoThePast: action.payload
      };
    default:
      return state;
  }
};
