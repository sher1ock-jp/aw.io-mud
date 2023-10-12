import { GenericAction } from "./commonTypes";
import { PlayerData } from "./DataTypes";

export interface PlayersState {
    [key: string]: PlayerData;
}

export enum ActionTypes {
    RECEIVE_PLAYERS = 'RECEIVE_PLAYERS',
    REMOVE_ALL_PLAYERS = 'REMOVE_ALL_PLAYERS',
}

export interface ReceivePlayersAction extends GenericAction<ActionTypes.RECEIVE_PLAYERS> {
    players: PlayersState;
}

export type RemoveAllPlayersAction = GenericAction<ActionTypes.REMOVE_ALL_PLAYERS>;

export type PlayerActions = ReceivePlayersAction | RemoveAllPlayersAction;