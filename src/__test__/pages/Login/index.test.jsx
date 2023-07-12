import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../../pages/login";
import React from "react";
import { BrowserRouter } from "react-router-dom";

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

  it("navigates to regsiter page", () => {
    view();

    fireEvent.click(screen.getByRole("link", { name: "Register" }));

    expect(window.location.pathname).toBe("/register");
  });

  it("navigates to forgot password page", () => {
    view();

    fireEvent.click(screen.getByRole("link", { name: "Forgot Password?" }));

    expect(window.location.pathname).toBe("/reset-password");
  });
});
