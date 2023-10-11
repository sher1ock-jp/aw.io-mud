import {
    User,
    AuthState,
    AuthenticatedAction,
    AuthActionTypes,
    LogoutAction,
    AuthActions
} from '../types/authTypes';

const initialState: AuthState = null;

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
