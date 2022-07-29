import configureStore from "./store/configureStore";
import { getUnresolvedBugs, getBugsByUser } from "./store/bugs";
import { userAdded } from "./store/users";
import * as projectsActions from "./store/projects";
import * as actions from "./store/api";
import { loadBugs, addBug, resolveBug, assignBugToUser } from "./store/bugs";

// Initializing the store

const store = configureStore();

// Store subscription

const unsubscribe = store.subscribe(() => {
  console.log("Store changed!", store.getState());
});

// store.dispatch({
//   type: "error",
//   payload: { message: "Something went wrong" },
// });

// API CALLS Dispatching

// With action creator

// Method 1
// store.dispatch(
//   actions.apiCallBegan({
//     url: "/bugs",
//     onSuccess: "bugs/bugsReceived",
//   })
// );

// Method 2
// store.dispatch(loadBugs());
// setTimeout(() => store.dispatch(loadBugs()), 2000);

// Without action creator

// store.dispatch({
//   type: "apiCallBegan",
//   payload: {
//     url: "/bugs",
//     onSuccess: "bugsReceived",
//     onError: "apiRequestFailed",
//   },
// });

// Changing Data in Server

// store.dispatch(
//   addBug({
//     description: "a",
//   })
// );

// Resolving bug simulation
store.dispatch(loadBugs());
store.dispatch(userAdded({ name: "John Doe" }));

setTimeout(() => store.dispatch(resolveBug(1), 2000));

// Assigning bug to user simulation

setTimeout(() => store.dispatch(assignBugToUser(1, 1), 2000));

// Dispatching basic actions

// store.dispatch((dispatch, getState) => {
//   dispatch({ type: "bugsReceived", bugs: [1, 2, 3] });
// });

// store.dispatch(userAdded({ name: "Johnny Ive" }));
// store.dispatch(projectsActions.projectAdded({ name: "Project 1" }));
// store.dispatch(bugAdded({ description: "Bug 1" }));
// store.dispatch(bugAdded({ description: "Bug 2" }));
// store.dispatch(bugAdded({ description: "Bug 3" }));
// store.dispatch(bugResolved({ id: 1 }));
// store.dispatch(bugAssignedToUser({ bugId: 1, userId: 1 }));
// store.dispatch(bugRemoved({ id: 3 }));

// Memorizing the result of selector function

const unresolvedBugs = getUnresolvedBugs(store.getState());
const assignedUser = getBugsByUser(3)(store.getState());
// console.log(assignedUser);
