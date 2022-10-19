import * as React from "react";
import { render } from "@testing-library/react";

import "jest-canvas-mock";

import UserList from "../src/pages/users/list";

describe("Common render", () => {
  it("renders without crashing", () => {
    render(<UserList />);
  });
});
