

import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist"
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";
import storage from "redux-persist/lib/storage"
import { configureStore } from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    user:userReducer,
    theme:themeReducer
})

const persistConfig = {
    key:"root",
    storage,
    version:1
}


const persistedReducer = persistReducer(persistConfig , rootReducer)


export const store = configureStore({

    reducer:persistedReducer,

    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck:false})

})


export const persistor = persistStore(store)