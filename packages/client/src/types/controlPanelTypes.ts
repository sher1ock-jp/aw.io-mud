import { GenericAction } from "./commonTypes";

export type PlayerInfoState = {
    error: string | null;
    nickname: string;
};

export enum NicknameActionTypes {
    SET_NICKNAME = 'SET_NICKNAME',
    RESET_NICKNAME = 'RESET_NICKNAME',
    SET_ERROR = 'SET_ERROR',
    RESET_ERROR = 'RESET_ERROR',
}

export interface SetNicknameAction extends GenericAction<NicknameActionTypes.SET_NICKNAME> {
    name: string;
}

export type ResetNicknameAction = GenericAction<NicknameActionTypes.RESET_NICKNAME>;

export interface SetErrorAction extends GenericAction<NicknameActionTypes.SET_ERROR> {
    error: string;
}

export type ResetErrorAction = GenericAction<NicknameActionTypes.RESET_ERROR>;

export type NicknameActions = SetNicknameAction | ResetNicknameAction | SetErrorAction | ResetErrorAction;