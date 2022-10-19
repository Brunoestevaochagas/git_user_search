import { createSlice } from "@reduxjs/toolkit";
import { UsersType, UserType, ReposType } from "../../@types/User";

// utils
import axios from "../../utils/axios";
//
import { dispatch } from "../store";

// ----------------------------------------------------------------------

export type ShippingState = {
  users: UsersType[];
  user?: UserType;
  repos: ReposType[];
  page: number;
  per_page: number;
  error: Error | null;
  hasMore: boolean;
  count?: number;
  foundValue: string;
  searchValue: string;
  isLoading: boolean;
};

const initialState: ShippingState = {
  users: [],
  repos: [],
  user: undefined,
  page: 1,
  per_page: 35,
  error: null,
  hasMore: false,
  count: undefined,
  foundValue: "",
  searchValue: "",
  isLoading: false,
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
      state.hasMore = false;
    },
    setIsloading(state, action) {
      state.isLoading = action.payload;
    },
    getUsersSuccess(state, action) {
      state.page = 1;
      state.error = null;
      state.users = action.payload.items;
      state.hasMore =
        state.page < Math.ceil(action.payload.total_count / state.per_page);
      state.count = action.payload.total_count;
      state.isLoading = false;
    },
    loadMoreUsersSuccess(state, action) {
      state.error = null;
      state.users = [...state.users, ...action.payload.items];
      state.hasMore =
        state.page < Math.ceil(action.payload.total_count / state.per_page);
      state.page += 1;
    },

    getUserReposSuccess(state, action) {
      state.repos = action.payload;
    },

    getUserSuccess(state, action) {
      state.user = action.payload;
    },

    setFoundValue(state, action) {
      state.foundValue = action.payload;
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    clear(state) {
      state.users = [];
      state.page = 1;
      state.count = undefined;
      state.error = null;
      state.hasMore = false;
      state.foundValue = "";
    },
    clearUser(state) {
      state.user = undefined;
      state.repos = [];
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSearchValue, clearUser } = slice.actions;

// ----------------------------------------------------------------------

export function getUsers(searchValue: string, per_page: number, page: number) {
  return async () => {
    try {
      dispatch(slice.actions.setIsloading(true));
      dispatch(slice.actions.clear());
      const res = await axios.get("https://api.github.com/search/users", {
        params: {
          q: searchValue,
          per_page,
          page: page,
          sort: "joined",
          order: "asc",
        },
      });
      dispatch(slice.actions.setFoundValue(searchValue));
      dispatch(slice.actions.getUsersSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.setIsloading(true));
      throw error;
    }
  };
}

export function loadMoreUsers(
  searchValue: string,
  per_page: number,
  page: number
) {
  return async () => {
    try {
      const res = await axios.get("https://api.github.com/search/users", {
        params: {
          q: searchValue,
          per_page,
          page: page,
          sort: "joined",
          order: "asc",
        },
      });
      dispatch(slice.actions.loadMoreUsersSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function getUserRepos(login: string) {
  return async () => {
    try {
      const res = await axios.get(
        `https://api.github.com/users/${login}/repos`
      );
      dispatch(slice.actions.getUserReposSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function getUser(login: string) {
  return async () => {
    try {
      const res = await axios.get(`https://api.github.com/users/${login}`);
      dispatch(slice.actions.getUserSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function clear() {
  return async () => {
    try {
      dispatch(slice.actions.clear());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}
