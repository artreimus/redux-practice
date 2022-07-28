import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;

const slice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    projectAdded: (project, action) => {
      project.push({
        id: ++lastId,
        name: action.payload.name,
      });
    },
    projectRemoved: (project, action) => {
      const index = project.findIndex(
        (project) => project.id === action.payload.id
      );
      project.splice(index, 1);
    },
  },
});

export const { projectAdded, projectRemoved } = slice.actions;
export default slice.reducer;
