import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

declare global {
    interface Window {
      store: typeof store;
    }
}

const middleware = [thunk]; 

const store = createStore(reducer, applyMiddleware(...middleware));

// use this onlu in development
window.store = store;

export default store;