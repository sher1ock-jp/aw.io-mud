import {
  FoodState,
  FoodActions,
  FoodActionTypes,
  ReceiveFoodAction,
  ReceiveMultipleFoodAction,
  RemoveFoodAction,
  RemoveAllFoodAction
} from '../types/foodTypes';

const initialState: FoodState = {};

export const receiveFood = (id: string, data: any): ReceiveFoodAction => ({
  type: FoodActionTypes.RECEIVE_FOOD,
  id,
  data
});

export const receiveMultipleFood = (food: FoodState): ReceiveMultipleFoodAction => ({
  type: FoodActionTypes.RECEIVE_MULTIPLE_FOOD,
  food
});

export const removeFood = (id: string): RemoveFoodAction => ({
  type: FoodActionTypes.REMOVE_FOOD,
  id
});

export const removeAllFood = (): RemoveAllFoodAction => ({
  type: FoodActionTypes.REMOVE_ALL_FOOD
});

const immutable = (state = initialState, action: FoodActions): FoodState => {
  let newState;
  switch (action.type) {
    case FoodActionTypes.RECEIVE_FOOD:
      newState = Object.assign({}, state);
      newState[action.id] = action.data;
      return newState;
    case FoodActionTypes.RECEIVE_MULTIPLE_FOOD:
      newState = Object.assign({}, state, action.food);
      return newState;
    case FoodActionTypes.REMOVE_FOOD:
      newState = Object.assign({}, state);
      delete newState[action.id];
      return newState;
    case FoodActionTypes.REMOVE_ALL_FOOD:
      return initialState;
    default: return state;
  }
}

const semimutable = (state = initialState, action: FoodActions): FoodState => {
  let newState;
  switch(action.type) {
    case FoodActionTypes.RECEIVE_FOOD:
      newState = Object.assign({}, state);
      newState[action.id] = action.data;
      return newState;
    case FoodActionTypes.RECEIVE_MULTIPLE_FOOD:
      newState = Object.assign({}, state);
      Object.assign(newState, action.food);
      return newState;
    case FoodActionTypes.REMOVE_FOOD:
      newState = Object.assign({}, state);
      delete newState[action.id];
      return newState;
    default: return state;
  }
}

const mutable = (state = initialState, action: FoodActions): FoodState => {
  switch (action.type) {
    case FoodActionTypes.RECEIVE_FOOD:
      state[action.id] = action.data;
      return state;
    case FoodActionTypes.RECEIVE_MULTIPLE_FOOD:
      Object.assign(state, action.food);
      return state;
    case FoodActionTypes.REMOVE_FOOD:
      delete state[action.id];
      return state;
    default: return state;
  }
};

const chooseReducer = (reducerMode: 'mutable' | 'semimutable' | 'immutable') => {
  switch (reducerMode) {
      case 'mutable': return mutable;
      case 'semimutable': return semimutable;
      case 'immutable': return immutable;
      default: return mutable;
  }
};

export default chooseReducer('immutable');