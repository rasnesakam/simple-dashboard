import { persistStore, persistReducer } from 'redux-persist'
import persistedProfileReducer from "src/redux/slices/Profile";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const persistedReducer = combineReducers({
    profile: persistedProfileReducer
})

export const store = configureStore({
    reducer: {
        persistedReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;