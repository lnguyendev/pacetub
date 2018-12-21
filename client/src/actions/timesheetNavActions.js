import { UPDATE_DATABASE_LOOKUP } from './types';

export const updateDatabaseLookup = lookIntoThePast => dispatch => {
  dispatch({
    type: UPDATE_DATABASE_LOOKUP,
    payload: lookIntoThePast
  });
};
