import { Dispatch } from 'redux';
import store from '../store';

type CasualtyState = string[];

const initialState: CasualtyState = [];

export enum CasualtyActionTypes {
    CASUALTY_REPORT = 'CASUALTY_REPORT',
    REMOVE_LISTING = 'REMOVE_LISTING',
}

interface CasualtyReportAction {
    type: CasualtyActionTypes.CASUALTY_REPORT;
    eatenName: string;
    eaterName: string;
}

interface RemoveListingAction {
    type: CasualtyActionTypes.REMOVE_LISTING;
}

type CasualtyActions = CasualtyReportAction | RemoveListingAction;

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


