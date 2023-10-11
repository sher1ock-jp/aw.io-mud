import {
  PlayersState,
  ReceivePlayersAction,
  RemoveAllPlayersAction,
  PlayerActions,
  ActionTypes,
} from "../types/playersTypes";

export const receivePlayers = (players: PlayersState): ReceivePlayersAction => ({
  type: ActionTypes.RECEIVE_PLAYERS,
  players,
});

export const removeAllPlayers = (): RemoveAllPlayersAction => ({
  type: ActionTypes.REMOVE_ALL_PLAYERS,
});

const initialState: PlayersState = {};

const playersReducer = (state = initialState, action: PlayerActions): PlayersState => {
  switch (action.type) {
    case ActionTypes.RECEIVE_PLAYERS:
      return action.players;
    case ActionTypes.REMOVE_ALL_PLAYERS:
      return initialState;
    default:
      return state;
  }
};

export default playersReducer;