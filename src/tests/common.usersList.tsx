import * as React from "react";
import { render, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import UserList from "../pages/users/list";

const renderUserList = (): RenderResult =>
  render(
    <Provider store={store}>
      <UserList />
    </Provider>
  );

describe("Render UserList", () => {
  it("renders without crashing", () => {
    renderUserList();
  });
});
