import { render, screen } from "@testing-library/react";
import ResetPassword from "../../../pages/resetPassword";
import React from "react";
import { BrowserRouter } from "react-router-dom";

describe("Login Page", () => {
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
});
