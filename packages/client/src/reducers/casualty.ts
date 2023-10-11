import { Dispatch } from 'redux';
import store from '../store';

import {
    CasualtyState,
    CasualtyActionTypes,
    CasualtyReportAction,
    RemoveListingAction,
    CasualtyActions,
} from '../types/casualtyTypes';

const initialState: CasualtyState = [];

export const casualtyReport = (eatenName: string, eaterName: string): CasualtyReportAction => ({
    type: CasualtyActionTypes.CASUALTY_REPORT,
    eatenName,
    eaterName,
});

export const removeListing = (): RemoveListingAction => ({
    type: CasualtyActionTypes.REMOVE_LISTING,
});

export const reportCasualty = (eaterNick: string, eatenNick: string) => (dispatch: Dispatch) => {
    dispatch(casualtyReport(eaterNick, eatenNick));
    setTimeout(() => dispatch(removeListing()), 8000);
};

const reducer = (state = initialState, action: CasualtyActions): CasualtyState => {
    switch (action.type) {
        case CasualtyActionTypes.CASUALTY_REPORT:
            setTimeout(()=>store.dispatch(removeListing()),8000);
            return [...state, `${action.eaterName}   〇   ${action.eatenName}`];
        case CasualtyActionTypes.REMOVE_LISTING:
            return state.slice(1);
        default:
            return state;
    }
};

export default reducer;


