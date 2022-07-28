import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

let lastId = 0;

const slice = createSlice({
  name: "bugs",
  // Could be an array or object
  // initialState: [],
  initialState: {
    list: [], // Array of bugs
    loading: false,
    lastFetch: null, //For caching
  },

  reducers: {
    // actions => action handlers

    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    // Getting bugs from server
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },

    // addBug - bugAdded : command - event
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list.splice(index, 1);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },
  },
});

const {
  bugAdded,
  bugRemoved,
  bugResolved,
  bugAssignedToUser,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
} = slice.actions;

export default slice.reducer;

// Action creators

const url = "/bugs";

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  dispatch(
    apiCallBegan({
      url: url,
      onStart: bugsRequested.type,
      onError: bugsRequestFailed.type,
      onSuccess: bugsReceived.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });

export const resolveBug = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: `${url}/${bugId}`,
    method: "patch",
    data: {
      userId,
    },
    onSuccess: bugAssignedToUser.type,
  });

// export const loadBugs = () => {
//   return apiCallBegan({
//     url: url,
//     onStart: bugsRequested.type,
//     onError: bugsRequestFailed.type,
//     onSuccess: bugsReceived.type,
//   });
// };

// Selectors
// Use createSelector to create a selector function and memorize the result
// If list of bugs is not changed, then selector function will not be called
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs.list,
  (state) => state.entities.projects,
  (bugs, projects) => bugs.filter((bug) => !bug.resolved)
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs.list,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );
