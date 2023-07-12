import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../../pages/login";
import { act } from "react-dom/test-utils";

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

    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const passwordInput = screen.getByLabelText("Password");

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

  it("toggles password visibility", () => {
    view();

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput.type).toBe("password");

    const passwordToggleBtn = screen.getByLabelText(
      "Toggle Password Visibility"
    );

    fireEvent.click(passwordToggleBtn);

    expect(passwordInput.type).toBe("text");

    fireEvent.click(passwordToggleBtn);

    expect(passwordInput.type).toBe("password");
  });
});

jest.mock("axios", () => {
  return {
    create: () => {
      return {
        interceptors: {
          request: { eject: jest.fn(), use: jest.fn() },
          response: { eject: jest.fn(), use: jest.fn() },
        },
      };
    },
  };
});

describe("API Login Integration", () => {
  const view = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  afterEach(cleanup);

  const mockLoginSuccess = {
    status: "Success",
    data: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODkxNzI4NDQsInJvbGVfaWQiOiIyNiIsInJvbGVfbmFtZSI6IkFkbWluIiwic3ViIjoiMjgiLCJ1c2VybmFtZSI6IkFkbWluIn0.D4gnMqjRFNzESDphrI5ofYJdeETv1V1mgmJ1c9rf4XE",
      is_active: true,
    },
  };

  it("Login Succeeded", async () => {
    jest.fn().mockResolvedValueOnce(mockLoginSuccess);

    act(() => view());
    act(() => {
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "testuser" },
      });

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Password123!" },
      });
    });

    const loginButton = screen.getByText("Login");

    fireEvent.click(loginButton);

    waitFor(() => {
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });
  });
});
