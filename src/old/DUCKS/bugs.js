// Action types
const BUG_ADDED = "bugAdded";
const BUG_REMOVED = "bugRemoved";
const BUG_RESOLVED = "bugResolved";

// Actions

export function bugAdded(description) {
  return {
    type: BUG_ADDED,
    payload: {
      description,
    },
  };
}

export function bugRemoved(id) {
  return {
    type: BUG_REMOVED,
    payload: {
      id,
    },
  };
}
export function bugResolved(id) {
  return {
    type: BUG_RESOLVED,
    payload: {
      id,
    },
  };
}

// Reducer

let lastId = 0;

// Reducer must be exported as default

export default function reducer(state = [], action) {
  switch (action.type) {
    case "bugAdded":
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    case "bugRemoved":
      return state.filter((bug) => bug.id !== action.payload.id);
    case "bugResolved":
      return state.map((bug) =>
        bug.id === action.payload.id ? { ...bug, resolved: true } : bug
      );
    default:
      return state;
  }
}
