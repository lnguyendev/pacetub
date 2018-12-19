import { UPDATE_DATE } from '../actions/types';

const initialState = {
  currentStartDate: '',
  prevStartDate: '',
  nextStartDate: '',
  isThisWeek: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATE:
      return action.payload;
    default:
      return state;
  }
};
