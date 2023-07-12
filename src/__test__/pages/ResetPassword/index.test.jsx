import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import ResetPassword from "../../../pages/Auth/resetPassword";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

describe("Reset Password Page", () => {
  const view = () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
  };

  it("header to be in the document", () => {
    view();

    const title = screen.getByText(/forgot password/i);
    const subTitle = screen.getByText(/no worries, we got you/i);

    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });

  it("shows reset password Button", () => {
    view();

    const resetPasswordButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    expect(resetPasswordButton).toBeInTheDocument();
  });

  it("shows all inputs", () => {
    view();

    const input = screen.getAllByRole("textbox");

    const emailInput = input[0];
    const usernameInput = input[1];
    const passwordInput = input[2];
    const passwordConfirmationInput = input[3];

    waitFor(() => {
      expect(emailInput).toBeInTheDocument();
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(passwordConfirmationInput).toBeInTheDocument();
    });
  });

  it("navigates to login when login text is clicked", () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    fireEvent.click(
      screen.getByRole("link", {
        name: /Log In/i,
      })
    );

    expect(window.location.pathname).toBe("/login");
  });

  it("button to be disabled", () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const resetPasswordButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    expect(resetPasswordButton).toBeDisabled();
  });

  it("toggles password visibility", () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    const passwordToggleBtn = screen.getByLabelText(
      "Toggle Password Visibility"
    );
    const confirmPasswordToggleBtn = screen.getByLabelText(
      "Toggle Confirm Password Visibility"
    );

    fireEvent.click(passwordToggleBtn);
    fireEvent.click(confirmPasswordToggleBtn);

    expect(passwordInput.type).toBe("text");
    expect(confirmPasswordInput.type).toBe("text");

    fireEvent.click(passwordToggleBtn);
    fireEvent.click(confirmPasswordToggleBtn);

    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");
  });
});

jest.mock("axios");

describe("API Integration on Reset Password Page", () => {
  const view = () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
  };

  const updateSucceed = {
    success: 200,
    data: {
      meesage: "Password changed successfully",
      status: "Success",
    },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("submits the form when data valid", async () => {
    axios.patch.mockResolvedValueOnce(updateSucceed);

    view();

    const resetPasswordButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(resetPasswordButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  });
});
