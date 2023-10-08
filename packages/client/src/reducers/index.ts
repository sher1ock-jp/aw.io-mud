import { combineReducers } from 'redux';
import auth from './auth';
import abilities from './abilities';
// import casuality from './casuality';

export default combineReducers({
  auth,
  abilities,
//   casuality,
});
