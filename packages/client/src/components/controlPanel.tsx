import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';
import { removeAllFood } from '../reducers/food';
import { stopGame } from '../reducers/gameState';

import { GameState } from '../types/gameStateTypes';
import { PlayerData } from '../types/DataTypes';
import { PlayerInfoState } from '../types/controlPanelTypes';

interface RootState {
  gameState: GameState;
  players: PlayerData;  
  controlPanel: PlayerInfoState; 
}

const ControlPanel = () => {
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players);

  const leave = () => {
    console.log('exit app');
    dispatch(stopGame());
    dispatch(removeAllFood());
    socket.emit('leave');
  };

  return (
    <div style={{
      position: 'absolute',
      zIndex: 1,
      right: '10px',
      top: '10px',
    }}
    >
      <div className="card-content white-text">
        <button
          className="btn-floating"
          onClick={leave}
        >
          <i className="material-icons">exit_to_app</i>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
