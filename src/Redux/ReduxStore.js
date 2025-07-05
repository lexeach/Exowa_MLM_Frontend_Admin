import { configureStore,combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web

import { userLinksReducer } from "./ReduxSlice";

// Combine all reducers
const rootReducer = {
  user: userLinksReducer,
};

const persistConfig = {
  key: "root", 
  storage,     
  whitelist: ["user", "activeTab", "allAdmin", "token", "adminId", "adminDetails", "allUserData", "userData", "supportAdminUsersAssignState", "loginAdminDetailsState", "socialMediaState", "privacyPolicyState"], // Specify which slices to persist (optional)
};

const persistedReducer = persistReducer(persistConfig, userLinksReducer,combineReducers(rootReducer));

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };


