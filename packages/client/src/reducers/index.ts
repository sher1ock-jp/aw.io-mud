import { combineReducers } from 'redux';
import auth from './auth';
import abilities from './abilities';
import casualty from './casualty';
import controlPanel from './controlPanel';
import gameState from './gameState';
import message from './message';
import players from './players';

export default combineReducers({
  auth,
  abilities,
  casualty,
  controlPanel,
  gameState,
  message,
  players,
});
