import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toast from "./middleware/toast";
import api from "./middleware/api";
// import func from "./middleware/func";

// Custom Middleware

// export default function () {
//   return configureStore({ reducer, middleware: [logger("console"), func] });
// }

export default function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), logger("console"), toast, api],
  });
}
