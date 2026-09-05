import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authState } from './Features/authState';
import Auth from './Auth/Auth';
import Counter from './Counter/Counter';
import Profile from './Profile/Profile';
import News from './News/newsState';
import BioMetric from './BioMetric/BioMetric';
import History from './History/History';
import { resendOtpTimerState } from './Features/timerState';

const persistConfig = {
     key: 'root',
     storage: AsyncStorage,
     blacklist: ['Counter', 'Profile', 'News', 'History'],
};

const rootReducer = combineReducers({
     userData: authState.reducer,
     resendOtpTimer: resendOtpTimerState.reducer,
     [Auth.reducerPath]: Auth.reducer,
     [Counter.reducerPath]: Counter.reducer,
     [Profile.reducerPath]: Profile.reducer,
     [News.reducerPath]: News.reducer,
     [BioMetric.reducerPath]: BioMetric.reducer,
     [History.reducerPath]: History.reducer,
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
               .concat(Counter.middleware)
               .concat(Profile.middleware)
               .concat(News.middleware)
               .concat(BioMetric.middleware)
               .concat(History.middleware),
});

export default store;
export const persistor = persistStore(store);
