import { act, render, screen } from "@testing-library/react";
import Login from "../../../pages/login";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

import Register from "../../../pages/register";
import userEvent from "@testing-library/user-event";

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

  it("shown login Button", () => {
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

  
});
