import { combineReducers } from "@reduxjs/toolkit";
import appSlice from "src/slices/appSlice";

const rootReducer = combineReducers({
  app: appSlice,
});

export default rootReducer;
