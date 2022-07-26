export default function (state, action) {
  switch (action.type) {
    case "bugAdded":
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    case "bugRemoved":
      return {
        ...state,
        list: state.list.filter((bug) => bug.id !== action.payload.id),
      };
    case "bugResolved":
      return {
        ...state,
        list: state.list.map((bug) => {
          if (bug.id === action.payload.id) {
            return {
              ...bug,
              resolved: true,
            };
          }
          return bug;
        }),
      };
    default:
      return state;
  }
}
