import { render, screen, waitFor } from "@testing-library/react";
import ResetPassword from "../../../pages/resetPassword";
import React from "react";
import { BrowserRouter } from "react-router-dom";

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

    const input = screen.getAllByRole("input");

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
});
