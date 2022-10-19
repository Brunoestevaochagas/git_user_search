import { render, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import UserProfile from "../pages/users/profile";
import { MemoryRouter } from "react-router-dom";

const renderUserList = (): RenderResult =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/user/defunkt"]}>
        <UserProfile />
      </MemoryRouter>
    </Provider>
  );

describe("Render UserList", () => {
  it("renders without crashing", () => {
    renderUserList();
  });
});
