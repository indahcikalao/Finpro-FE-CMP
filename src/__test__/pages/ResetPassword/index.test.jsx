import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import ResetPassword from "../../../pages/resetPassword";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

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
});

// describe("API Integration on Reset Password Page", () => {
//   const view = () => {
//     render(
//       <BrowserRouter>
//         <ResetPassword />
//       </BrowserRouter>
//     );
//   };

//   afterEach(cleanup);

//   it("submits the form with valid data", async () => {
//     axios.post.mockResolvedValueOnce({
//       success: 200,
//     });

//     view();

//     const input = screen.getAllByRole("textbox");
//     const emailInput = input[0];
//     const usernameInput = input[1];

//     const passInput = screen.getAllByTestId("password-input");
//     const passwordInput = passInput[0];
//     const passwordConfirmationInput = passInput[1];

//     const resetPasswordButton = screen.getByRole("button", {
//       name: /reset password/i,
//     });

//     fireEvent.change(emailInput, {
//       target: { value: "test@example.com" },
//     });
//     fireEvent.change(usernameInput, {
//       target: { value: "test" },
//     });
//     fireEvent.change(passwordInput, {
//       target: { value: "Test123@" },
//     });
//     fireEvent.change(passwordConfirmationInput, {
//       target: { value: "Test123@" },
//     });

//     fireEvent.click(resetPasswordButton);

//     await waitFor(() => {
//       expect(screen.getByText("Password Updated")).toBeInTheDocument();
//     });
//   });
// });
