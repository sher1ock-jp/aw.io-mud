import { GenericAction } from "./commonTypes";

export type Message = {
    id: number;
    text: string;
};

export enum MessageActionTypes {
    RECEIVE_MESSAGES = 'RECEIVE_MESSAGES',
    RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
    REMOVE_MESSAGE = 'REMOVE_MESSAGE',
    REMOVE_ALL_MESSAGES = 'REMOVE_ALL_MESSAGES'
}

export interface ReceiveMessagesAction extends GenericAction<MessageActionTypes.RECEIVE_MESSAGES> {
    messages: Message[];
}

export interface ReceiveMessageAction extends GenericAction<MessageActionTypes.RECEIVE_MESSAGE> {
    message: Message;
}

export interface RemoveMessageAction extends GenericAction<MessageActionTypes.REMOVE_MESSAGE> {
    id: number;
}

export type RemoveAllMessagesAction = GenericAction<MessageActionTypes.REMOVE_ALL_MESSAGES>;

export type MassageAction = ReceiveMessagesAction | ReceiveMessageAction | RemoveMessageAction | RemoveAllMessagesAction;