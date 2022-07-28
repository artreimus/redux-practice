import axios from "axios";
import * as actions from "../api";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    const { url, method, data, onSuccess, onStart, onError } = action.payload;
    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      const response = await axios.request({
        baseURL: "http://localhost:9001/api",
        url,
        method,
        data,
      });
      // General success handling
      dispatch(actions.apiCallSuccess(response.data));
      // Specific success  handling
      dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      // General error handling
      dispatch(actions.apiCallFailed(error.message));
      // Specific error handling
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
