import { render, screen } from "@testing-library/react";
import Login from "../../../pages/login";
import React from "react";
import { BrowserRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const createRouterWrapper = ({ children }) => (
  <Router history={history}>{children}</Router>
);

describe("Login Page", () => {
  const view = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("header to be in the document", () => {
    view();

    const title = screen.getByText(/welcome back/i);
    const subTitle = screen.getByText(/It's nice to see you again/i);

    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });

  it("shows login Button", () => {
    view();

    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    expect(loginButton).toBeInTheDocument();
  });

  it("shows username and password input", () => {
    view();

    const usernameInput = screen.getByRole("input", {
      name: /username/i,
    });
    const passwordInput = screen.getByRole("input", {
      name: /password/i,
    });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("navigates to regsiter and forgot password page", () => {
    view();
    const user = userEvent.setup();

    user.click(screen.getByText(/Register/i));
    user.click(screen.getByText(/Forgot password/i));

    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
  });
});
