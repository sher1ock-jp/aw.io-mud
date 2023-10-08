type User = {
    id: number;
    name: string;
};

type AuthState = User | null;

const initialState: AuthState = null;

export enum AuthActionTypes {
    AUTHENTICATED = 'AUTHENTICATED',
    LOGOUT = 'LOGOUT',
}

interface AuthenticatedAction {
    type: AuthActionTypes.AUTHENTICATED;
    user: User;
}

interface LogoutAction {
    type: AuthActionTypes.LOGOUT;
}

type AuthActions = AuthenticatedAction | LogoutAction;

export const authenticated = (user: User): AuthenticatedAction => ({
    type: AuthActionTypes.AUTHENTICATED,
    user,
});

export const logout = (): LogoutAction => ({
    type: AuthActionTypes.LOGOUT,
});

export const loginGuest = (socket: any, nickname: string) => (dispatch: any) => {
    //
};

export default (state = initialState, action: AuthActions): AuthState => {
    switch (action.type) {
      case AuthActionTypes.AUTHENTICATED:
        return action.user;
      case AuthActionTypes.LOGOUT:
        return null;
      default:
        return state;
    }   
};
