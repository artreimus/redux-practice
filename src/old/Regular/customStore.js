import reducer from "./reducer";

function createStore(reducer) {
  let state;
  let listeners = [];

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  function dispatch(action) {
    state = reducer(state, action);

    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
