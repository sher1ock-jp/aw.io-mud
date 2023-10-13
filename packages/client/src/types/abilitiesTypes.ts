export type AbilitiesState = {
    launch: boolean;
    meter: string;
};

export enum AbilitiesActionTypes {
    LAUNCH = 'LAUNCH',
    LAUNCH_READY = 'LAUNCH_READY',
    BUILDUP = 'BUILDUP',
}

// Generic action type for actions without additional data
interface GenericAction<T> {
    type: T;
}

// Use the generic action for LAUNCH and LAUNCH_READY
export type LaunchAction = GenericAction<AbilitiesActionTypes.LAUNCH>;
export type LaunchReadyAction = GenericAction<AbilitiesActionTypes.LAUNCH_READY>;

// Build action remains the same, as it has an additional 'meter' property
export interface BuildUpAction {
    type: AbilitiesActionTypes.BUILDUP;
    meter: string;
}

export type AbilitiesActions = LaunchAction | LaunchReadyAction | BuildUpAction;
