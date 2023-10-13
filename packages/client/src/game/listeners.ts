import store from '../store';
import { attachFood, attachPlayer } from './utils';

import { setError } from '../reducers/controlPanel';
import { receivePlayers } from '../reducers/players';
import { receiveFood, receiveMultipleFood, removeFood } from '../reducers/food';
import { ateSomeone, fell, lose } from '../reducers/gameState';
import { receiveMessage } from '../reducers/messages';
import { casualtyReport } from '../reducers/casualty';

import { PlayersState } from '../types/playersTypes';
import { FoodState } from '../types/foodTypes';
import { FoodData } from '../types/DataTypes';
import { PlayerData } from '../types/DataTypes';
import { Message } from '../types/messageTypes';

import {
  animate, init, scene, world,
} from './main';
import { Player } from './player';
import { Food } from './food';

type Socket = {
  id: string;
  on: (event: string, callback: (...args: any[]) => void) => void;
};

const socketHandler = (socket: Socket) => {
  socket.on('player_data', (state: PlayersState) => {
    store.dispatch(receivePlayers(state));
  });

  socket.on('food_data', (state: FoodState) => {
    store.dispatch(receiveMultipleFood(state));
  });

  socket.on('start_fail', (err: Error) => {
    store.dispatch(setError(err.message));
  });

  socket.on('start_game', () => {
    const state = store.getState();
    if (state.gameState.isInitialized === false) {
      init();
    }
    requestAnimationFrame(animate);
  });

  socket.on('add_player', (id: string, initialData: PlayerData) => {
    const isMainPlayer = id === socket.id;
    const player = new Player(id, initialData, isMainPlayer);
    player.init();
  });

  socket.on('remove_player', (id: string, eaterId?: string, eaterData?: PlayerData, eatenData?: PlayerData) => {
    const playerObject = scene.getObjectByName(id);
    if (eaterId && eaterId === socket.id) {
      // Assuming Sound.play returns a promise. If not, ignore.
    //   createjs.Sound.play('eatPlayerSound').catch(err => console.error(err));
    //   createjs.Sound.play('eatSound').catch(err => console.error(err));
      store.dispatch(ateSomeone(playerObject.nickname));
    }
    if (playerObject) {
      if (eaterId && eaterData && eatenData) {
        attachPlayer(id, eaterId, eaterData, eatenData);
        console.log(eaterId, eaterData, eatenData);
      }
      world.remove(playerObject.cannon);
      scene.remove(playerObject.sprite);
      scene.remove(playerObject);
      const { children } = playerObject.children[0];
      for (const child of children) scene.remove(child);
    }
  });

  socket.on('add_food', (id: string, data: FoodData) => {
    const stringId = id.toString();
    const food = new Food(stringId, data);
    food.init();
    store.dispatch(receiveFood(stringId, data));
  });

  socket.on('remove_food', (id: string, playerId: string, playerData: PlayerData) => {
    attachFood(id, playerId, playerData);
    store.dispatch(removeFood(id));

    if (playerId === socket.id) {
    //   createjs.Sound.play('eatSound').catch(err => console.error(err));
    }
  });

  socket.on('you_got_eaten', (eater: string) => {
    // createjs.Sound.play('eatSound').catch(err => console.error(err));
    store.dispatch(lose(eater));
  });

  socket.on('you_fell', (fallenWorld: any) => {
    store.dispatch(fell(fallenWorld));
  });

  socket.on('add_message', (message: Message) => {
    store.dispatch(receiveMessage(message));
  });

  socket.on('casualty_report', (eaterNick: string, eatenNick: string) => {
    store.dispatch(casualtyReport(eaterNick.slice(0, 14), eatenNick.slice(0, 14)));
  });
};

export default socketHandler;
