type AbilitiesState = {
    launch: boolean;
    meter: string;
};

const initialState: AbilitiesState = {
    launch: false,
    meter: '               ',
};

export enum AbilitiesActionTypes {
    LAUNCH = 'LAUNCH',
    LAUNCH_READY = 'LAUNCH_READY',
    BUILD = 'BUILD',
}

interface LaunchAction {
    type: AbilitiesActionTypes.LAUNCH;
}

interface LaunchReadyAction {
    type: AbilitiesActionTypes.LAUNCH_READY;
}

interface BuildAction {
    type: AbilitiesActionTypes.BUILD;
    meter: string;
}

type AbilitiesActions = LaunchAction | LaunchReadyAction | BuildAction;

export const lauch = (): LaunchAction => ({
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
