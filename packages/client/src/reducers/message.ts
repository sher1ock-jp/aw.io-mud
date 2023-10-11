import {
    Message,
    MassageAction,
    MessageActionTypes
} from "../types/messageTypes";

const initialState: Message[] = [];

export const receiveMessages = (messages: Message[]): MassageAction => ({
    type: MessageActionTypes.RECEIVE_MESSAGES,
    messages
});

export const receiveMessage = (message: Message): MassageAction => ({
    type: MessageActionTypes.RECEIVE_MESSAGE,
    message
});

export const removeMessage = (id: number): MassageAction => ({
    type: MessageActionTypes.REMOVE_MESSAGE,
    id
});

export const removeAllMessages = (): MassageAction => ({
    type: MessageActionTypes.REMOVE_ALL_MESSAGES
});

export default (state = initialState, action: MassageAction): Message[] => {
    switch(action.type) {
        case MessageActionTypes.RECEIVE_MESSAGES:
            return action.messages;
        case MessageActionTypes.RECEIVE_MESSAGE:
            return [...state, action.message];
        case MessageActionTypes.REMOVE_MESSAGE:
            return [...state.slice(0, action.id), ...state.slice(action.id + 1)];
        case MessageActionTypes.REMOVE_ALL_MESSAGES:
            return initialState;
        default:
            return state;
    }
}