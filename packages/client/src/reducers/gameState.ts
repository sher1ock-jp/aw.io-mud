import { Dispatch } from 'redux';

type GameState = {
    isPlaying: boolean;
    isChatting: boolean;
    nickname: string;
    world: string;
    status: string;
    error: string | null;
    isInitialized: boolean;
};

const initialState: GameState = {
    isPlaying: false,
    isChatting: false,
    nickname: '',
    world: '',
    status: '',
    error: null,
    isInitialized: false,
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

interface StartGameAction {
    type: GameActionTypes.START_GAME;
}

interface StopGameAction {
    type: GameActionTypes.STOP_GAME;
}

interface InitializedAction {
    type: GameActionTypes.INITIALIZED;
}

interface StartChatAction {
    type: GameActionTypes.START_CHAT;
}

interface StopChatAction {
    type: GameActionTypes.STOP_CHAT;
}

interface SetNicknameAction {
    type: GameActionTypes.SET_NICKNAME;
    text: string;
}

interface SetWorldAction {
    type: GameActionTypes.SET_WORLD;
    text: string;
}

interface SetErrorAction {
    type: GameActionTypes.SET_ERROR;
    error: string;
}

interface ResetErrorAction {
    type: GameActionTypes.RESET_ERROR;
}

interface HideInstructionsAction {
    type: GameActionTypes.HIDE_INSTRUCTIONS;
}

interface LoseAction {
    type: GameActionTypes.LOSE;
    eater: string;
}


interface ContinueAction {
    type: GameActionTypes.CONTINUE;
}

interface AteAction {
    type: GameActionTypes.ATE;
}

interface FellAction {
    type: GameActionTypes.FELL;
    world: string;
}


interface AteSomeoneAction {
    type: GameActionTypes.ATE;
    eater: string;
}

type GameActions = StartGameAction | StopGameAction | InitializedAction | StartChatAction | StopChatAction | SetNicknameAction | SetWorldAction | SetErrorAction | ResetErrorAction | HideInstructionsAction | LoseAction | ContinueAction | AteAction | FellAction | AteSomeoneAction;

export const startGame = (): StartGameAction => ({
    type: GameActionTypes.START_GAME,
});

export const stopGame = (): StopGameAction => ({
    type: GameActionTypes.STOP_GAME,
});

export const initialized = (): InitializedAction => ({
    type: GameActionTypes.INITIALIZED,
});

export const startChat = (): StartChatAction => ({
    type: GameActionTypes.START_CHAT,
});

export const stopChat = (): StopChatAction => ({
    type: GameActionTypes.STOP_CHAT,
});

export const setNickname = (text: string): SetNicknameAction => ({
    type: GameActionTypes.SET_NICKNAME,
    text,
});

export const setWorld = (text: string): SetWorldAction => ({
    type: GameActionTypes.SET_WORLD,
    text,
});

export const setError = (error: string): SetErrorAction => ({
    type: GameActionTypes.SET_ERROR,
    error,
});

export const resetError = (): ResetErrorAction => ({
    type: GameActionTypes.RESET_ERROR,
});

export const hideInstructions = (): HideInstructionsAction => ({
    type: GameActionTypes.HIDE_INSTRUCTIONS,
});

export const lose = (eater: string): LoseAction => ({
    type: GameActionTypes.LOSE,
    eater: eater.length > 15 ? `${eater.slice(0, 14)}...` : eater,
});

export const continueGame = (): ContinueAction => ({
    type: GameActionTypes.CONTINUE,
});

export const ate = (): AteAction => ({
    type: GameActionTypes.ATE,
});

export const fell = (world: string): FellAction => ({
    type: GameActionTypes.FELL,
    world
});

export const ateSomeone = (eater: string): AteSomeoneAction => ({
    type: GameActionTypes.ATE,
    eater: eater.length > 15 ? `${eater.slice(0, 14)}...` : eater,
});

export const startAsGuest = (nickname: string, socket: any) => (dispatch: Dispatch) => {
    if (nickname) {
      socket.emit('start_as_guest', { nickname });
      dispatch(resetError());
    } else {
      dispatch(setError('Please enter a nickname'));
    }
};

export const focusOnChat = (node: any) => (dispatch: Dispatch) => {
    node.focus();
    dispatch(startChat());
}

export const blurChat = (node: any) => (dispatch: Dispatch) => {
    node.blur();
    dispatch(stopChat());
}

export default (state = initialState, action: GameActions): GameState => {
    switch(action.type) {
        case GameActionTypes.START_GAME:
            return {
                ...state,
                isPlaying: true,
            };
        case GameActionTypes.STOP_GAME:
            return {
                ...state,
                isPlaying: false,
            };
        case GameActionTypes.INITIALIZED:
            return {
                ...state,
                isInitialized: true,
            };
        case GameActionTypes.START_CHAT:
            return {
                ...state,
                isChatting: true,
            };
        case GameActionTypes.STOP_CHAT:
            return {
                ...state,
                isChatting: false,
            };
        case GameActionTypes.SET_NICKNAME:
            return {
                ...state,
                nickname: action.text,
            };
        case GameActionTypes.SET_WORLD:
            return {
                ...state,
                world: action.text,
            };
        case GameActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case GameActionTypes.RESET_ERROR:
            return {
                ...state,
                error: null,
            };
        case GameActionTypes.HIDE_INSTRUCTIONS:
            return {
                ...state,
                status: '',
            };
        case GameActionTypes.LOSE:
            return {
                ...state,
                status: `${action.eater} rolled you up`,
            };
        case GameActionTypes.FELL:
            return {
                ...state,
                status: `you left ${action.world}'s orbit`,
            };
        case GameActionTypes.CONTINUE:
            return {
                ...state,
                status: '',
            };
        case GameActionTypes.ATE:
        default:
            return state;
    }
}

