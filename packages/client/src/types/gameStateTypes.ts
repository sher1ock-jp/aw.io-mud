import { GenericAction } from './commonTypes';

export type GameState = {
    isPlaying: boolean;
    isChatting: boolean;
    nickname: string;
    world: string;
    status: string;
    error: string | null;
    isInitialized: boolean;
};

export enum GameActionTypes {
    START_GAME = 'START_GAME',
    STOP_GAME = 'STOP_GAME',
    INITIALIZED = 'INITIALIZED',
    START_CHAT = 'START_CHAT',
    STOP_CHAT = 'STOP_CHAT',
    SET_NICKNAME = 'SET_NICKNAME',
    SET_WORLD = 'SET_WORLD',
    SET_ERROR = 'SET_ERROR',
    RESET_ERROR = 'RESET_ERROR',
    HIDE_INSTRUCTIONS = 'HIDE_INSTRUCTIONS',
    LOSE = 'LOSE',
    CONTINUE = 'CONTINUE',
    ATE = 'ATE',
    FELL = 'FELL'
}

export type StartGameAction = GenericAction<GameActionTypes.START_GAME>

export type StopGameAction = GenericAction<GameActionTypes.STOP_GAME>

export type InitializedAction = GenericAction<GameActionTypes.INITIALIZED>

export type StartChatAction = GenericAction<GameActionTypes.START_CHAT>

export type StopChatAction = GenericAction<GameActionTypes.STOP_CHAT>

export interface SetNicknameAction extends GenericAction<GameActionTypes.SET_NICKNAME> {
    nickname: string;
}

export interface SetWorldAction extends GenericAction<GameActionTypes.SET_WORLD> {
    world: string;
}

export interface SetErrorAction extends GenericAction<GameActionTypes.SET_ERROR> {
    error: string;
}

export type ResetErrorAction = GenericAction<GameActionTypes.RESET_ERROR>

export type HideInstructionsAction = GenericAction<GameActionTypes.HIDE_INSTRUCTIONS>

export interface LoseAction extends GenericAction<GameActionTypes.LOSE> {
    eater: string;
}

export type ContinueAction = GenericAction<GameActionTypes.CONTINUE>

export type AteAction = GenericAction<GameActionTypes.ATE>

export interface FellAction extends GenericAction<GameActionTypes.FELL> {
    world: string;
}

export interface AteSomeoneAction extends GenericAction<GameActionTypes.ATE> {
    eater: string;
}

export type GameActions = StartGameAction | StopGameAction | InitializedAction | StartChatAction | StopChatAction | SetNicknameAction | SetWorldAction | SetErrorAction | ResetErrorAction | HideInstructionsAction | LoseAction | ContinueAction | AteAction | FellAction | AteSomeoneAction;