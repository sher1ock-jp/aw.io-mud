import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';

declare global {
    interface Window {
      store: typeof store;
    }
}

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    // Add additional middlewares here, but for this case, you just have thunk
    // which is already included by default with `@reduxjs/toolkit`.
  ]),
});

// Use this only in development
window.store = store;

export default store;
