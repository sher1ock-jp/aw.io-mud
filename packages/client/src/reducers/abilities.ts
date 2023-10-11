import {
    AbilitiesState,
    AbilitiesActionTypes,
    LaunchAction,
    LaunchReadyAction,
    BuildAction,
    AbilitiesActions
} from "../types/abilitiesTypes";

const initialState: AbilitiesState = {
    launch: false,
    meter: '               ',
};

export const launch = (): LaunchAction => ({
    type: AbilitiesActionTypes.LAUNCH,
});

export const launchReady = (): LaunchReadyAction => ({
    type: AbilitiesActionTypes.LAUNCH_READY,
});

export const build = (num: number): BuildAction => {
    let meter = '';
    for (let i = 0; i < num; i++) {
        meter = '|' + meter;
    }
    return {
        type: AbilitiesActionTypes.BUILD,
        meter,
    };
};

export default (state = initialState, action: AbilitiesActions): AbilitiesState => {
    switch (action.type) {
      case AbilitiesActionTypes.LAUNCH:
        return { ...state, launch: false, meter: '' };
      case AbilitiesActionTypes.LAUNCH_READY:
        return { ...state, launch: true };
      case AbilitiesActionTypes.BUILD:
        return { ...state, meter: action.meter };
      default:
        return state;
    }   
};
