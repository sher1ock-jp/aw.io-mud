import { ChangeEvent, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux'; 
import socket from '../socket';

import {
  setNickname, startAsGuest, startGame, stopGame,
} from '../reducers/gameState';

import { GameState } from '../types/gameStateTypes';
import { PlayerData } from '../types/DataTypes';
import { PlayerInfoState } from '../types/controlPanelTypes';

interface RootState {
    gameState: GameState;
    players: PlayerData;  
    controlPanel: PlayerInfoState; 
}

const Splash = () => {
    const dispatch = useDispatch<ThunkDispatch<GameState, unknown, AnyAction>>();

    const gameState = useSelector((state: RootState) => state.gameState);

    const { nickname } = gameState;

    const updateNickname = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setNickname(e.target.value));
    }

    const play = () => {
        if(nickname.trim()){
            dispatch(startGame());
            dispatch(startAsGuest(nickname, socket));
        }
    };

    const playEnter = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter' && nickname.trim()) {
          dispatch(startGame());
          dispatch(startAsGuest(nickname, socket));
        }
    };

    // const leave = () => {
    //     dispatch(stopGame());
    // };

    return (
        <div id="splash">
          <div id="title">aw.io</div>
            <div className="input-field">
                <input
                    value={nickname}
                    onChange={updateNickname}
                    onKeyDown={playEnter}
                    maxLength={15}
                    type="text"
                    id="name-box"
                    placeholder="nickname"
                    autoFocus
                />
                <button
                    className="Buttons"
                    type="submit"
                    style={nickname.trim() ? { color: 'white' } : { display: 'none' }}
                    onClick={play}
                    id="play-box"
                >
                    play
                </button>
                </div>
            </div>
      );
}

export default Splash;

