import { combineReducers } from "redux";

// slices

import usersReducer from "./slices/users";

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  users: usersReducer,
});

export { rootReducer };
