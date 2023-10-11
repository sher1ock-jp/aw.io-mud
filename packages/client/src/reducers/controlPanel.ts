import {
    PlayerInfoState,
    NicknameActionTypes,
    SetNicknameAction,
    ResetNicknameAction,
    SetErrorAction,
    ResetErrorAction,
    NicknameActions,
} from '../types/controlPanelTypes';

const initialState: PlayerInfoState = {
    nickname: '',
    error: null,
};

export const setNickname = (name: string): SetNicknameAction => ({
    type: NicknameActionTypes.SET_NICKNAME,
    name,
});

export const resetNickname = (): ResetNicknameAction => ({
    type: NicknameActionTypes.RESET_NICKNAME,
});

export const setError = (error: string): SetErrorAction => ({
    type: NicknameActionTypes.SET_ERROR,
    error,
});

export const resetError = (): ResetErrorAction => ({
    type: NicknameActionTypes.RESET_ERROR,
});

export const startAsGuest = (name: string, socket: any) => (dispatch: any)  => {
    if(name){
        socket.emit('start_as_guest', name);
        dispatch(resetError());
    } else {
        dispatch(setError('Please enter a name.'));
    }
};

const reducer = (state = initialState, action: NicknameActions): PlayerInfoState => {
    switch(action.type){
    case NicknameActionTypes.SET_NICKNAME:
        return { ...state, nickname: action.name };
    case NicknameActionTypes.RESET_NICKNAME:
        return { ...state, nickname: '' };
    case NicknameActionTypes.SET_ERROR:
        return { ...state, error: action.error };
    case NicknameActionTypes.RESET_ERROR:
        return { ...state, error: null };
    default:
        return state;
    }
  };
  
  export default reducer;



