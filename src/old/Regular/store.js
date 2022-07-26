import { createStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import { devToolsEnhancer } from "redux-devtools-extension";

const store = configureStore(
  { reducer: reducer },
  devToolsEnhancer({ trace: true })
);

// const store = createStore(reducer);
export default store;
