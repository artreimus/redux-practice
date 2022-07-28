import { combineReducers } from "redux";
import bugsReducer from "./bugs";
import projectsReducer from "./projects";
import userReducer from "./users";

// Combines all reducers into one root reducer.
export default combineReducers({
  bugs: bugsReducer,
  project: projectsReducer,
  user: userReducer,
});
