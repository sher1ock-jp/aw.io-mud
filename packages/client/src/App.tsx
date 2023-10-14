import React from 'react';
import { useSelector } from 'react-redux';

import Splash from './Splash';
import Game from './Game';
import ControlPanel from './ControlPanel';

type GameState = {
  isPlaying: boolean;
};

type AppState = {
  gameState: GameState;
  controlPanel: any;
};

const App = () => {
  const gameState = useSelector<AppState, GameState>((state) => state.gameState);
  const { isPlaying } = gameState;

  return(
    <div>
      {isPlaying && <Game />}
      {!isPlaying && <Splash />}
      {isPlaying && <ControlPanel />}
      <div
        style={{
          fontFamily: 'Quicksand',
          fontWeight: 'bold',
          position: 'absolute',
          opacity: 0,
        }}
        />
    </div>
  );
}

export default App;