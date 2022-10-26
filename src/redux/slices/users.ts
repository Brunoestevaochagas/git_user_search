import { createSlice } from "@reduxjs/toolkit";
import { UsersType, UserType, ReposType } from "../../@types/User";

// utils
import axios from "../../utils/axios";
//
import { dispatch } from "../store";

// ----------------------------------------------------------------------

export type UsersState = {
  users: UsersType[];
  user?: UserType;
  repos: ReposType[];
  foundValue: string;
  searchValue: string;
  error: Error | null;
  usersInfiniteScroll: {
    hasMore: boolean;
    page: number;
    per_page: number;
    error: Error | null;
    count?: number;
    isLoading: boolean;
  };
  reposInfiniteScroll: {
    hasMore: boolean;
    page: number;
    per_page: number;
    error: Error | null;
    count?: number;
    isLoading: boolean;
  };
};

const initialState: UsersState = {
  users: [],
  repos: [],
  user: undefined,
  foundValue: "",
  searchValue: "",
  error: null,
  usersInfiniteScroll: {
    page: 1,
    hasMore: false,
    per_page: 35,
    error: null,
    count: undefined,
    isLoading: false,
  },
  reposInfiniteScroll: {
    page: 1,
    hasMore: false,
    per_page: 10,
    count: undefined,
    error: null,
    isLoading: false,
  },
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    hasErrorUsers(state, action) {
      state.usersInfiniteScroll.error = action.payload;
      state.usersInfiniteScroll.hasMore = false;
    },
    hasErrorRepos(state, action) {
      state.reposInfiniteScroll.error = action.payload;
      state.reposInfiniteScroll.hasMore = false;
    },
    setUsersIsloading(state, action) {
      state.usersInfiniteScroll.isLoading = action.payload;
    },
    setReposIsloading(state, action) {
      state.reposInfiniteScroll.isLoading = action.payload;
    },
    getUsersSuccess(state, action) {
      state.usersInfiniteScroll.page = 1;
      state.usersInfiniteScroll.error = null;
      state.users = action.payload.items;
      state.usersInfiniteScroll.hasMore =
        state.usersInfiniteScroll.page <
        Math.ceil(
          action.payload.total_count / state.usersInfiniteScroll.per_page
        );
      state.usersInfiniteScroll.count = action.payload.total_count;
      state.usersInfiniteScroll.isLoading = false;
    },
    loadMoreUsersSuccess(state, action) {
      state.usersInfiniteScroll.error = null;
      state.users = [...state.users, ...action.payload.items];

      state.usersInfiniteScroll.hasMore =
        state.usersInfiniteScroll.page <
        Math.ceil(
          action.payload.total_count / state.usersInfiniteScroll.per_page
        );
      state.usersInfiniteScroll.page += 1;
    },

    getUserReposSuccess(state, action) {
      state.reposInfiniteScroll.page = 1;
      state.reposInfiniteScroll.error = null;
      state.repos = action.payload;
      state.reposInfiniteScroll.hasMore =
        action.payload.length === state.reposInfiniteScroll.per_page;
      state.reposInfiniteScroll.isLoading = false;
    },

    loadMoreReposSuccess(state, action) {
      state.reposInfiniteScroll.error = null;
      state.repos = [...state.repos, ...action.payload];
      state.reposInfiniteScroll.hasMore =
        action.payload.length === state.reposInfiniteScroll.per_page;
      state.reposInfiniteScroll.page += 1;
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
    clearUsers(state) {
      state.users = [];
      state.usersInfiniteScroll.page = 1;
      state.usersInfiniteScroll.count = undefined;
      state.usersInfiniteScroll.error = null;
      state.usersInfiniteScroll.hasMore = false;
      state.foundValue = "";
    },
    clearRepos(state) {
      state.repos = [];
      state.reposInfiniteScroll.page = 1;
      state.reposInfiniteScroll.count = undefined;
      state.reposInfiniteScroll.error = null;
      state.reposInfiniteScroll.hasMore = false;
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
export const { setSearchValue, clearUser, clearRepos } = slice.actions;

// ----------------------------------------------------------------------

export function getUsers(searchValue: string, per_page: number, page: number) {
  return async () => {
    try {
      dispatch(slice.actions.setUsersIsloading(true));
      dispatch(slice.actions.clearUsers());
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
      dispatch(slice.actions.hasErrorUsers(error));
      dispatch(slice.actions.setUsersIsloading(true));
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
      dispatch(slice.actions.hasErrorUsers(error));
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

export function getUserRepos(login: string, per_page: number, page: number) {
  return async () => {
    try {
      dispatch(slice.actions.setReposIsloading(true));
      dispatch(slice.actions.clearRepos());
      const res = await axios.get(
        `https://api.github.com/users/${login}/repos`,
        {
          params: {
            per_page,
            page: page,
            sort: "created_at",
            order: "asc",
          },
        }
      );
      dispatch(slice.actions.getUserReposSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasErrorRepos(error));
      dispatch(slice.actions.setReposIsloading(true));
      throw error;
    }
  };
}

export function loadMoreUserRepos(
  login: string,
  per_page: number,
  page: number
) {
  return async () => {
    try {
      const res = await axios.get(
        `https://api.github.com/users/${login}/repos`,
        {
          params: {
            per_page,
            page: page,
            sort: "created_at",
            order: "asc",
          },
        }
      );
      dispatch(slice.actions.loadMoreReposSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasErrorRepos(error));
      throw error;
    }
  };
}
