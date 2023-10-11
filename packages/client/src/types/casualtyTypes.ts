import { GenericAction } from './commonTypes';

export type CasualtyState = string[];

export enum CasualtyActionTypes {
    CASUALTY_REPORT = 'CASUALTY_REPORT',
    REMOVE_LISTING = 'REMOVE_LISTING',
}

export interface CasualtyReportAction extends GenericAction<CasualtyActionTypes.CASUALTY_REPORT> {
    eatenName: string;
    eaterName: string;
}

export type RemoveListingAction = GenericAction<CasualtyActionTypes.REMOVE_LISTING>;


export type CasualtyActions = CasualtyReportAction | RemoveListingAction;