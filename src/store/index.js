import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { setStoreInstance } from "../services/api";

const store = configureStore({ reducer: rootReducer });

setStoreInstance(store);

export default store;
