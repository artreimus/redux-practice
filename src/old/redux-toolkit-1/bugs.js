import { createAction, createReducer } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

// Actions
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugResolved");
export const bugRemoved = createAction("bugRemoved");

// Reducer
// Name of key must be same as name of action
let lastId = 0;

export default createReducer([], {
  // Name of state can be anything
  [bugAdded.type]: (bug, action) => {
    bug.push({
      id: ++lastId,
      description: action.payload.description,
      resolved: false,
    });
  },
  [bugRemoved.type]: (bug, action) => {
    const index = bug.findIndex((bug) => bug.id === action.payload.id);
    bug.splice(index, 1);
  },
  [bugResolved.type]: (bug, action) => {
    const index = bug.findIndex((bug) => bug.id === action.payload.id);
    bug[index].resolved = true;
  },
});
