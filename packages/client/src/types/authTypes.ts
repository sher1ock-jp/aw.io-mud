import { GenericAction } from './commonTypes';

export type User = {
    id: number;
    name: string;
};

export type AuthState = User | null;

export enum AuthActionTypes {
    AUTHENTICATED = 'AUTHENTICATED',
    LOGOUT = 'LOGOUT',
}

export type AuthenticatedAction = GenericAction<AuthActionTypes.AUTHENTICATED> & {
    user: User;
};

export type LogoutAction = GenericAction<AuthActionTypes.LOGOUT>;

export type AuthActions = AuthenticatedAction | LogoutAction;