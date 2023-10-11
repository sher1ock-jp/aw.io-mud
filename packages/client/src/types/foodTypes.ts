import { GenericAction } from "./commonTypes";

export type FoodState = {
    [id: string]: any;
  };
  
  
export enum FoodActionTypes {
    RECEIVE_FOOD = 'RECEIVE_FOOD',
    RECEIVE_MULTIPLE_FOOD = 'RECEIVE_MULTIPLE_FOOD',
    REMOVE_FOOD = 'REMOVE_FOOD',
    REMOVE_ALL_FOOD = 'REMOVE_ALL_FOOD',
}

export interface ReceiveFoodAction extends GenericAction<FoodActionTypes.RECEIVE_FOOD> {
    id: string;
    data: any;  
}

export interface ReceiveMultipleFoodAction extends GenericAction<FoodActionTypes.RECEIVE_MULTIPLE_FOOD> {
    food: FoodState;
}

export interface RemoveFoodAction extends GenericAction<FoodActionTypes.REMOVE_FOOD> {
    id: string;
}

// interface -> type because this is super type
export type RemoveAllFoodAction = GenericAction<FoodActionTypes.REMOVE_ALL_FOOD>

export type FoodActions = ReceiveFoodAction | ReceiveMultipleFoodAction | RemoveFoodAction | RemoveAllFoodAction;