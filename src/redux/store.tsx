import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authState } from './Features/authState';
import Auth from './Auth/Auth';
import Counter from './Counter/Counter';

const persistConfig = {
     key: 'root',
     storage: AsyncStorage,
     blacklist: ['Counter'],
};

const rootReducer = combineReducers({
     userData: authState.reducer,
     [Auth.reducerPath]: Auth.reducer,
     [Counter.reducerPath]: Counter.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
     reducer: persistedReducer,
     middleware: getDefaultMiddleware =>
          getDefaultMiddleware({
               serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
               },
          })
               .concat(Auth.middleware)
               .concat(Counter.middleware),
});

export default store;
export const persistor = persistStore(store);
