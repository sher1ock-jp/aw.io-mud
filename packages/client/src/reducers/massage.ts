type Message = {
    id: number;
    text: string;
};

const initialState: Message[] = [];

export enum MassageActionTypes {
    RECEIVE_MESSAGES = 'RECEIVE_MESSAGES',
    RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
    REMOVE_MESSAGE = 'REMOVE_MESSAGE',
    REMOVE_ALL_MESSAGES = 'REMOVE_ALL_MESSAGES'
}

interface ReceiveMessagesAction {
    type: MassageActionTypes.RECEIVE_MESSAGES;
    messages: Message[];
}

interface ReceiveMessageAction {
    type: MassageActionTypes.RECEIVE_MESSAGE;
    message: Message;
}

interface RemoveMessageAction {
    type: MassageActionTypes.REMOVE_MESSAGE;
    id: number;
}

interface RemoveAllMessagesAction {
    type: MassageActionTypes.REMOVE_ALL_MESSAGES;
}

type MassageAction = ReceiveMessagesAction | ReceiveMessageAction | RemoveMessageAction | RemoveAllMessagesAction;

export const receiveMessages = (messages: Message[]): MassageAction => ({
    type: MassageActionTypes.RECEIVE_MESSAGES,
    messages
});

export const receiveMessage = (message: Message): MassageAction => ({
    type: MassageActionTypes.RECEIVE_MESSAGE,
    message
});

export const removeMessage = (id: number): MassageAction => ({
    type: MassageActionTypes.REMOVE_MESSAGE,
    id
});

export const removeAllMessages = (): MassageAction => ({
    type: MassageActionTypes.REMOVE_ALL_MESSAGES
});

export default (state = initialState, action: MassageAction): Message[] => {
    switch(action.type) {
        case MassageActionTypes.RECEIVE_MESSAGES:
            return action.messages;
        case MassageActionTypes.RECEIVE_MESSAGE:
            return [...state, action.message];
        case MassageActionTypes.REMOVE_MESSAGE:
            return [...state.slice(0, action.id), ...state.slice(action.id + 1)];
        case MassageActionTypes.REMOVE_ALL_MESSAGES:
            return initialState;
        default:
            return state;
    }
}